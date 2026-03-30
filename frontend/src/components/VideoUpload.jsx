import React, { useRef, useState, useCallback } from 'react';

/**
 * Drag-and-drop video upload component with file validation.
 */
export default function VideoUpload({ onUpload, loading, uploadProgress }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const validateAndSet = useCallback((file) => {
    if (!file) return;

    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|avi|webm|mkv)$/i)) {
      alert('Please upload a valid video file (MP4, MOV, AVI, WebM, or MKV)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('File is too large. Maximum size is 100MB.');
      return;
    }

    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSet(file);
  }, [validateAndSet]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = useCallback((e) => {
    validateAndSet(e.target.files[0]);
  }, [validateAndSet]);

  const handleUploadClick = useCallback(() => {
    if (selectedFile) onUpload(selectedFile);
  }, [selectedFile, onUpload]);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        id="video-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`
          glass-card relative cursor-pointer p-12 text-center
          transition-all duration-300 group
          ${isDragging
            ? 'border-brand-500 bg-brand-500/10 scale-[1.02]'
            : 'hover:border-white/20 hover:bg-white/[0.06]'
          }
          ${selectedFile ? 'border-brand-500/30' : ''}
        `}
      >
        {/* Upload icon */}
        <div className={`
          w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${selectedFile
            ? 'bg-brand-500/20 text-brand-400'
            : 'bg-white/[0.05] text-white/30 group-hover:text-white/50 group-hover:bg-white/[0.08]'
          }
        `}>
          {selectedFile ? (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ) : (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </div>

        {selectedFile ? (
          <div>
            <p className="text-white font-semibold text-lg mb-1">{selectedFile.name}</p>
            <p className="text-white/40 text-sm">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-white/70 font-medium text-lg mb-2">
              {isDragging ? 'Drop your video here' : 'Drag & drop your video'}
            </p>
            <p className="text-white/30 text-sm">
              or click to browse • MP4, MOV, AVI, WebM • Max 100MB
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="video-input"
        />
      </div>

      {/* Upload Progress */}
      {loading && (
        <div className="mt-6 glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Uploading...</span>
            <span className="text-sm font-semibold text-brand-400">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !loading && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => { setSelectedFile(null); inputRef.current.value = ''; }}
            className="btn-secondary text-sm"
          >
            Change File
          </button>
          <button onClick={handleUploadClick} className="btn-primary text-sm" id="upload-btn">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload & Continue
          </button>
        </div>
      )}
    </div>
  );
}
