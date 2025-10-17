'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformPlayerProps {
  audioBlob: Blob | null;
  autoPlay?: boolean;
  onFinish?: () => void;
}

export default function WaveformPlayer({ audioBlob, autoPlay = false, onFinish }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !audioBlob) return;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgb(147, 197, 253)', // blue-300
      progressColor: 'rgb(59, 130, 246)', // blue-500
      cursorColor: 'rgb(29, 78, 216)', // blue-700
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 2,
      height: 80,
      barGap: 2,
    });

    wavesurferRef.current = wavesurfer;

    // Load the audio blob
    const url = URL.createObjectURL(audioBlob);
    wavesurfer.load(url);

    // Event listeners
    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
      if (autoPlay) {
        // Use setTimeout to ensure the audio is fully ready
        setTimeout(() => {
          wavesurfer.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }, 50);
      }
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    
    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      if (onFinish) onFinish();
    });

    wavesurfer.on('timeupdate', (time) => {
      setCurrentTime(time);
    });

    // Cleanup
    return () => {
      wavesurfer.destroy();
      URL.revokeObjectURL(url);
    };
  }, [audioBlob, autoPlay, onFinish]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioBlob) {
    return (
      <div className="w-full bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 text-center">
        <p className="text-blue-600 dark:text-blue-300 text-sm">
          No recording yet. Press and hold the button below to record.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
      <div ref={containerRef} className="mb-3" />
      
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="text-sm text-blue-700 dark:text-blue-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

