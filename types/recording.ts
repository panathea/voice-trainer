export interface Recording {
  id: string;
  timestamp: number;
  duration: number;
  audioData: string; // base64 encoded audio blob
  pinned: boolean;
}

export interface AppState {
  recordings: Recording[];
  currentSentences: string[];
  favoriteSentences: string[];
  showOnlyFavorites: boolean;
}

