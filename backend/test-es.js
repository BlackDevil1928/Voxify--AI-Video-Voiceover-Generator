import dotenv from 'dotenv';
dotenv.config();

import { generateScript } from './services/scriptGenerator.js';

(async () => {
  try {
    console.log('Testing Spanish script generation...');
    const res = await generateScript({
      context: 'A product demo showcasing a new fitness tracker',
      tone: 'professional',
      language: 'es',
      duration: 10,
    });
    console.log('Result:', res);
  } catch (err) {
    console.error('Crash!', err);
  }
})();
