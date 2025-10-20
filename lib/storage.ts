import { Recording, AppState, SentenceWithPronoun } from '@/types/recording';

const STORAGE_KEY = 'voice-trainer-state';

// Convert Blob to base64 string
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert base64 string back to Blob
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

// Load state from localStorage
export function loadState(): AppState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
}

// Save state to localStorage
export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Try to make space by removing oldest non-pinned recording
      const recordings = state.recordings;
      const unpinnedRecordings = recordings.filter(r => !r.pinned);
      if (unpinnedRecordings.length > 0) {
        // Remove oldest unpinned recording
        const oldestUnpinned = unpinnedRecordings.reduce((oldest, current) =>
          current.timestamp < oldest.timestamp ? current : oldest
        );
        state.recordings = recordings.filter(r => r.id !== oldestUnpinned.id);
        // Try saving again
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
          console.error('Still unable to save after cleanup');
        }
      }
    }
  }
}

// Add or update a recording
export function saveRecording(recording: Recording, currentState: AppState): AppState {
  const recordings = currentState.recordings.filter(r => r.id !== recording.id);
  recordings.unshift(recording);
  
  // Keep only last 3 unpinned recordings (and all pinned ones)
  const pinnedRecordings = recordings.filter(r => r.pinned);
  const unpinnedRecordings = recordings.filter(r => !r.pinned).slice(0, 3);
  
  const newState = {
    ...currentState,
    recordings: [...pinnedRecordings, ...unpinnedRecordings],
  };
  
  saveState(newState);
  return newState;
}

// Toggle pin status of a recording
export function togglePin(recordingId: string, currentState: AppState): AppState {
  const newState = {
    ...currentState,
    recordings: currentState.recordings.map(r =>
      r.id === recordingId ? { ...r, pinned: !r.pinned } : r
    ),
  };
  
  saveState(newState);
  return newState;
}

// Delete a recording
export function deleteRecording(recordingId: string, currentState: AppState): AppState {
  const newState = {
    ...currentState,
    recordings: currentState.recordings.filter(r => r.id !== recordingId),
  };
  
  saveState(newState);
  return newState;
}

// Save current sentences
export function saveCurrentSentences(sentences: SentenceWithPronoun[], currentState: AppState): AppState {
  const newState = {
    ...currentState,
    currentSentences: sentences,
  };
  
  saveState(newState);
  return newState;
}

// Toggle favorite sentence
export function toggleFavorite(sentence: string, currentState: AppState): AppState {
  const favorites = currentState.favoriteSentences;
  const newFavorites = favorites.includes(sentence)
    ? favorites.filter(s => s !== sentence)
    : [...favorites, sentence];
  
  const newState = {
    ...currentState,
    favoriteSentences: newFavorites,
  };
  
  saveState(newState);
  return newState;
}

// Toggle show only favorites
export function toggleShowOnlyFavorites(currentState: AppState): AppState {
  const newState = {
    ...currentState,
    showOnlyFavorites: !currentState.showOnlyFavorites,
  };
  
  saveState(newState);
  return newState;
}

// Download a recording
export function downloadRecording(recording: Recording): void {
  const blob = base64ToBlob(recording.audioData);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recording-${new Date(recording.timestamp).toISOString()}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

