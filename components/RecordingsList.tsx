'use client';

import { Recording } from '@/types/recording';
import RecordingItem from './RecordingItem';

interface RecordingsListProps {
  recordings: Recording[];
  currentRecordingId: string | null;
  onPlayRecording: (recording: Recording) => void;
  onTogglePin: (recordingId: string) => void;
  onDownload: (recording: Recording) => void;
}

export default function RecordingsList({
  recordings,
  currentRecordingId,
  onPlayRecording,
  onTogglePin,
  onDownload,
}: RecordingsListProps) {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg order-3 sm:order-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent Recordings
      </h2>
      
      {recordings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No recordings yet
        </p>
      ) : (
        <div className="space-y-2">
          {recordings.map((recording) => (
            <RecordingItem
              key={recording.id}
              recording={recording}
              isCurrentlyPlaying={recording.id === currentRecordingId}
              onPlay={() => onPlayRecording(recording)}
              onTogglePin={() => onTogglePin(recording.id)}
              onDownload={() => onDownload(recording)}
              formatTimestamp={formatTimestamp}
              formatDuration={formatDuration}
            />
          ))}
        </div>
      )}
    </section>
  );
}

