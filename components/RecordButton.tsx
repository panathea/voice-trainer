'use client';

import { useState, useRef, useEffect } from 'react';
import type RecordRTC from 'recordrtc';

interface RecordButtonProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
}

export default function RecordButton({ onRecordingComplete, onRecordingStart }: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const RecordRTCRef = useRef<typeof RecordRTC | null>(null);

  // Initialize RecordRTC once when component mounts
  useEffect(() => {
    let mounted = true;
    
    const initRecorder = async () => {
      try {
        // Dynamically import RecordRTC
        const module = await import('recordrtc');
        RecordRTCRef.current = module.default;
        
        if (!mounted) return;
        
        // Get microphone permission and stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        streamRef.current = stream;
        
        // Create RecordRTC instance once
        const recorder = new module.default(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          recorderType: module.default.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
        });
        
        recorderRef.current = recorder;
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing recorder:', error);
        if (mounted) {
          setPermissionDenied(true);
        }
      }
    };
    
    initRecorder();
    
    // Cleanup on unmount
    return () => {
      mounted = false;
      if (recorderRef.current) {
        recorderRef.current.destroy();
        recorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const startRecording = () => {
    if (!recorderRef.current || !isReady) {
      console.error('Recorder not ready yet');
      return;
    }

    // Reset the recorder if it was previously used
    const state = recorderRef.current.getState();
    if (state === 'stopped' || state === 'paused') {
      recorderRef.current.reset();
    }
    
    // Start recording
    recorderRef.current.startRecording();
    
    // Set timestamp and show UI immediately
    startTimeRef.current = Date.now();
    setIsRecording(true);
    
    if (onRecordingStart) {
      onRecordingStart();
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || !isRecording) {
      return;
    }

    const recorder = recorderRef.current;
    
    recorder.stopRecording(() => {
      // Get the recorded blob
      const audioBlob = recorder.getBlob();
      const duration = (Date.now() - startTimeRef.current) / 1000;
      
      // Call the completion handler
      onRecordingComplete(audioBlob, duration);
      
      // Don't destroy - we'll reuse the recorder
      // Just reset it for the next recording
    });
    
    setIsRecording(false);
  };

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopRecording();
  };

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg">
          Microphone access denied. Please enable it in your browser settings and reload the page.
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={stopRecording}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={!isReady}
        className={`
          w-24 h-24 rounded-full 
          flex items-center justify-center
          transition-all duration-200
          select-none
          ${!isReady
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : isRecording 
              ? 'bg-red-500 scale-110 animate-pulse' 
              : 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700'
          }
          shadow-lg hover:shadow-xl
        `}
      >
        {isRecording ? (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {!isReady ? 'Initializing...' : isRecording ? 'Recording...' : 'Hold to record'}
      </p>
    </div>
  );
}

