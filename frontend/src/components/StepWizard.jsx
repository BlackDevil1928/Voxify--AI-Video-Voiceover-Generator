import React from 'react';

/**
 * Step wizard showing progress through the pipeline.
 * Each step shows a number, label, and connecting line.
 */
export default function StepWizard({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 px-4">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={label}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-500 
                  ${isCompleted
                    ? 'bg-gradient-to-br from-brand-500 to-accent-purple text-white shadow-lg shadow-brand-500/40'
                    : isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 animate-pulse-glow'
                      : 'bg-white/[0.06] text-white/30 border border-white/[0.1]'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 whitespace-nowrap
                  ${isActive ? 'text-brand-400' : isCompleted ? 'text-white/60' : 'text-white/25'}
                `}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 mb-6 relative">
                <div className="absolute inset-0 bg-white/[0.08] rounded-full" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-accent-purple rounded-full transition-all duration-700"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
