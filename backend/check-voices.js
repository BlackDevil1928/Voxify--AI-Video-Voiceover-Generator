import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.MURF_API_KEY;

if (!apiKey) {
  console.error("MURF_API_KEY is not set in backend/.env");
  process.exit(1);
}

async function getVoices() {
  try {
    const response = await axios.get('https://api.murf.ai/v1/speech/voices', {
      headers: {
        'api-key': apiKey,
        'Accept': 'application/json'
      }
    });

    const voices = response.data;
    
    console.log("--- ENGLISH VOICES ---");
    const enVoices = voices.filter(v => v.locale.startsWith('en'));
    enVoices.slice(0, 5).forEach(v => console.log(`${v.displayName} (${v.gender}): ${v.voiceId}`));
    
    console.log("\n--- HINDI VOICES ---");
    const hiVoices = voices.filter(v => v.locale.startsWith('hi'));
    hiVoices.forEach(v => console.log(`${v.displayName} (${v.gender}): ${v.voiceId}`));
    
  } catch (error) {
    console.error("Failed to fetch voices:", error.response?.data || error.message);
  }
}

getVoices();
