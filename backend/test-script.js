import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateScript } from './services/scriptGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function test() {
  try {
    console.log("STARTING SCRIPT GENERATION");
    const result = await generateScript({context: "test topic", tone: "excited"});
    console.log("RESULT:", result);
  } catch (err) {
    console.error("CAUGHT ERROR:", err);
  }
}
test();
