import { HfInference } from '@huggingface/inference';
import { ApiError } from '../middleware/errorHandler.js';

const withTimeout = (promise, ms) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

// Tone-specific prompt templates for script generation
const TONE_PROMPTS = {
  professional: 'Write a professional, authoritative voiceover script.',
  excited: 'Write an upbeat, energetic, and exciting voiceover script.',
  storytelling: 'Write a captivating, narrative-style voiceover script.',
  youtube: 'Write a casual, engaging YouTube-style voiceover script with a strong hook.',
  ad: 'Write a persuasive, punchy advertising voiceover script.',
  documentary: 'Write a calm, informative documentary-style voiceover script.',
};

const LANGUAGE_INSTRUCTIONS = {
  en: 'Write the script in English.',
  hi: 'Write the script in Hindi (Devanagari script).',
};

// Models to try in order (free HF Inference tier)
const MODELS = [
  'meta-llama/Llama-3.2-3B-Instruct',
  'mistralai/Mistral-Nemo-Instruct-2407',
  'HuggingFaceH4/zephyr-7b-beta',
  'Qwen/Qwen2.5-72B-Instruct',
];

/**
 * Try generating a script via Hugging Face Inference API.
 * Uses the official SDK with automatic provider routing.
 */
async function tryHuggingFace(apiToken, systemPrompt, userMessage) {
  const hf = new HfInference(apiToken);

  for (const model of MODELS) {
    // Try chatCompletion first, then textGeneration as fallback
    for (const method of ['chat', 'text']) {
      try {
        console.log(`🔄 Trying ${method} with model: ${model}`);

        if (method === 'chat') {
          const response = await withTimeout(hf.chatCompletion({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            max_tokens: 400,
            temperature: 0.7,
          }), 10000);
          const text = response.choices?.[0]?.message?.content || '';
          if (text.length >= 20) {
            console.log(`✅ Script generated via chatCompletion: ${model}`);
            return text;
          }
        } else {
          const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nVoiceover script:`;
          const response = await withTimeout(hf.textGeneration({
            model,
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: 400,
              temperature: 0.7,
              top_p: 0.9,
              return_full_text: false,
            },
          }), 10000);
          const text = response.generated_text || '';
          if (text.length >= 20) {
            console.log(`✅ Script generated via textGeneration: ${model}`);
            return text;
          }
        }
      } catch (err) {
        const msg = err.message || String(err);
        console.warn(`⚠️  ${method}/${model} failed: ${msg.slice(0, 120)}`);

        // Fatal auth errors — stop immediately
        if (msg.includes('401') || msg.includes('Unauthorized')) {
          throw new ApiError(
            'Hugging Face token is invalid. Get a new one at https://huggingface.co/settings/tokens — enable "Make calls to Inference Providers".',
            401
          );
        }
      }
    }
  }
  return null; // All models failed
}

// ──────────────────────────────────────────────────────────
// Built-in template fallback — guarantees the app works
// even when the HF API is down or tokens are misconfigured.
// ──────────────────────────────────────────────────────────

const HOOKS = {
  professional: [
    'In a world driven by innovation, this changes everything.',
    'What if the future arrived sooner than you expected?',
    'Excellence isn\'t born — it\'s engineered.',
    'This is the breakthrough you\'ve been waiting for.',
  ],
  excited: [
    'Hold on tight — you\'re about to see something incredible!',
    'Get ready, because this is going to blow your mind!',
    'You won\'t believe what\'s coming next!',
    'This is the moment that changes everything!',
  ],
  storytelling: [
    'It all began with a simple idea that would change the world.',
    'Some stories deserve to be told — and this is one of them.',
    'Behind every great innovation lies an untold story.',
    'The journey started where no one expected.',
  ],
  youtube: [
    'Hey everyone! You\'re going to love what I\'m about to show you!',
    'What\'s up! Today we\'re diving into something amazing!',
    'Stop scrolling — this is the video you need to watch right now!',
    'I can\'t believe I\'m finally sharing this with you!',
  ],
  ad: [
    'Introducing something that will redefine what\'s possible.',
    'Are you ready to experience the next level?',
    'Don\'t miss out — this is your moment.',
    'The wait is over. The future is here.',
  ],
  documentary: [
    'In the vast landscape of human achievement, few moments stand out like this.',
    'What we\'re about to explore will reshape your understanding.',
    'The story that follows is one of remarkable discovery.',
    'For decades, experts have sought to understand this phenomenon.',
  ],
};

const BODY_TEMPLATES = {
  en: [
    'Our focus right now is on {context}. Every detail you see has been carefully crafted to deliver an exceptional experience. ',
    'When you look closely at {context}, you realize it represents a new standard in quality and performance. ',
    'The incredible attention to detail around {context} is what really sets things apart — every element serves a specific purpose. ',
    'The results surrounding {context} speak for themselves: powerful, refined, and built to make an impact. ',
    'To truly appreciate {context}, you have to experience it firsthand. ',
    'Behind the scenes, cutting-edge technology gives {context} a unique and powerful advantage. ',
    'This isn\'t just another video. It\'s a complete transformation in how we approach {context}. ',
    'Users everywhere are already discovering what makes {context} stand head and shoulders above the rest. ',
    'The perfect combination of innovation and practicality makes this look into {context} truly one of a kind. ',
  ],
  hi: [
    'आज हमारा ध्यान {context} पर है। यहाँ हर विवरण को एक बेहतरीन अनुभव देने के लिए सावधानी से बनाया गया है। ',
    'जब आप {context} को करीब से देखते हैं, तो आपको एहसास होता है कि यह गुणवत्ता और प्रदर्शन का नया मानक स्थापित करता है। ',
    '{context} के इर्द-गिर्द शानदार डिज़ाइन ही इसे अलग बनाता है — हर हिस्सा एक खास मकसद पूरा करता है। ',
    '{context} के नतीजे खुद बोलते हैं: दमदार, शानदार और गहरा प्रभाव छोड़ने वाले। ',
    'अगर आप {context} को सच में समझना चाहते हैं, तो आपको इसे खुद आज़माना होगा। ',
    'ज़रा सोचिए, अत्याधुनिक तकनीक किस तरह {context} को एक खास फायदा देती है। ',
    'यह कोई आम वीडियो नहीं है। यह सोचने का पूरा नज़रिया बदल देता है कि हम {context} को कैसे देखते हैं। ',
    'दुनिया भर के लोग यह जान चुके हैं कि क्यों {context} बाकी सब से कहीं आगे है। ',
  ],
};

/**
 * Generate a script using built-in templates when AI API is unavailable.
 */
function generateFallbackScript(context, tone, language, wordCount) {
  console.log('📝 Using built-in template generator (HF API unavailable)');

  const hooks = HOOKS[tone] || HOOKS.professional;
  const hook = hooks[Math.floor(Math.random() * hooks.length)];

  const bodyParts = BODY_TEMPLATES[language] || BODY_TEMPLATES.en;
  // Shuffle and pick enough sentences to reach target word count
  const shuffled = [...bodyParts].sort(() => Math.random() - 0.5);
  let body = '';
  let currentWordCount = hook.split(/\s+/).length;

  for (const part of shuffled) {
    const filled = part.replace('{context}', context);
    const partWords = filled.split(/\s+/).length;
    if (currentWordCount + partWords > wordCount + 20) break;
    body += filled;
    currentWordCount += partWords;
  }

  const script = `${hook} ${body}`.trim();
  return { script, hook, isTemplate: true };
}

/**
 * Generate a voiceover script using Hugging Face Inference API,
 * with a built-in template fallback that guarantees the app works.
 *
 * @param {object} options
 * @param {string} options.context - Video context/topic description
 * @param {string} options.tone - Tone of the voiceover
 * @param {string} options.language - Language code (en|hi)
 * @param {number} options.duration - Approximate video duration in seconds
 * @returns {Promise<{script: string, hook: string}>}
 */
export async function generateScript({ context, tone = 'professional', language = 'en', duration = 60 }) {
  const wordCount = Math.min(150, Math.max(50, Math.round(duration * 2.5)));
  const toneInstruction = TONE_PROMPTS[tone] || TONE_PROMPTS.professional;
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;

  const systemPrompt = `You are an expert voiceover script writer for videos.
${toneInstruction}
${langInstruction}

Rules:
- You MUST write a script that is EXACTLY ${wordCount} words long, because the video is ${Math.round(duration)} seconds long.
- The script MUST be highly relevant to the provided video topic. Do NOT write generic text.
- The first sentence MUST be a powerful, attention-grabbing hook about the topic.
- Keep sentences short and punchy for voice narration.
- Do NOT include stage directions, timestamps, or speaker labels.
- Output ONLY the script text, nothing else.`;

  const userMessage = `Write a voiceover script strictly about this video topic: "${context}". Make sure it is exactly ${wordCount} words long to perfectly fit the timing.`;

  // ── Try Hugging Face API ──
  const apiToken = process.env.HUGGINGFACE_API_TOKEN;
  if (apiToken && apiToken !== 'hf_xxxxxxxxxxxxxxxxxxxxx') {
    try {
      const aiText = await tryHuggingFace(apiToken, systemPrompt, userMessage);
      if (aiText) {
        const cleaned = aiText.replace(/^["'\s]+|["'\s]+$/g, '').replace(/\n{3,}/g, '\n\n').trim();
        const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
        return {
          script: cleaned,
          hook: sentences[0]?.trim() || cleaned.slice(0, 100),
          wordCount: cleaned.split(/\s+/).length,
          tone,
          language,
        };
      }
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) throw err;
      console.warn('⚠️  All HF models failed, falling back to template generator');
    }
  } else {
    console.log('ℹ️  No Hugging Face token configured, using template generator');
  }

  // ── Fallback: built-in template generator ──
  const result = generateFallbackScript(context, tone, language, wordCount);
  return {
    script: result.script,
    hook: result.hook,
    wordCount: result.script.split(/\s+/).length,
    tone,
    language,
  };
}
