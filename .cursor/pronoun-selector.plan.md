# Pronoun Selector Feature Plan

## Overview
Add a pronoun selector that allows users to customize the pronouns used in practice sentences, making the app more inclusive and personalized.

## Pronoun Sets

### Supported Pronouns
- **Original** (mixed/as-written)
- **she/her** (singular)
- **he/him** (singular)
- **they/them** (plural)
- **ze/zir** (singular, neopronouns)
- **xe/xem** (singular, neopronouns)
- **e/em** (singular, neopronouns)
- **fae/faer** (singular, neopronouns)

### Pronoun Forms Structure
For each pronoun set, we need:
- **subject**: she/he/they/ze/xe/e/fae
- **object**: her/him/them/zir/xem/em/faer
- **possessive**: her/his/their/zir/xer/eir/faer
- **possessive-pronoun**: hers/his/theirs/zirs/xers/eirs/faers
- **reflexive**: herself/himself/themselves/zirself/xemself/emself/faerself
- **verb-to-be-present**: is/is/are/is/is/is/is
- **verb-to-be-past**: was/was/were/was/was/was/was

## Data Structure Changes

### 1. Sentence Template Format
Instead of plain strings, sentences will be objects with:
```typescript
interface SentenceTemplate {
  id: string;
  // Original sentence with pronoun markers
  original: string;
  // Template with placeholders like {SUBJECT}, {OBJECT}, {POSSESSIVE}, etc.
  template: string;
  // Verb templates for conjugation
  verbs?: {
    [key: string]: {
      singular: string;  // speaks, has, goes
      plural: string;    // speak, have, go
    }
  };
  // Category/tags
  tags?: string[];
}
```

### 2. Pronoun Configuration
```typescript
interface PronounSet {
  id: string;
  name: string;
  forms: {
    subject: string;      // she/he/they/ze/xe/e/fae
    object: string;       // her/him/them/zir/xem/em/faer
    possessive: string;   // her/his/their/zir/xer/eir/faer
    possessivePronoun: string; // hers/his/theirs/zirs/xers/eirs/faers
    reflexive: string;    // herself/himself/themselves/zirself/xemself/emself/faerself
  };
  verbConjugation: 'singular' | 'plural';
}
```

### 3. Updated Constants File (`lib/constants.ts`)
- Convert existing sentences to template format
- Add pronoun configurations
- Add utility functions to apply pronouns to templates

### 4. Updated AppState (`types/recording.ts`)
Add pronoun preference:
```typescript
interface AppState {
  recordings: Recording[];
  currentSentences: string[];
  favoriteSentences: string[]; // Will store template IDs
  showOnlyFavorites: boolean;
  selectedPronounSet: string; // Default: 'original'
}
```

## UI Components

### 1. Pronoun Selector Component (`components/PronounSelector.tsx`)
- Dropdown or segmented control
- Shows pronoun options
- Persists selection to localStorage
- Placed near the sentence display area (maybe in the header or as a button next to "Show Favorites")

### 2. Integration in Main Page
- Add pronoun selector to the sentence display section
- When pronoun set changes, regenerate displayed sentences with new pronouns
- Favorite system works with template IDs (so favorites persist across pronoun changes)

## Implementation Steps

### Phase 1: Data Structure
1. Create pronoun configuration in constants
2. Convert sample of sentences to template format (start with ~20-30)
3. Create utility function to apply pronouns to templates
4. Add pronoun preference to AppState

### Phase 2: UI Component
1. Build PronounSelector component
2. Add to sentence display section
3. Wire up state management

### Phase 3: Sentence Conversion
1. Convert remaining sentences to templates
2. Test all pronoun variations
3. Handle edge cases (sentences without pronouns)

### Phase 4: Polish
1. Add smooth transitions when changing pronouns
2. Update favorites system to work with template IDs
3. Add tooltip/help text explaining the feature

## Example Template Conversion

### Before (Plain String):
```
"She spoke with a clear and confident tone."
```

### After (Template):
```typescript
{
  id: "sent-001",
  original: "She spoke with a clear and confident tone.",
  template: "{SUBJECT} spoke with a clear and confident tone.",
  tags: ["voice", "speech"]
}
```

### With More Complex Verbs:
```typescript
{
  id: "sent-002", 
  original: "Her voice was like music to his ears.",
  template: "{POSSESSIVE} voice {VERB_WAS} like music to {OBJECT_OTHER} ears.",
  tags: ["voice"]
}
```

## Technical Considerations

1. **Backwards Compatibility**: Existing localStorage data should migrate gracefully
2. **Performance**: Template rendering should be fast (cached if possible)
3. **Capitalization**: Handle sentence-start capitalization automatically
4. **Contractions**: Handle contractions (she's, they're, etc.)
5. **Mixed Pronouns**: Some sentences have multiple people - need to handle carefully
6. **No-Pronoun Sentences**: Some sentences don't have pronouns - just use original

## Open Questions / Decisions Needed

1. Should we support mixing pronouns within a session (e.g., different sentences use different pronouns)?
   - **Recommendation**: No, keep it simple - one pronoun set for all sentences
   
2. How to handle sentences with multiple subjects?
   - **Recommendation**: Start simple - only convert sentences with single subject, leave multi-subject sentences as "original" only

3. Should the pronoun selector be prominently displayed or tucked away?
   - **Recommendation**: Place it in the sentence section header, next to "Show Favorites"

4. Do we need to convert all 150 sentences?
   - **Recommendation**: Start with converting sentences that actually have pronouns (~50-70), leave the rest as original

## UI Mockup Location
Pronoun selector placement:
```
[Practice Sentences]  [☆ Show Favorites] [Pronouns: they/them ▼]

┌─────────────────────────────────────────┐
│ They spoke with a clear and confident   │
│ tone.                                    │ [♡] [×]
└─────────────────────────────────────────┘
```

## Next Steps
1. Get user confirmation on approach
2. Implement Phase 1 (data structure)
3. Test with small subset of sentences
4. Expand to full implementation

