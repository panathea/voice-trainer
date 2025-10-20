'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WaveformPlayer, { WaveformPlayerRef } from '@/components/WaveformPlayer';
import RecordButton from '@/components/RecordButton';
import PracticeSentences, { PracticeSentencesState } from '@/components/PracticeSentences';
import RecordingsList from '@/components/RecordingsList';
import HelpModal from '@/components/HelpModal';
import { Recording, AppState, SentenceWithPronoun } from '@/types/recording';
import {
  loadState,
  saveState,
  blobToBase64,
  base64ToBlob,
  togglePin,
  downloadRecording,
} from '@/lib/storage';
import { SENTENCE_TEMPLATES } from '@/lib/sentence-templates';
import { PRONOUN_SETS } from '@/lib/pronouns';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    recordings: [],
    currentSentences: [], // Stores sentences with resolved pronouns
    favoriteSentences: [], // Stores template IDs
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

  // Helper function to resolve a pronoun set (handles 'random' selection)
  const resolvePronounSet = (pronounSetId: string): string => {
    if (pronounSetId !== 'random') {
      return pronounSetId;
    }
    
    // Pick a random pronoun set (excluding 'random' itself)
    const availablePronounSets = Object.keys(PRONOUN_SETS).filter(id => id !== 'random');
    const randomIndex = Math.floor(Math.random() * availablePronounSets.length);
    return availablePronounSets[randomIndex];
  };

  // Helper function to generate random sentences with resolved pronouns
  const getRandomSentences = (count: number, pronounSetId: string): SentenceWithPronoun[] => {
    const shuffled = [...SENTENCE_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    return selected.map(template => ({
      templateId: template.id,
      resolvedPronounSetId: resolvePronounSet(pronounSetId),
    }));
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
      
      // Migrate old data structures
      const needsMigration = 
        migratedState.currentSentences.length === 0 ||
        typeof migratedState.currentSentences[0] === 'string' || // Old format (just IDs)
        !migratedState.currentSentences[0].hasOwnProperty('resolvedPronounSetId'); // Missing resolved pronoun
      
      if (needsMigration) {
        // Generate new sentences with resolved pronouns
        const newSentences = getRandomSentences(3, migratedState.selectedPronounSet);
        migratedState.currentSentences = newSentences;
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
      const initialSentences = getRandomSentences(3, 'original');
      const initialPracticeState = {
        currentSentences: initialSentences,
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
        <header className="mb-6 relative">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Sweet Nothings
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Self-driven trans voice training tool
            </p>
            {/* Mobile: Show help link below description */}
            <div className="sm:hidden">
              <HelpModal />
            </div>
          </div>
          {/* Desktop: Float help link in top-right corner */}
          <div className="hidden sm:block absolute top-0 right-0">
            <HelpModal />
          </div>
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
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-gradient-to-t from-pink-50 via-pink-50 to-transparent dark:from-slate-900 dark:via-slate-900 py-6 pb-8 z-50 isolate pointer-events-none">
        <div className="pointer-events-auto">
          <RecordButton
            onRecordingComplete={handleRecordingComplete}
            onRecordingStart={handleRecordingStart}
          />
        </div>
      </div>
    </div>
  );
}

