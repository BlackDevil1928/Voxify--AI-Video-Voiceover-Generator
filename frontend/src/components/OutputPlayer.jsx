import React, { useState } from 'react';

/**
 * Output player with before/after comparison and download button.
 */
export default function OutputPlayer({ originalUrl, outputUrl, downloadUrl, onReset }) {
  const [view, setView] = useState('after'); // 'before' | 'after' | 'split'

  if (!outputUrl) return null;

  return (
    <div className="animate-slide-up space-y-6">
      {/* Success banner */}
      <div className="glass-card p-5 border-accent-emerald/20 bg-accent-emerald/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center text-lg">
            ✅
          </div>
          <div>
            <h3 className="text-white font-semibold">Voiceover Complete!</h3>
            <p className="text-white/40 text-sm">Your video with AI voiceover is ready</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-center gap-2">
        {[
          { id: 'after', label: 'Final Video' },
          { id: 'before', label: 'Original' },
          { id: 'split', label: 'Compare' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${view === tab.id
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.05]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Video Players */}
      {view === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-white/40 uppercase">Before</span>
            </div>
            <div className="aspect-video bg-black/50">
              <video src={originalUrl} controls className="w-full h-full object-contain" id="compare-original" />
            </div>
          </div>
          <div className="glass-card overflow-hidden border-brand-500/20">
            <div className="px-4 py-2 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-brand-400 uppercase">After (With Voiceover)</span>
            </div>
            <div className="aspect-video bg-black/50">
              <video src={outputUrl} controls className="w-full h-full object-contain" id="compare-output" />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-2 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-white/40 uppercase">
              {view === 'after' ? '🎙️ With AI Voiceover' : '📹 Original Video'}
            </span>
          </div>
          <div className="aspect-video bg-black/50">
            <video
              src={view === 'after' ? outputUrl : originalUrl}
              controls
              autoPlay={view === 'after'}
              className="w-full h-full object-contain"
              id="output-video"
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4">
        <a
          href={downloadUrl}
          className="btn-primary"
          download
          id="download-btn"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download Video
        </a>
        <button onClick={onReset} className="btn-secondary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Create Another
        </button>
      </div>
    </div>
  );
}
