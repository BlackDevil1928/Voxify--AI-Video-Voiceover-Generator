import React from 'react';

const PHASE_DETAILS = [
  { label: 'Generating Script', icon: '📝', threshold: 0 },
  { label: 'Creating Voice', icon: '🎙️', threshold: 34 },
  { label: 'Merging Video', icon: '🎬', threshold: 67 },
];

/**
 * Multi-phase progress indicator shown during generation.
 */
export default function ProgressIndicator({ progress, currentAction }) {
  const currentPhase = PHASE_DETAILS.reduce(
    (acc, phase, i) => (progress >= phase.threshold ? i : acc),
    0
  );

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Current action */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600/15 rounded-full">
          <svg className="animate-spin h-4 w-4 text-brand-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-brand-300">{currentAction || 'Processing...'}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-white/[0.06] rounded-full overflow-hidden mb-6">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full animate-shimmer"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Phase indicators */}
      <div className="grid grid-cols-3 gap-3">
        {PHASE_DETAILS.map((phase, i) => {
          const isActive = i === currentPhase;
          const isCompleted = i < currentPhase;

          return (
            <div
              key={phase.label}
              className={`
                text-center p-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-brand-600/15 border border-brand-500/20' : ''}
                ${isCompleted ? 'opacity-60' : ''}
              `}
            >
              <span className="text-xl block mb-1">
                {isCompleted ? '✅' : phase.icon}
              </span>
              <span className={`text-xs font-medium ${isActive ? 'text-brand-400' : 'text-white/40'}`}>
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
