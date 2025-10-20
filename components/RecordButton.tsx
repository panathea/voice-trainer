'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type RecordRTC from 'recordrtc';

interface RecordButtonProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
}

export interface RecordButtonRef {
  startRecording: () => void;
  stopRecording: () => void;
}

const RecordButton = forwardRef<RecordButtonRef, RecordButtonProps>(({ onRecordingComplete, onRecordingStart }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationFailed, setInitializationFailed] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const RecordRTCRef = useRef<typeof RecordRTC | null>(null);
  const isInitializingRef = useRef(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMountRef = useRef(true);

  // Initialize RecordRTC once when component mounts and handle tab visibility
  useEffect(() => {
    let mounted = true;
    
    const initRecorder = async (fromVisibilityChange = false) => {
      // Prevent overlapping initialization attempts
      if (isInitializingRef.current) {
        console.log('Already initializing, skipping...');
        return;
      }
      
      isInitializingRef.current = true;
      setIsInitializing(true);
      setInitializationFailed(false);
      
      // Clear any existing timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // Set a 3-second timeout for initialization
      initTimeoutRef.current = setTimeout(() => {
        if (isInitializingRef.current && !isReady) {
          console.error('Initialization timeout');
          isInitializingRef.current = false;
          setIsInitializing(false);
          setInitializationFailed(true);
        }
      }, 3000);
      
      try {
        // Dynamically import RecordRTC if not already loaded
        if (!RecordRTCRef.current) {
          const recordRTCModule = await import('recordrtc');
          RecordRTCRef.current = recordRTCModule.default;
        }
        
        if (!mounted) {
          isInitializingRef.current = false;
          setIsInitializing(false);
          return;
        }
        
        // Only check focus if coming from visibility change
        // Don't check focus on initial mount to allow permission prompt to show
        if (fromVisibilityChange && !document.hasFocus()) {
          isInitializingRef.current = false;
          setIsInitializing(false);
          return;
        }
        
        // Get microphone permission and stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          isInitializingRef.current = false;
          setIsInitializing(false);
          return;
        }
        
        streamRef.current = stream;
        
        // Create RecordRTC instance
        const recorder = new RecordRTCRef.current(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          recorderType: RecordRTCRef.current.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
        });
        
        recorderRef.current = recorder;
        
        // Clear timeout on success
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = null;
        }
        
        isInitializingRef.current = false;
        setIsInitializing(false);
        setIsReady(true);
        setPermissionDenied(false);
        setInitializationFailed(false);
      } catch (error) {
        console.error('Error initializing recorder:', error);
        isInitializingRef.current = false;
        setIsInitializing(false);
        
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = null;
        }
        
        if (mounted) {
          // Check if it's a permission error
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setPermissionDenied(true);
          } else {
            setInitializationFailed(true);
          }
        }
      }
    };
    
    const cleanupRecorder = () => {
      // Clear any pending initialization timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      // Stop any active recording
      if (recorderRef.current) {
        try {
          const state = recorderRef.current.getState();
          if (state === 'recording' || state === 'paused') {
            recorderRef.current.stopRecording(() => {
              // Recording stopped, now cleanup
            });
          }
          recorderRef.current.destroy();
        } catch (error) {
          console.error('Error cleaning up recorder:', error);
        }
        recorderRef.current = null;
      }
      
      // Cleanup stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      isInitializingRef.current = false;
      setIsRecording(false);
      setIsReady(false);
      setIsInitializing(false);
    };
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - cleanup microphone
        cleanupRecorder();
      } else if (!isInitializingRef.current) {
        // Tab is visible and not already initializing - reinitialize microphone with a small delay
        setTimeout(() => {
          if (!document.hidden && mounted) {
            initRecorder(true);
          }
        }, 500);
      }
    };
    
    // Initialize on mount with delay on first load
    if (isFirstMountRef.current) {
      // Wait 1 second before requesting microphone on first mount
      // This gives the browser time to fully load and be ready for the permission prompt
      setTimeout(() => {
        if (mounted) {
          initRecorder(false);
        }
      }, 1000);
      isFirstMountRef.current = false;
    } else {
      initRecorder(false);
    }
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup on unmount
    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupRecorder();
    };
  }, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
  }));

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
    
    // Set timestamp and show UI immediately
    startTimeRef.current = Date.now();
    setIsRecording(true);
    
    if (onRecordingStart) {
      onRecordingStart();
    }
    setTimeout(() => {
      if (recorderRef.current) {
        // Start recording
        recorderRef.current.startRecording();
      }
    }, 150);
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

  const handleRetry = () => {
    setInitializationFailed(false);
    setPermissionDenied(false);
    // Small delay before retrying
    setTimeout(() => {
      const initRecorderAsync = async () => {
        if (isInitializingRef.current) return;
        
        isInitializingRef.current = true;
        setIsInitializing(true);
        setInitializationFailed(false);
        
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
        }
        
        initTimeoutRef.current = setTimeout(() => {
          if (isInitializingRef.current && !isReady) {
            console.error('Initialization timeout');
            isInitializingRef.current = false;
            setIsInitializing(false);
            setInitializationFailed(true);
          }
        }, 3000);
        
        try {
          if (!RecordRTCRef.current) {
            const recordRTCModule = await import('recordrtc');
            RecordRTCRef.current = recordRTCModule.default;
          }
          
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          
          const recorder = new RecordRTCRef.current(stream, {
            type: 'audio',
            mimeType: 'audio/webm',
            recorderType: RecordRTCRef.current.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            desiredSampRate: 16000,
          });
          
          recorderRef.current = recorder;
          
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = null;
          }
          
          isInitializingRef.current = false;
          setIsInitializing(false);
          setIsReady(true);
          setPermissionDenied(false);
          setInitializationFailed(false);
        } catch (error) {
          console.error('Error initializing recorder:', error);
          isInitializingRef.current = false;
          setIsInitializing(false);
          
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = null;
          }
          
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setPermissionDenied(true);
          } else {
            setInitializationFailed(true);
          }
        }
      };
      
      initRecorderAsync();
    }, 100);
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

  if (initializationFailed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-center text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-4 py-3 rounded-lg">
          Failed to initialize microphone. Please try again.
        </div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 text-sm text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 rounded-lg transition-colors"
        >
          Try Again
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
        disabled={!isReady || isInitializing}
        className={`
          w-24 h-24 rounded-full 
          flex items-center justify-center
          transition-all duration-200
          select-none
          ${!isReady || isInitializing
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
      <div className="text-sm text-gray-600 dark:text-gray-300 text-center min-w-[120px] h-[44px] flex flex-col items-center justify-center">
        {isInitializing || (!isReady && !initializationFailed) ? (
          <p>Initializing...</p>
        ) : isRecording ? (
          <p>Recording...</p>
        ) : isReady ? (
          <>
            <p>Hold to record</p>
            <p className="text-xs opacity-70 mt-1">or press Space</p>
          </>
        ) : null}
      </div>
    </div>
  );
});

RecordButton.displayName = 'RecordButton';

export default RecordButton;

