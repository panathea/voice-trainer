'use client';

import { useState, useEffect, useRef } from 'react';
import WaveformPlayer, { WaveformPlayerRef } from '@/components/WaveformPlayer';
import RecordButton from '@/components/RecordButton';
import PronounSelector from '@/components/PronounSelector';
import { Recording, AppState } from '@/types/recording';
import {
  loadState,
  saveState,
  blobToBase64,
  base64ToBlob,
  togglePin,
  downloadRecording,
  saveCurrentSentences as saveCurrentSentencesToStorage,
} from '@/lib/storage';
import { SENTENCE_TEMPLATES, getSentenceWithPronouns } from '@/lib/sentence-templates';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    recordings: [],
    currentSentences: [], // Now stores template IDs
    favoriteSentences: [], // Now stores template IDs
    showOnlyFavorites: false,
    selectedPronounSet: 'original',
  });
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [playTrigger, setPlayTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const recordButtonRef = useRef<{ startRecording: () => void; stopRecording: () => void } | null>(null);
  const waveformPlayerRef = useRef<WaveformPlayerRef | null>(null);

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
        const newSentenceIds = getRandomSentenceIds(3, false, []);
        migratedState.currentSentences = newSentenceIds;
        migratedState.favoriteSentences = []; // Reset favorites on migration
      }
      
      setAppState(migratedState);
      saveState(migratedState);
      
      // Load the most recent recording as current audio
      if (migratedState.recordings.length > 0) {
        const latestRecording = migratedState.recordings[0];
        const blob = base64ToBlob(latestRecording.audioData);
        setCurrentAudioBlob(blob);
      }
    } else {
      // First time - generate initial sentences
      const initialSentenceIds = getRandomSentenceIds(3, false, []);
      const newState = { 
        ...appState, 
        currentSentences: initialSentenceIds, 
        selectedPronounSet: 'original',
        favoriteSentences: [],
        showOnlyFavorites: false,
      };
      setAppState(newState);
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

  const getRandomSentenceIds = (count: number, favoritesOnly: boolean, favorites: string[]): string[] => {
    const pool = favoritesOnly && favorites.length > 0 
      ? SENTENCE_TEMPLATES.filter(t => favorites.includes(t.id))
      : SENTENCE_TEMPLATES;
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(t => t.id);
  };

  const replaceSentence = (index: number) => {
    const pool = appState.showOnlyFavorites && appState.favoriteSentences.length > 0 
      ? SENTENCE_TEMPLATES.filter(t => appState.favoriteSentences.includes(t.id))
      : SENTENCE_TEMPLATES;
    
    // Get a random sentence that's not currently displayed
    const availableTemplates = pool.filter(t => !appState.currentSentences.includes(t.id));
    
    // If no available templates (all are already shown), don't replace
    if (availableTemplates.length === 0) {
      return;
    }
    
    const randomTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    const newSentences = [...appState.currentSentences];
    newSentences[index] = randomTemplate.id;
    const newState = { ...appState, currentSentences: newSentences };
    setAppState(newState);
    saveCurrentSentencesToStorage(newSentences, newState);
  };

  const replaceAllSentences = () => {
    // Get available sentence pool (either favorites or all)
    const pool = appState.showOnlyFavorites && appState.favoriteSentences.length > 0
      ? SENTENCE_TEMPLATES.filter(t => appState.favoriteSentences.includes(t.id))
      : SENTENCE_TEMPLATES;
    
    // Determine how many sentences to show
    const count = Math.min(3, pool.length);
    const newSentenceIds = getRandomSentenceIds(count, appState.showOnlyFavorites, appState.favoriteSentences);
    
    const newState = { ...appState, currentSentences: newSentenceIds };
    setAppState(newState);
    saveCurrentSentencesToStorage(newSentenceIds, newState);
  };

  const handleToggleFavorite = (templateId: string) => {
    const favorites = appState.favoriteSentences;
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId];
    
    const newState = {
      ...appState,
      favoriteSentences: newFavorites,
    };
    
    setAppState(newState);
    saveState(newState);
  };

  const handleToggleShowOnlyFavorites = () => {
    // Can't enable favorites if there are none
    if (!appState.showOnlyFavorites && appState.favoriteSentences.length === 0) {
      return;
    }
    
    const newShowOnlyFavorites = !appState.showOnlyFavorites;
    let newState = { ...appState, showOnlyFavorites: newShowOnlyFavorites };
    
    // Regenerate sentences if switching modes
    if (newShowOnlyFavorites && appState.favoriteSentences.length > 0) {
      // Show only favorites - limit to available count
      const count = Math.min(3, appState.favoriteSentences.length);
      const newSentenceIds = getRandomSentenceIds(count, true, appState.favoriteSentences);
      newState.currentSentences = newSentenceIds;
    } else if (!newShowOnlyFavorites) {
      // Switching back to all sentences - regenerate
      const newSentenceIds = getRandomSentenceIds(3, false, []);
      newState.currentSentences = newSentenceIds;
    }
    
    setAppState(newState);
    saveState(newState);
  };

  const handlePronounSetChange = (pronounSetId: string) => {
    const newState = { ...appState, selectedPronounSet: pronounSetId };
    setAppState(newState);
    saveState(newState);
  };

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
          <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg order-1 sm:order-2">
              <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Practice Sentences
                </h2>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={replaceAllSentences}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                    title="Replace all sentences"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={handleToggleShowOnlyFavorites}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors
                      ${appState.showOnlyFavorites 
                        ? 'bg-pink-500 text-white' 
                        : appState.favoriteSentences.length === 0
                          ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                      }
                    `}
                    disabled={!appState.showOnlyFavorites && appState.favoriteSentences.length === 0}
                  >
                    {appState.showOnlyFavorites ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>Favorites</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Favorites</span>
                      </>
                    )}
                  </button>
                  <PronounSelector
                    selectedPronounSet={appState.selectedPronounSet}
                    onPronounSetChange={handlePronounSetChange}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {appState.currentSentences.map((templateId, index) => {
                  const sentenceText = getSentenceWithPronouns(templateId, appState.selectedPronounSet);
                  // Skip if sentence text is empty (template not found)
                  if (!sentenceText) return null;
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                    >
                      <p className="flex-1 text-gray-800 dark:text-gray-200 leading-relaxed">
                        {sentenceText}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleFavorite(templateId)}
                          className="p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
                          title={appState.favoriteSentences.includes(templateId) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {appState.favoriteSentences.includes(templateId) ? (
                            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => replaceSentence(index)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Replace sentence"
                        >
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          </section>

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
          <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg order-3 sm:order-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Recent Recordings
              </h2>
              
              {visibleRecordings.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recordings yet
                </p>
              ) : (
                <div className="space-y-2">
                  {visibleRecordings.map((recording) => (
                    <div
                      key={recording.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        recording.id === currentRecordingId
                          ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400'
                          : 'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => handlePlayRecording(recording)}
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
                        onClick={() => handleTogglePin(recording.id)}
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
                        onClick={() => handleDownload(recording)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </section>

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

