export interface Recording {
  id: string;
  timestamp: number;
  duration: number;
  audioData: string; // base64 encoded audio blob
  pinned: boolean;
}

export interface AppState {
  recordings: Recording[];
  currentSentences: string[]; // Now stores template IDs
  favoriteSentences: string[]; // Now stores template IDs
  showOnlyFavorites: boolean;
  selectedPronounSet: string; // Default: 'original'
}

