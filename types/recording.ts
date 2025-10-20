export interface Recording {
  id: string;
  timestamp: number;
  duration: number;
  audioData: string; // base64 encoded audio blob
  pinned: boolean;
}

export interface SentenceWithPronoun {
  templateId: string;
  resolvedPronounSetId: string; // The actual pronoun set to use (resolved from 'random' if needed)
}

export interface AppState {
  recordings: Recording[];
  currentSentences: SentenceWithPronoun[]; // Stores template IDs with resolved pronouns
  favoriteSentences: string[]; // Stores template IDs
  showOnlyFavorites: boolean;
  selectedPronounSet: string; // Default: 'original'
}

