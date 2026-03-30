import React from 'react';
import Header from './components/Header';
import StepWizard from './components/StepWizard';
import VideoUpload from './components/VideoUpload';
import VideoPreview from './components/VideoPreview';
import VoiceSelector from './components/VoiceSelector';
import ScriptDisplay from './components/ScriptDisplay';
import GenerateButton from './components/GenerateButton';
import ProgressIndicator from './components/ProgressIndicator';
import OutputPlayer from './components/OutputPlayer';
import { useVoiceover, STEPS } from './hooks/useVoiceover';

export default function App() {
  const v = useVoiceover();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Step Wizard */}
      <div className="max-w-3xl mx-auto w-full px-4">
        <StepWizard steps={v.stepLabels} currentStep={v.currentStep} />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-16">
        {/* Error Alert */}
        {v.error && (
          <div className="mb-6 glass-card p-4 border-red-500/30 bg-red-500/[0.08] animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-lg">⚠️</span>
              <div className="flex-1">
                <p className="text-red-300 text-sm font-medium">{v.error}</p>
                <button
                  onClick={() => v.setError(null)}
                  className="text-xs text-red-400/60 hover:text-red-400 mt-1 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 0: Upload ─── */}
        {v.currentStep === STEPS.UPLOAD && (
          <VideoUpload
            onUpload={v.handleUpload}
            loading={v.loading}
            uploadProgress={v.uploadProgress}
          />
        )}

        {/* ─── STEP 1: Configure ─── */}
        {v.currentStep === STEPS.CONFIGURE && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Video preview */}
            <div className="lg:col-span-2">
              <VideoPreview videoUrl={v.videoUrl} videoInfo={v.videoInfo} />
            </div>

            {/* Right: Configuration */}
            <div className="lg:col-span-3 space-y-6">
              <VoiceSelector
                tone={v.tone}
                setTone={v.setTone}
                language={v.language}
                setLanguage={v.setLanguage}
                voiceId={v.voiceId}
                setVoiceId={v.setVoiceId}
                context={v.context}
                setContext={v.setContext}
              />

              {/* Keep original audio toggle */}
              <div className="glass-card p-5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm text-white/70 font-medium">Mix with original audio</span>
                    <p className="text-xs text-white/30 mt-0.5">
                      Keep the original audio at low volume behind the voiceover
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={v.keepOriginalAudio}
                      onChange={(e) => v.setKeepOriginalAudio(e.target.checked)}
                      className="sr-only peer"
                      id="keep-audio-toggle"
                    />
                    <div className="w-11 h-6 bg-white/[0.1] peer-focus:ring-2 peer-focus:ring-brand-500/30 rounded-full peer peer-checked:bg-brand-600 transition-colors duration-200" />
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>

              <GenerateButton
                onClick={() => v.handleGenerate()}
                loading={v.loading}
                disabled={!v.context.trim()}
                label="Generate Voiceover"
              />

              {!v.context.trim() && (
                <p className="text-xs text-center text-white/25">
                  ↑ Enter a video topic/context above to enable generation
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 2: Generating ─── */}
        {v.currentStep === STEPS.GENERATE && (
          <div className="max-w-xl mx-auto space-y-6">
            <ProgressIndicator
              progress={v.generationProgress}
              currentAction={v.currentAction}
            />

            {v.script && (
              <ScriptDisplay
                script={v.script}
                hook={v.hook}
                onScriptChange={v.setScript}
              />
            )}
          </div>
        )}

        {/* ─── STEP 3: Output ─── */}
        {v.currentStep === STEPS.OUTPUT && (
          <div className="space-y-6">
            {v.script && (
              <ScriptDisplay
                script={v.script}
                hook={v.hook}
              />
            )}
            <OutputPlayer
              originalUrl={v.videoUrl}
              outputUrl={v.outputUrl}
              downloadUrl={v.downloadUrl}
              onReset={v.reset}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-white/[0.05]">
        <p className="text-xs text-white/20">
          VoiceForge AI · Powered by Hugging Face & Murf AI · Built with ❤️
        </p>
      </footer>
    </div>
  );
}
