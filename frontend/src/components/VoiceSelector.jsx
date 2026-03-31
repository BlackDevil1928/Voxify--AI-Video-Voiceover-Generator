import React from 'react';

const TONES = [
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Corporate & authoritative' },
  { id: 'excited', label: 'Excited', icon: '⚡', desc: 'Energetic & upbeat' },
  { id: 'storytelling', label: 'Storytelling', icon: '📖', desc: 'Narrative & captivating' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', desc: 'Casual & engaging' },
  { id: 'ad', label: 'Ad / Promo', icon: '📢', desc: 'Punchy & persuasive' },
  { id: 'documentary', label: 'Documentary', icon: '🎬', desc: 'Calm & informative' },
];

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
];

const VOICES = [
  { id: 'en-male-1', label: 'Cooper', gender: 'Male', lang: 'en', icon: '🎙️' },
  { id: 'en-male-2', label: 'Wayne', gender: 'Male', lang: 'en', icon: '🎙️' },
  { id: 'en-male-3', label: 'Daniel', gender: 'Male', lang: 'en', icon: '🎙️' },
  { id: 'en-female-1', label: 'Alina', gender: 'Female', lang: 'en', icon: '🎤' },
  { id: 'en-female-2', label: 'Hazel', gender: 'Female', lang: 'en', icon: '🎤' },
  { id: 'en-female-3', label: 'Imani', gender: 'Female', lang: 'en', icon: '🎤' },

  { id: 'hi-male-1', label: 'Rahul', gender: 'Male', lang: 'hi', icon: '🎙️' },
  { id: 'hi-male-2', label: 'Amit', gender: 'Male', lang: 'hi', icon: '🎙️' },
  { id: 'hi-male-3', label: 'Shaan', gender: 'Male', lang: 'hi', icon: '🎙️' },
  { id: 'hi-female-1', label: 'Shweta', gender: 'Female', lang: 'hi', icon: '🎤' },
  { id: 'hi-female-2', label: 'Ayushi', gender: 'Female', lang: 'hi', icon: '🎤' },
  { id: 'hi-female-3', label: 'Kavya', gender: 'Female', lang: 'hi', icon: '🎤' },

  { id: 'es-male-1', label: 'Alejandro', gender: 'Male', lang: 'es', icon: '🎙️' },
  { id: 'es-male-2', label: 'Enrique', gender: 'Male', lang: 'es', icon: '🎙️' },
  { id: 'es-male-3', label: 'Carlos', gender: 'Male', lang: 'es', icon: '🎙️' },
  { id: 'es-female-1', label: 'Carla', gender: 'Female', lang: 'es', icon: '🎤' },
  { id: 'es-female-2', label: 'Elvira', gender: 'Female', lang: 'es', icon: '🎤' },
  { id: 'es-female-3', label: 'Carmen', gender: 'Female', lang: 'es', icon: '🎤' },

  { id: 'fr-male-1', label: 'Maxime', gender: 'Male', lang: 'fr', icon: '🎙️' },
  { id: 'fr-male-2', label: 'Axel', gender: 'Male', lang: 'fr', icon: '🎙️' },
  { id: 'fr-male-3', label: 'Guillaume', gender: 'Male', lang: 'fr', icon: '🎙️' },
  { id: 'fr-female-1', label: 'Adélie', gender: 'Female', lang: 'fr', icon: '🎤' },
  { id: 'fr-female-2', label: 'Justine', gender: 'Female', lang: 'fr', icon: '🎤' },
  { id: 'fr-female-3', label: 'Louise', gender: 'Female', lang: 'fr', icon: '🎤' },

  { id: 'de-male-1', label: 'Matthias', gender: 'Male', lang: 'de', icon: '🎙️' },
  { id: 'de-male-2', label: 'Björn', gender: 'Male', lang: 'de', icon: '🎙️' },
  { id: 'de-male-3', label: 'Ralf', gender: 'Male', lang: 'de', icon: '🎙️' },
  { id: 'de-female-1', label: 'Josephine', gender: 'Female', lang: 'de', icon: '🎤' },
  { id: 'de-female-2', label: 'Erna', gender: 'Female', lang: 'de', icon: '🎤' },
  { id: 'de-female-3', label: 'Lia', gender: 'Female', lang: 'de', icon: '🎤' },
];

/**
 * Voice configuration panel with tone, language, and voice selection.
 */
export default function VoiceSelector({
  tone, setTone,
  language, setLanguage,
  voiceId, setVoiceId,
  context, setContext,
}) {
  const filteredVoices = VOICES.filter((v) => v.lang === language);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Video Context / Topic */}
      <div className="glass-card p-5">
        <label className="section-label mb-3 block">Video Topic / Context</label>
        <textarea
          id="context-input"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          className="input-field resize-none text-sm"
          placeholder="Describe your video content (e.g., 'A product demo showcasing a new fitness tracker with key features like heart rate monitoring, GPS, and water resistance')"
        />
        <p className="text-xs text-white/25 mt-2">
          The AI uses this to generate a relevant voiceover script
        </p>
      </div>

      {/* Tone Selection */}
      <div className="glass-card p-5">
        <label className="section-label mb-3 block">Voiceover Tone</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`
                p-3 rounded-xl text-left transition-all duration-200
                ${tone === t.id
                  ? 'bg-brand-600/20 border border-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.icon}</span>
                <span className={`text-sm font-semibold ${tone === t.id ? 'text-brand-400' : 'text-white/70'}`}>
                  {t.label}
                </span>
              </div>
              <p className="text-xs text-white/30">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="glass-card p-5">
        <label className="section-label mb-3 block">Language</label>
        <div className="flex gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setLanguage(l.id);
                // Auto-switch voice to match language
                setVoiceId(`${l.id}-male-1`);
              }}
              className={`
                flex-1 p-4 rounded-xl text-center transition-all duration-200
                ${language === l.id
                  ? 'bg-brand-600/20 border border-brand-500/40'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
            >
              <span className="text-2xl block mb-1">{l.flag}</span>
              <span className={`text-sm font-medium ${language === l.id ? 'text-brand-400' : 'text-white/60'}`}>
                {l.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="glass-card p-5">
        <label className="section-label mb-3 block">AI Voice</label>
        <div className="grid grid-cols-2 gap-3">
          {filteredVoices.map((v) => (
            <button
              key={v.id}
              onClick={() => setVoiceId(v.id)}
              className={`
                p-4 rounded-xl text-center transition-all duration-200
                ${voiceId === v.id
                  ? 'bg-gradient-to-br from-brand-600/20 to-accent-purple/20 border border-brand-500/40 shadow-lg'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
            >
              <span className="text-2xl block mb-2">{v.icon}</span>
              <span className={`text-sm font-semibold block ${voiceId === v.id ? 'text-brand-400' : 'text-white/70'}`}>
                {v.label}
              </span>
              <span className="text-xs text-white/30">{v.gender}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
