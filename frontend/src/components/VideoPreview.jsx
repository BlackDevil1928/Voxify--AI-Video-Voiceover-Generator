import React from 'react';

/**
 * Video preview player for the uploaded original video.
 */
export default function VideoPreview({ videoUrl, videoInfo }) {
  if (!videoUrl) return null;

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          Original Video
        </h3>
      </div>

      <div className="relative aspect-video bg-black/50">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          id="original-video-preview"
        />
      </div>

      {/* Video info bar */}
      {videoInfo && (
        <div className="px-4 py-3 flex items-center gap-4 text-xs text-white/40 border-t border-white/[0.06]">
          {videoInfo.width > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              {videoInfo.width}×{videoInfo.height}
            </span>
          )}
          {videoInfo.duration > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.round(videoInfo.duration)}s
            </span>
          )}
        </div>
      )}
    </div>
  );
}
