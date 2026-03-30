import React from 'react';
import { PromptingIsAllYouNeed } from "@/components/ui/animated-hero-section";

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-brand-500/30">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05] bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/voxify-logo.png" 
              alt="Voxify Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
            />
            <span className="font-display font-black text-2xl tracking-tighter">Voxify</span>
          </div>
          <button 
            onClick={onStart}
            className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            Enter Dashboard →
          </button>
        </div>
      </nav>

      {/* ─── Bold Shadcn Hero Section (Pong Canvas Background) ─── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pt-24 pb-12">
        <PromptingIsAllYouNeed />
        
        {/* Foreground Content safely hovering over canvas */}
        <div className="relative z-10 flex flex-col items-center mt-auto xl:mb-20 animate-fade-in pointer-events-none">
          <div className="max-w-3xl text-center px-4 pointer-events-auto">
            <p className="text-xl sm:text-2xl text-gray-400 font-light leading-relaxed mb-8 drop-shadow-xl backdrop-blur-md bg-black/40 border border-white/5 py-4 px-6 rounded-2xl">
              Stop recording endless retakes. Voxify uses cutting-edge AI to instantly write, generate, and perfectly sync studio voiceovers to your videos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onStart}
                className="px-10 py-5 bg-white text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 group"
              >
                Start Creating Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4 text-gray-500 font-semibold text-sm backdrop-blur-md bg-black/40 border border-white/5 py-3 px-6 rounded-full">
                <span>Powered by</span>
                <div className="flex items-center gap-3 text-white/70">
                  <span>🤗 Hugging Face</span>
                  <img src="/murf-logo.png" alt="Murf AI" className="h-4 opacity-80 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid (Bold Theme) ─── */}
      <section className="relative py-32 bg-black border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Radically simple workflow.</h2>
            <p className="text-xl text-gray-500 font-light">Eliminate the friction between idea and production.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Contextual Scripts</h3>
              <p className="text-gray-400 leading-relaxed">
                Provide a prompt. Our integrated LLMs instantly formulate a perfectly timed voiceover script tailored to your video's duration.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Studio Vocals</h3>
              <p className="text-gray-400 leading-relaxed">
                Say goodbye to generic text-to-speech. Select from an elite roster of emotional, hyper-realistic voice profiles.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Zero Friction Sync</h3>
              <p className="text-gray-400 leading-relaxed">
                The final render is stitched automatically on the server. Just upload, prompt, and download the finished MP4.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 border-t border-white/[0.05] flex items-center justify-center px-6">
        <p className="text-sm text-gray-600 font-semibold tracking-wide">
          &copy; {new Date().getFullYear()} VOXIFY AI • BOLD SaaS V2
        </p>
      </footer>
    </div>
  );
}
