import { Router } from 'express';
import upload from '../middleware/upload.js';
import {
  uploadVideo,
  generateScriptHandler,
  generateVoiceHandler,
  mergeHandler,
  downloadVideo,
  getVoices,
  getJobStatus,
} from '../controllers/videoController.js';

const router = Router();

// Video upload
router.post('/upload', upload.single('video'), uploadVideo);

// Script generation (Hugging Face)
router.post('/generate-script', generateScriptHandler);

// Voice generation (Murf AI)
router.post('/generate-voice', generateVoiceHandler);

// Merge audio + video (FFmpeg)
router.post('/merge', mergeHandler);

// Download final video
router.get('/download/:id', downloadVideo);

// Available voices
router.get('/voices', getVoices);

// Job status
router.get('/job/:id', getJobStatus);

export default router;
