import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateScript } from '../services/scriptGenerator.js';
import { generateVoice, getAvailableVoices } from '../services/voiceGenerator.js';
import { mergeAudioVideo, getVideoInfo } from '../services/videoProcessor.js';
import { uploadToFirebase } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory job store (production would use Redis/DB)
const jobs = new Map();

/**
 * POST /upload - Handle video file upload
 */
export async function uploadVideo(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError('No video file provided', 400);
    }

    const videoPath = req.file.path;
    const videoInfo = await getVideoInfo(videoPath);

    const jobId = path.parse(req.file.filename).name;
    jobs.set(jobId, {
      videoPath,
      videoFilename: req.file.filename,
      videoInfo,
      status: 'uploaded',
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      jobId,
      videoUrl: `/uploads/${req.file.filename}`,
      videoInfo,
      message: 'Video uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /generate-script - Generate voiceover script via Hugging Face
 */
export async function generateScriptHandler(req, res, next) {
  try {
    const { jobId, context, tone = 'professional', language = 'en' } = req.body;

    if (!context) {
      throw new ApiError('Video context/topic is required', 400);
    }

    const job = jobs.get(jobId);
    const duration = job?.videoInfo?.duration || 60;

    const result = await generateScript({ context, tone, language, duration });

    // Store in job
    if (job) {
      job.script = result.script;
      job.hook = result.hook;
      job.tone = tone;
      job.language = language;
      job.status = 'script_generated';
    }

    res.json({
      success: true,
      ...result,
      message: 'Script generated successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /generate-voice - Convert script to voice via Murf AI
 */
export async function generateVoiceHandler(req, res, next) {
  try {
    const { jobId, script, voiceId = 'en-male', style = 'Conversational' } = req.body;

    if (!script) {
      throw new ApiError('Script text is required', 400);
    }

    const result = await generateVoice({ script, voiceId, style });

    // Store in job
    const job = jobs.get(jobId);
    if (job) {
      job.audioPath = result.audioPath;
      job.audioFilename = result.audioFilename;
      job.status = 'voice_generated';
    }

    res.json({
      success: true,
      audioUrl: `/uploads/output/${result.audioFilename}`,
      voiceName: result.voiceName,
      duration: result.duration,
      message: 'Voice generated successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /merge - Merge audio with video using FFmpeg
 */
export async function mergeHandler(req, res, next) {
  try {
    const { jobId, keepOriginalAudio = false } = req.body;

    if (!jobId) {
      throw new ApiError('Job ID is required', 400);
    }

    const job = jobs.get(jobId);
    if (!job) {
      throw new ApiError('Job not found. Please upload a video first.', 404);
    }
    if (!job.videoPath) {
      throw new ApiError('No video file in this job', 400);
    }
    if (!job.audioPath) {
      throw new ApiError('No audio file in this job. Generate voice first.', 400);
    }

    const result = await mergeAudioVideo({
      videoPath: job.videoPath,
      audioPath: job.audioPath,
      keepOriginalAudio,
    });

    // Try Firebase upload (optional)
    const firebaseUrl = await uploadToFirebase(
      result.outputPath,
      `voiceovers/${result.outputFilename}`
    );

    job.outputPath = result.outputPath;
    job.outputFilename = result.outputFilename;
    job.outputUrl = firebaseUrl || `/uploads/output/${result.outputFilename}`;
    job.status = 'completed';

    res.json({
      success: true,
      outputUrl: job.outputUrl,
      downloadUrl: `/api/download/${jobId}`,
      firebaseUrl,
      message: 'Video merged successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /download/:id - Download final processed video
 */
export async function downloadVideo(req, res, next) {
  try {
    const { id } = req.params;
    const job = jobs.get(id);

    if (!job || !job.outputPath) {
      throw new ApiError('Processed video not found', 404);
    }

    if (!fs.existsSync(job.outputPath)) {
      throw new ApiError('Output file no longer exists on server', 404);
    }

    res.download(job.outputPath, `voiceover_${id}.mp4`);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /voices - Return available voice options
 */
export function getVoices(_req, res) {
  res.json({
    success: true,
    voices: getAvailableVoices(),
  });
}

/**
 * GET /job/:id - Get job status
 */
export function getJobStatus(req, res, next) {
  try {
    const job = jobs.get(req.params.id);
    if (!job) throw new ApiError('Job not found', 404);

    res.json({
      success: true,
      job: {
        status: job.status,
        videoInfo: job.videoInfo,
        script: job.script,
        hook: job.hook,
        outputUrl: job.outputUrl,
        createdAt: job.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
