'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WaveformPlayer, { WaveformPlayerRef } from '@/components/WaveformPlayer';
import RecordButton from '@/components/RecordButton';
import PracticeSentences, { PracticeSentencesState } from '@/components/PracticeSentences';
import RecordingsList from '@/components/RecordingsList';
import { Recording, AppState } from '@/types/recording';
import {
  loadState,
  saveState,
  blobToBase64,
  base64ToBlob,
  togglePin,
  downloadRecording,
} from '@/lib/storage';
import { SENTENCE_TEMPLATES } from '@/lib/sentence-templates';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    recordings: [],
    currentSentences: [], // Now stores template IDs
    favoriteSentences: [], // Now stores template IDs
    showOnlyFavorites: false,
    selectedPronounSet: 'original',
  });
  const [practiceState, setPracticeState] = useState<PracticeSentencesState>({
    currentSentences: [],
    favoriteSentences: [],
    showOnlyFavorites: false,
    selectedPronounSet: 'original',
  });
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [playTrigger, setPlayTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const recordButtonRef = useRef<{ startRecording: () => void; stopRecording: () => void } | null>(null);
  const waveformPlayerRef = useRef<WaveformPlayerRef | null>(null);

  // Helper function to generate random sentence IDs
  const getRandomSentenceIds = (count: number): string[] => {
    const shuffled = [...SENTENCE_TEMPLATES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(t => t.id);
  };

  // Initialize state from localStorage
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      // Ensure selectedPronounSet exists (for backwards compatibility)
      const migratedState = {
        ...savedState,
        selectedPronounSet: savedState.selectedPronounSet || 'original',
      };
      
      // Migrate old sentence strings to template IDs
      const needsMigration = migratedState.currentSentences.some((s: string) => 
        !SENTENCE_TEMPLATES.find(t => t.id === s)
      );
      
      if (needsMigration || migratedState.currentSentences.length === 0) {
        // Generate new sentences
        const newSentenceIds = getRandomSentenceIds(3);
        migratedState.currentSentences = newSentenceIds;
        migratedState.favoriteSentences = []; // Reset favorites on migration
      }
      
      setAppState(migratedState);
      setPracticeState({
        currentSentences: migratedState.currentSentences,
        favoriteSentences: migratedState.favoriteSentences,
        showOnlyFavorites: migratedState.showOnlyFavorites,
        selectedPronounSet: migratedState.selectedPronounSet,
      });
      saveState(migratedState);
      
      // Load the most recent recording as current audio
      if (migratedState.recordings.length > 0) {
        const latestRecording = migratedState.recordings[0];
        const blob = base64ToBlob(latestRecording.audioData);
        setCurrentAudioBlob(blob);
      }
    } else {
      // First time - generate initial sentences
      const initialSentenceIds = getRandomSentenceIds(3);
      const initialPracticeState = {
        currentSentences: initialSentenceIds,
        favoriteSentences: [],
        showOnlyFavorites: false,
        selectedPronounSet: 'original',
      };
      const newState = { 
        recordings: [],
        ...initialPracticeState,
      };
      setAppState(newState);
      setPracticeState(initialPracticeState);
      saveState(newState);
    }
    setIsInitialized(true);
  }, []);

  // Keyboard shortcut: Hold space to record
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Only trigger on spacebar
      if (e.code === 'Space' && !e.repeat && recordButtonRef.current) {
        e.preventDefault();
        recordButtonRef.current.startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Only trigger on spacebar
      if (e.code === 'Space' && recordButtonRef.current) {
        e.preventDefault();
        recordButtonRef.current.stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Persist practice sentences state changes
  const handlePracticeStateChange = useCallback((newPracticeState: PracticeSentencesState) => {
    setPracticeState(newPracticeState);
    setAppState(prevState => {
      const newState = {
        ...prevState,
        ...newPracticeState,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const handleRecordingStart = () => {
    // Stop playback when recording starts
    if (waveformPlayerRef.current) {
      waveformPlayerRef.current.stop();
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    const audioData = await blobToBase64(audioBlob);
    
    const newRecording: Recording = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      duration,
      audioData,
      pinned: false,
    };

    const recordings = [newRecording, ...appState.recordings];
    const newState = { ...appState, recordings };
    setAppState(newState);
    saveState(newState);

    // Set as current audio and trigger auto-play
    setCurrentAudioBlob(audioBlob);
    setCurrentRecordingId(newRecording.id);
    setPlayTrigger(prev => prev + 1);
  };

  const handleTogglePin = (recordingId: string) => {
    const newState = togglePin(recordingId, appState);
    setAppState(newState);
  };

  const handleDownload = (recording: Recording) => {
    downloadRecording(recording);
  };

  const handlePlayRecording = (recording: Recording) => {
    const blob = base64ToBlob(recording.audioData);
    setCurrentAudioBlob(blob);
    setCurrentRecordingId(recording.id);
    setPlayTrigger(prev => prev + 1);
  };

  // Get visible recordings (pinned + last 3 unpinned)
  const visibleRecordings = (() => {
    const pinned = appState.recordings.filter(r => r.pinned);
    const unpinned = appState.recordings.filter(r => !r.pinned).slice(0, 3);
    return [...pinned, ...unpinned];
  })();

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen p-4 pb-40 sm:pb-8 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Sweet Nothings
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Self-driven trans voice training tool
          </p>
        </header>

        {/* Main Grid Layout - 2 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Practice Sentences - First on mobile, Top-right on desktop */}
          <PracticeSentences
            initialState={practiceState}
            onStateChange={handlePracticeStateChange}
          />

          {/* Current Recording - Second on mobile, Top-left on desktop */}
          <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg order-2 sm:order-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Current Recording
              </h2>
              <WaveformPlayer 
                ref={waveformPlayerRef}
                audioBlob={currentAudioBlob} 
                playTrigger={playTrigger}
              />
          </section>

          {/* Recent Recordings List - Third on mobile, Bottom-right on desktop */}
          <RecordingsList
            recordings={visibleRecordings}
            currentRecordingId={currentRecordingId}
            onPlayRecording={handlePlayRecording}
            onTogglePin={handleTogglePin}
            onDownload={handleDownload}
          />

          {/* Recording Button - Desktop only, Bottom-left on desktop */}
          <section className="hidden sm:flex flex-col items-center justify-center py-6 order-4 sm:order-3">
            <RecordButton
              ref={recordButtonRef}
              onRecordingComplete={handleRecordingComplete}
              onRecordingStart={handleRecordingStart}
            />
          </section>
        </div>
      </div>
      
      {/* Fixed Recording Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-gradient-to-t from-pink-50 via-pink-50 to-transparent dark:from-slate-900 dark:via-slate-900 py-6 pb-8">
        <RecordButton
          onRecordingComplete={handleRecordingComplete}
          onRecordingStart={handleRecordingStart}
        />
      </div>
    </div>
  );
}

