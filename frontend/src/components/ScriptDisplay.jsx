import React from 'react';

/**
 * Editable script display with word count and hook highlight.
 */
export default function ScriptDisplay({ script, onScriptChange, hook }) {
  if (!script) return null;

  const wordCount = script.split(/\s+/).filter(Boolean).length;

  return (
    <div className="glass-card animate-slide-up overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-emerald" />
          Generated Script
        </h3>
        <span className="text-xs text-white/30 bg-white/[0.05] px-3 py-1 rounded-full">
          {wordCount} words
        </span>
      </div>

      {/* Hook highlight */}
      {hook && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
          <p className="text-xs font-semibold text-accent-purple uppercase tracking-wider mb-1">
            🎯 Hook (First 5 seconds)
          </p>
          <p className="text-sm text-white/80 italic">"{hook}"</p>
        </div>
      )}

      {/* Editable script area */}
      <div className="p-4">
        <textarea
          id="script-editor"
          value={script}
          onChange={(e) => onScriptChange?.(e.target.value)}
          rows={8}
          className="input-field resize-none font-mono text-sm leading-relaxed"
          placeholder="Your voiceover script will appear here..."
        />
        <p className="text-xs text-white/30 mt-2">
          ✏️ You can edit the script before generating the voiceover
        </p>
      </div>
    </div>
  );
}
