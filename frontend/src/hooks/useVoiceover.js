import { useState, useCallback } from 'react';
import * as api from '../api/client';

/**
 * STEPS in the voiceover pipeline.
 */
export const STEPS = {
  UPLOAD: 0,
  CONFIGURE: 1,
  GENERATE: 2,
  OUTPUT: 3,
};

const STEP_LABELS = ['Upload Video', 'Configure', 'Generate', 'Result'];

/**
 * Custom hook that orchestrates the entire voiceover generation pipeline.
 * Manages state for every step: upload, script, voice, merge.
 */
export function useVoiceover() {
  // ── Pipeline state ──
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);
  const [jobId, setJobId] = useState(null);

  // ── Upload state ──
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Configuration ──
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [voiceId, setVoiceId] = useState('en-male');
  const [keepOriginalAudio, setKeepOriginalAudio] = useState(false);

  // ── Generated content ──
  const [script, setScript] = useState('');
  const [hook, setHook] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // ── Status ──
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [error, setError] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  /**
   * Step 1: Upload video
   */
  const handleUpload = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentAction('Uploading video...');
      setVideoFile(file);
      setUploadProgress(0);

      const result = await api.uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });

      setJobId(result.jobId);
      setVideoUrl(result.videoUrl);
      setVideoInfo(result.videoInfo);
      setCurrentStep(STEPS.CONFIGURE);
      setCurrentAction('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Step 2 → 3: Run the full generation pipeline
   */
  const handleGenerate = useCallback(async (editedScript) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(STEPS.GENERATE);
      setGenerationProgress(0);

      // Phase 1: Generate script (unless user provided one)
      let finalScript = editedScript;

      if (!finalScript) {
        setCurrentAction('Generating voiceover script...');
        setGenerationProgress(10);

        const scriptResult = await api.generateScript({
          jobId,
          context,
          tone,
          language,
        });

        finalScript = scriptResult.script;
        setScript(scriptResult.script);
        setHook(scriptResult.hook);
      } else {
        setScript(finalScript);
      }

      setGenerationProgress(33);

      // Phase 2: Generate voice
      setCurrentAction('Generating AI voice...');
      const voiceResult = await api.generateVoice({
        jobId,
        script: finalScript,
        voiceId,
      });

      setAudioUrl(voiceResult.audioUrl);
      setGenerationProgress(66);

      // Phase 3: Merge video + audio
      setCurrentAction('Merging audio with video...');
      const mergeResult = await api.mergeVideo({
        jobId,
        keepOriginalAudio,
      });

      setOutputUrl(mergeResult.outputUrl);
      setDownloadUrl(mergeResult.downloadUrl);
      setGenerationProgress(100);

      // Done!
      setCurrentStep(STEPS.OUTPUT);
      setCurrentAction('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Generation failed');
      setCurrentAction('');
    } finally {
      setLoading(false);
    }
  }, [jobId, context, tone, language, voiceId, keepOriginalAudio]);

  /**
   * Reset everything and start over.
   */
  const reset = useCallback(() => {
    setCurrentStep(STEPS.UPLOAD);
    setJobId(null);
    setVideoFile(null);
    setVideoUrl(null);
    setVideoInfo(null);
    setUploadProgress(0);
    setContext('');
    setTone('professional');
    setLanguage('en');
    setVoiceId('en-male');
    setKeepOriginalAudio(false);
    setScript('');
    setHook('');
    setAudioUrl(null);
    setOutputUrl(null);
    setDownloadUrl(null);
    setLoading(false);
    setCurrentAction('');
    setError(null);
    setGenerationProgress(0);
  }, []);

  return {
    // Steps
    currentStep,
    setCurrentStep,
    stepLabels: STEP_LABELS,
    STEPS,

    // Upload
    videoFile,
    videoUrl,
    videoInfo,
    uploadProgress,
    handleUpload,

    // Config
    context, setContext,
    tone, setTone,
    language, setLanguage,
    voiceId, setVoiceId,
    keepOriginalAudio, setKeepOriginalAudio,

    // Generated
    script, setScript,
    hook,
    audioUrl,
    outputUrl,
    downloadUrl,

    // Actions
    handleGenerate,
    reset,

    // Status
    loading,
    currentAction,
    error, setError,
    generationProgress,
  };
}
