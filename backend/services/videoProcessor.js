import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { ApiError } from '../middleware/errorHandler.js';

// Configure fluent-ffmpeg to use the static binaries
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get video duration and metadata using ffprobe.
 *
 * @param {string} videoPath - Absolute path to the video file
 * @returns {Promise<{duration: number, width: number, height: number}>}
 */
export function getVideoInfo(videoPath) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        // ffprobe not installed or failed — return defaults gracefully.
        // FFmpeg is only strictly required at the merge step.
        console.warn('⚠️  ffprobe unavailable, skipping video metadata:', err.message);
        resolve({
          duration: 60,   // assume 60s so script generation still works
          width: 0,
          height: 0,
          format: 'unknown',
        });
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream?.width || 0,
        height: videoStream?.height || 0,
        format: metadata.format.format_name,
      });
    });
  });
}

/**
 * Merge audio track with video file using FFmpeg.
 * Handles cases where audio is longer/shorter than video.
 *
 * @param {object} options
 * @param {string} options.videoPath - Path to the original video
 * @param {string} options.audioPath - Path to the generated audio
 * @param {boolean} options.keepOriginalAudio - Mix with original audio (default: false)
 * @returns {Promise<{outputPath: string, outputFilename: string}>}
 */
export function mergeAudioVideo({ videoPath, audioPath, keepOriginalAudio = false }) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(videoPath)) {
      return reject(new ApiError('Video file not found', 404));
    }
    if (!fs.existsSync(audioPath)) {
      return reject(new ApiError('Audio file not found', 404));
    }

    const outputFilename = `final_${uuidv4()}.mp4`;
    const outputPath = path.join(__dirname, '..', 'uploads', 'output', outputFilename);

    const command = ffmpeg()
      .input(videoPath)
      .input(audioPath);

    if (keepOriginalAudio) {
      // Mix original audio with new voiceover
      command
        .complexFilter([
          '[0:a]volume=0.3[original]',
          '[1:a]volume=1.0[voiceover]',
          '[original][voiceover]amix=inputs=2:duration=first:dropout_transition=2[audio]',
        ])
        .outputOptions([
          '-map', '0:v',
          '-map', '[audio]',
          '-c:v', 'copy',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-shortest',
        ]);
    } else {
      // Replace original audio with voiceover
      command
        .outputOptions([
          '-map', '0:v',
          '-map', '1:a',
          '-c:v', 'copy',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-shortest',    // Trim to shortest stream duration
        ]);
    }

    command
      .output(outputPath)
      .on('start', (cmdLine) => {
        console.log('🎬 FFmpeg started:', cmdLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`   Processing: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('✅ FFmpeg merge complete:', outputFilename);
        resolve({ outputPath, outputFilename });
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err.message);
        reject(new ApiError(`Video processing failed: ${err.message}`, 500));
      })
      .run();
  });
}
