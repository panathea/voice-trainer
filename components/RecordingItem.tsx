'use client';

import { Recording } from '@/types/recording';

interface RecordingItemProps {
  recording: Recording;
  isCurrentlyPlaying: boolean;
  onPlay: () => void;
  onTogglePin: () => void;
  onDownload: () => void;
  formatTimestamp: (timestamp: number) => string;
  formatDuration: (duration: number) => string;
}

export default function RecordingItem({
  recording,
  isCurrentlyPlaying,
  onPlay,
  onTogglePin,
  onDownload,
  formatTimestamp,
  formatDuration,
}: RecordingItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isCurrentlyPlaying
          ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400'
          : 'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700'
      }`}
    >
      <button
        onClick={onPlay}
        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        title="Play recording"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
      </button>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {formatTimestamp(recording.timestamp)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDuration(recording.duration)}
        </div>
      </div>
      
      <button
        onClick={onTogglePin}
        className={`p-2 rounded-lg transition-colors ${
          recording.pinned
            ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600'
        }`}
        title={recording.pinned ? 'Unpin' : 'Pin'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 12V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
        </svg>
      </button>
      
      <button
        onClick={onDownload}
        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
        title="Download"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
}

