import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Murf AI voice options
// Voice IDs must exactly match supported voice names in the Murf API library
const VOICE_MAP = {
  // English voices
  'en-male':   { voiceId: 'Ken',     locale: 'en-US', name: 'Ken (Male, US English)' },
  'en-female': { voiceId: 'Natalie', locale: 'en-US', name: 'Natalie (Female, US English)' },
  // Hindi voices
  'hi-male':   { voiceId: 'Rahul',   locale: 'hi-IN', name: 'Rahul (Male, Hindi)' },
  'hi-female': { voiceId: 'Ayushi',  locale: 'hi-IN', name: 'Ayushi (Female, Hindi)' },
};

/**
 * Retrieve available voices for the frontend to display.
 */
export function getAvailableVoices() {
  return Object.entries(VOICE_MAP).map(([key, val]) => ({
    id: key,
    ...val,
    language: key.startsWith('hi') ? 'Hindi' : 'English',
    gender: key.includes('male') && !key.includes('female') ? 'Male' : 'Female',
  }));
}

/**
 * Generate voice audio from script text using Murf AI API.
 *
 * Docs: https://murf.ai/resources/api
 * Endpoint: POST https://api.murf.ai/v1/speech/generate
 *
 * @param {object} options
 * @param {string} options.script - The voiceover script text
 * @param {string} options.voiceId - Voice key from VOICE_MAP (e.g. 'en-male')
 * @param {string} options.style - Speaking style (default: 'Conversational')
 * @returns {Promise<{audioPath: string, audioFilename: string, duration: number}>}
 */
export async function generateVoice({ script, voiceId = 'en-male', style = 'Conversational' }) {
  const apiKey = process.env.MURF_API_KEY;
  if (!apiKey || apiKey === 'your_murf_api_key_here') {
    throw new ApiError(
      'Murf AI API key is not configured. Get your key at https://murf.ai/resources/api and set MURF_API_KEY in backend/.env',
      500
    );
  }

  const voice = VOICE_MAP[voiceId];
  if (!voice) {
    throw new ApiError(`Unknown voice: ${voiceId}. Available: ${Object.keys(VOICE_MAP).join(', ')}`, 400);
  }

  const audioFilename = `voice_${uuidv4()}.mp3`;
  const audioPath = path.join(__dirname, '..', 'uploads', 'output', audioFilename);

  // Ensure output directory exists
  const outputDir = path.dirname(audioPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log(`🎙️  Calling Murf AI: voice=${voice.voiceId}, locale=${voice.locale}`);

    // Murf AI Text-to-Speech API call (per official docs)
    const requestBody = {
      text: script,
      voiceId: voice.voiceId,
      style,
      format: 'MP3',
      sampleRate: 44100,
      channelType: 'MONO',
      modelVersion: 'GEN2',
    };

    console.log('📤 Murf request body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      requestBody,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 120000,
      }
    );

    console.log('📥 Murf response keys:', Object.keys(response.data || {}));

    // Handle response: Murf returns either audioFile URL or encoded audio
    const audioUrl = response.data?.audioFile;
    const encodedAudio = response.data?.encodedAudio;
    const audioDuration = response.data?.audioDuration || response.data?.audio_duration || null;

    if (encodedAudio) {
      // Audio returned as base64 string
      const audioBuffer = Buffer.from(encodedAudio, 'base64');
      fs.writeFileSync(audioPath, audioBuffer);
      console.log(`✅ Murf audio saved (base64): ${audioFilename}`);
    } else if (audioUrl) {
      // Audio returned as URL — download it
      const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });
      fs.writeFileSync(audioPath, Buffer.from(audioResponse.data));
      console.log(`✅ Murf audio saved (URL): ${audioFilename}`);
    } else {
      console.error('❌ Murf response data:', JSON.stringify(response.data));
      throw new ApiError('Murf AI did not return audio. Check API key and voice settings.', 502);
    }

    return {
      audioPath,
      audioFilename,
      duration: audioDuration,
      voiceName: voice.name,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;

    // Log full error details for debugging
    const status = err.response?.status;
    const errorData = err.response?.data;
    console.error(`❌ Murf AI error [${status}]:`, JSON.stringify(errorData || err.message));

    if (status === 400) {
      const detail = typeof errorData === 'string'
        ? errorData
        : errorData?.message || errorData?.error || JSON.stringify(errorData);
      throw new ApiError(`Murf AI rejected the request: ${detail}`, 400);
    }
    if (status === 401 || status === 403) {
      throw new ApiError(
        'Murf AI API key is invalid or expired. Get a new key at https://murf.ai/resources/api',
        status
      );
    }
    if (status === 429) {
      throw new ApiError('Murf AI rate limit exceeded. Please try later.', 429);
    }

    throw new ApiError(`Voice generation failed: ${err.message}`, 502);
  }
}
