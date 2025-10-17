'use client';

import { useState, useEffect } from 'react';
import WaveformPlayer from '@/components/WaveformPlayer';
import RecordButton from '@/components/RecordButton';
import { SENTENCES } from '@/lib/constants';
import { Recording, AppState } from '@/types/recording';
import {
  loadState,
  saveState,
  blobToBase64,
  base64ToBlob,
  togglePin,
  toggleFavorite,
  toggleShowOnlyFavorites,
  downloadRecording,
  saveCurrentSentences as saveCurrentSentencesToStorage,
} from '@/lib/storage';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    recordings: [],
    currentSentences: [],
    favoriteSentences: [],
    showOnlyFavorites: false,
  });
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from localStorage
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setAppState(savedState);
      // If there are current sentences, keep them; otherwise generate new ones
      if (savedState.currentSentences.length === 0) {
        const newSentences = getRandomSentences(3, savedState.showOnlyFavorites, savedState.favoriteSentences);
        const newState = { ...savedState, currentSentences: newSentences };
        setAppState(newState);
        saveState(newState);
      }
      // Load the most recent recording as current audio
      if (savedState.recordings.length > 0) {
        const latestRecording = savedState.recordings[0];
        const blob = base64ToBlob(latestRecording.audioData);
        setCurrentAudioBlob(blob);
      }
    } else {
      // First time - generate initial sentences
      const initialSentences = getRandomSentences(3, false, []);
      const newState = { ...appState, currentSentences: initialSentences };
      setAppState(newState);
      saveState(newState);
    }
    setIsInitialized(true);
  }, []);

  const getRandomSentences = (count: number, favoritesOnly: boolean, favorites: string[]): string[] => {
    const pool = favoritesOnly && favorites.length > 0 ? favorites : SENTENCES;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const replaceSentence = (index: number) => {
    const pool = appState.showOnlyFavorites && appState.favoriteSentences.length > 0 
      ? appState.favoriteSentences 
      : SENTENCES;
    
    // Get a random sentence that's not currently displayed
    const availableSentences = pool.filter(s => !appState.currentSentences.includes(s));
    
    if (availableSentences.length === 0) {
      // If all sentences are shown, just pick a random one
      const randomSentence = pool[Math.floor(Math.random() * pool.length)];
      const newSentences = [...appState.currentSentences];
      newSentences[index] = randomSentence;
      const newState = { ...appState, currentSentences: newSentences };
      setAppState(newState);
      saveCurrentSentencesToStorage(newSentences, newState);
      return;
    }
    
    const randomSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
    const newSentences = [...appState.currentSentences];
    newSentences[index] = randomSentence;
    const newState = { ...appState, currentSentences: newSentences };
    setAppState(newState);
    saveCurrentSentencesToStorage(newSentences, newState);
  };

  const handleToggleFavorite = (sentence: string) => {
    const newState = toggleFavorite(sentence, appState);
    setAppState(newState);
  };

  const handleToggleShowOnlyFavorites = () => {
    const newState = toggleShowOnlyFavorites(appState);
    
    // Regenerate sentences if switching to favorites mode and current sentences aren't favorites
    if (newState.showOnlyFavorites && newState.favoriteSentences.length > 0) {
      const newSentences = getRandomSentences(3, true, newState.favoriteSentences);
      newState.currentSentences = newSentences;
    } else if (!newState.showOnlyFavorites) {
      // Switching back to all sentences - regenerate
      const newSentences = getRandomSentences(3, false, []);
      newState.currentSentences = newSentences;
    }
    
    setAppState(newState);
    saveState(newState);
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

    // Set as current audio and auto-play
    setCurrentAudioBlob(audioBlob);
    setAutoPlay(true);
    // Reset autoPlay after a moment
    setTimeout(() => setAutoPlay(false), 100);
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
    setAutoPlay(true);
    setTimeout(() => setAutoPlay(false), 100);
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
            Voice Trainer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Practice speaking with confidence
          </p>
        </header>

        {/* Main Grid Layout - 2 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Current Playback Section */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Current Recording
              </h2>
              <WaveformPlayer 
                audioBlob={currentAudioBlob} 
                autoPlay={autoPlay}
              />
            </section>

            {/* Recording Button - Desktop */}
            <section className="hidden sm:flex flex-col flex-1 items-center justify-center py-6">
              <RecordButton
                onRecordingComplete={handleRecordingComplete}
                onRecordingStart={() => {
                  // Stop any currently playing audio
                  setAutoPlay(false);
                }}
              />
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Sentence Display Area */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Practice Sentences
                </h2>
                <button
                  onClick={handleToggleShowOnlyFavorites}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg transition-colors
                    ${appState.showOnlyFavorites 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }
                  `}
                  disabled={appState.showOnlyFavorites && appState.favoriteSentences.length === 0}
                >
                  {appState.showOnlyFavorites ? '★ Favorites' : '☆ Show Favorites'}
                </button>
              </div>
              
              <div className="space-y-3">
                {appState.currentSentences.map((sentence, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                  >
                    <p className="flex-1 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {sentence}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleToggleFavorite(sentence)}
                        className="p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
                        title={appState.favoriteSentences.includes(sentence) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {appState.favoriteSentences.includes(sentence) ? (
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
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Replace sentence"
                      >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Recordings List */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
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
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
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
          </div>
        </div>
      </div>
      
      {/* Fixed Recording Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-gradient-to-t from-pink-50 via-pink-50 to-transparent dark:from-slate-900 dark:via-slate-900 py-6 pb-8">
        <RecordButton
          onRecordingComplete={handleRecordingComplete}
          onRecordingStart={() => {
            // Stop any currently playing audio
            setAutoPlay(false);
          }}
        />
      </div>
    </div>
  );
}
