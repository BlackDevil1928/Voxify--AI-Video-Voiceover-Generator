import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes for long operations
});

/**
 * Helper to resolve relative backend URLs to absolute URLs in production.
 */
export function getServerUrl(path) {
  if (!path) return path;
  if (path.startsWith('http')) return path;
  // Remove trailing /api to get the root backend URL, then append path
  const serverRoot = BASE_URL.replace(/\/api\/?$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverRoot}${normalizedPath}`;
}

/**
 * Upload a video file.
 * @param {File} file - The video file to upload
 * @param {function} onProgress - Progress callback (0-100)
 */
export async function uploadVideo(file, onProgress) {
  const formData = new FormData();
  formData.append('video', file);

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });
  return data;
}

/**
 * Generate a voiceover script.
 */
export async function generateScript({ jobId, context, tone, language }) {
  const { data } = await api.post('/generate-script', { jobId, context, tone, language });
  return data;
}

/**
 * Generate voice audio from script.
 */
export async function generateVoice({ jobId, script, voiceId, style }) {
  const { data } = await api.post('/generate-voice', { jobId, script, voiceId, style });
  return data;
}

/**
 * Merge audio with video.
 */
export async function mergeVideo({ jobId, keepOriginalAudio }) {
  const { data } = await api.post('/merge', { jobId, keepOriginalAudio });
  return data;
}

/**
 * Get available voices.
 */
export async function getVoices() {
  const { data } = await api.get('/voices');
  return data.voices;
}

/**
 * Get job status.
 */
export async function getJobStatus(jobId) {
  const { data } = await api.get(`/job/${jobId}`);
  return data;
}

/**
 * Health check.
 */
export async function healthCheck() {
  const { data } = await api.get('/health');
  return data;
}

export default api;
