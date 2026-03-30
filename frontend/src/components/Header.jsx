import React from 'react';

/**
 * App header with branding and gradient title.
 */
export default function Header() {
  return (
    <header className="relative py-8 px-6 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Logo & Title */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-2xl shadow-lg shadow-brand-500/30">
          🎙️
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
          VoiceForge AI
        </h1>
      </div>

      <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto">
        Transform any video with professional AI-generated voiceovers in seconds
      </p>
    </header>
  );
}
