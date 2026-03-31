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
  'en-male-1':   { voiceId: 'en-US-cooper',    locale: 'en-US', name: 'Cooper (Male, US)' },
  'en-male-2':   { voiceId: 'en-US-wayne',     locale: 'en-US', name: 'Wayne (Male, US)' },
  'en-male-3':   { voiceId: 'en-US-daniel',    locale: 'en-US', name: 'Daniel (Male, US)' },
  'en-female-1': { voiceId: 'en-US-alina',     locale: 'en-US', name: 'Alina (Female, US)' },
  'en-female-2': { voiceId: 'en-UK-hazel',     locale: 'en-GB', name: 'Hazel (Female, UK)' },
  'en-female-3': { voiceId: 'en-US-imani',     locale: 'en-US', name: 'Imani (Female, US)' },

  // Hindi voices
  'hi-male-1':   { voiceId: 'hi-IN-rahul',     locale: 'hi-IN', name: 'Rahul (Male, Hindi)' },
  'hi-male-2':   { voiceId: 'hi-IN-amit',      locale: 'hi-IN', name: 'Amit (Male, Hindi)' },
  'hi-male-3':   { voiceId: 'hi-IN-shaan',     locale: 'hi-IN', name: 'Shaan (Male, Hindi)' },
  'hi-female-1': { voiceId: 'hi-IN-shweta',    locale: 'hi-IN', name: 'Shweta (Female, Hindi)' },
  'hi-female-2': { voiceId: 'hi-IN-ayushi',    locale: 'hi-IN', name: 'Ayushi (Female, Hindi)' },
  'hi-female-3': { voiceId: 'hi-IN-kavya',     locale: 'hi-IN', name: 'Kavya (Female, Hindi)' },

  // Spanish voices
  'es-male-1':   { voiceId: 'es-MX-alejandro', locale: 'es-MX', name: 'Alejandro (Male, Mexico)' },
  'es-male-2':   { voiceId: 'es-ES-enrique',   locale: 'es-ES', name: 'Enrique (Male, Spain)' },
  'es-male-3':   { voiceId: 'es-MX-carlos',    locale: 'es-MX', name: 'Carlos (Male, Mexico)' },
  'es-female-1': { voiceId: 'es-ES-carla',     locale: 'es-ES', name: 'Carla (Female, Spain)' },
  'es-female-2': { voiceId: 'es-ES-elvira',    locale: 'es-ES', name: 'Elvira (Female, Spain)' },
  'es-female-3': { voiceId: 'es-ES-carmen',    locale: 'es-ES', name: 'Carmen (Female, Spain)' },

  // French voices
  'fr-male-1':   { voiceId: 'fr-FR-maxime',    locale: 'fr-FR', name: 'Maxime (Male, France)' },
  'fr-male-2':   { voiceId: 'fr-FR-axel',      locale: 'fr-FR', name: 'Axel (Male, France)' },
  'fr-male-3':   { voiceId: 'fr-FR-guillaume', locale: 'fr-FR', name: 'Guillaume (Male, France)' },
  'fr-female-1': { voiceId: 'fr-FR-adélie',    locale: 'fr-FR', name: 'Adélie (Female, France)' },
  'fr-female-2': { voiceId: 'fr-FR-justine',   locale: 'fr-FR', name: 'Justine (Female, France)' },
  'fr-female-3': { voiceId: 'fr-FR-louise',    locale: 'fr-FR', name: 'Louise (Female, France)' },

  // German voices
  'de-male-1':   { voiceId: 'de-DE-matthias',  locale: 'de-DE', name: 'Matthias (Male, Germany)' },
  'de-male-2':   { voiceId: 'de-DE-björn',     locale: 'de-DE', name: 'Björn (Male, Germany)' },
  'de-male-3':   { voiceId: 'de-DE-ralf',      locale: 'de-DE', name: 'Ralf (Male, Germany)' },
  'de-female-1': { voiceId: 'de-DE-josephine', locale: 'de-DE', name: 'Josephine (Female, Germany)' },
  'de-female-2': { voiceId: 'de-DE-erna',      locale: 'de-DE', name: 'Erna (Female, Germany)' },
  'de-female-3': { voiceId: 'de-DE-lia',       locale: 'de-DE', name: 'Lia (Female, Germany)' },
};

/**
 * Retrieve available voices for the frontend to display.
 */
export function getAvailableVoices() {
  return Object.entries(VOICE_MAP).map(([key, val]) => {
    let langName = 'English';
    if (key.startsWith('hi')) langName = 'Hindi';
    else if (key.startsWith('es')) langName = 'Spanish';
    else if (key.startsWith('fr')) langName = 'French';
    else if (key.startsWith('de')) langName = 'German';

    return {
      id: key,
      ...val,
      language: langName,
      gender: key.includes('male') && !key.includes('female') ? 'Male' : 'Female',
    };
  });
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
