'use client';

import { useState, useEffect } from 'react';
import PronounSelector from './PronounSelector';
import SentenceItem from './SentenceItem';
import { SENTENCE_TEMPLATES, getSentenceWithPronouns } from '@/lib/sentence-templates';
import { PRONOUN_SETS } from '@/lib/pronouns';
import { SentenceWithPronoun } from '@/types/recording';

export interface PracticeSentencesState {
  currentSentences: SentenceWithPronoun[];
  favoriteSentences: string[];
  showOnlyFavorites: boolean;
  selectedPronounSet: string;
}

interface PracticeSentencesProps {
  initialState: PracticeSentencesState;
  onStateChange: (state: PracticeSentencesState) => void;
}

export default function PracticeSentences({
  initialState,
  onStateChange,
}: PracticeSentencesProps) {
  const [currentSentences, setCurrentSentences] = useState(initialState.currentSentences);
  const [favoriteSentences, setFavoriteSentences] = useState(initialState.favoriteSentences);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(initialState.showOnlyFavorites);
  const [selectedPronounSet, setSelectedPronounSet] = useState(initialState.selectedPronounSet);

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

  // Helper function to create a sentence with resolved pronoun
  const createSentenceWithPronoun = (templateId: string, pronounSetId: string): SentenceWithPronoun => {
    return {
      templateId,
      resolvedPronounSetId: resolvePronounSet(pronounSetId),
    };
  };

  // Notify parent of state changes
  useEffect(() => {
    onStateChange({
      currentSentences,
      favoriteSentences,
      showOnlyFavorites,
      selectedPronounSet,
    });
  }, [currentSentences, favoriteSentences, showOnlyFavorites, selectedPronounSet, onStateChange]);

  const getRandomSentences = (count: number, favoritesOnly: boolean): SentenceWithPronoun[] => {
    const pool = favoritesOnly && favoriteSentences.length > 0 
      ? SENTENCE_TEMPLATES.filter(t => favoriteSentences.includes(t.id))
      : SENTENCE_TEMPLATES;
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    return selected.map(template => createSentenceWithPronoun(template.id, selectedPronounSet));
  };

  const replaceSentence = (index: number) => {
    const pool = showOnlyFavorites && favoriteSentences.length > 0 
      ? SENTENCE_TEMPLATES.filter(t => favoriteSentences.includes(t.id))
      : SENTENCE_TEMPLATES;
    
    // Get a random sentence that's not currently displayed
    const currentTemplateIds = currentSentences.map(s => s.templateId);
    const availableTemplates = pool.filter(t => !currentTemplateIds.includes(t.id));
    
    // If no available templates (all are already shown), don't replace
    if (availableTemplates.length === 0) {
      return;
    }
    
    const randomTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    const newSentences = [...currentSentences];
    newSentences[index] = createSentenceWithPronoun(randomTemplate.id, selectedPronounSet);
    setCurrentSentences(newSentences);
  };

  const replaceAllSentences = () => {
    const count = Math.min(3, showOnlyFavorites ? favoriteSentences.length : SENTENCE_TEMPLATES.length);
    const newSentences = getRandomSentences(count, showOnlyFavorites);
    setCurrentSentences(newSentences);
  };

  const toggleFavorite = (templateId: string) => {
    const newFavorites = favoriteSentences.includes(templateId)
      ? favoriteSentences.filter(id => id !== templateId)
      : [...favoriteSentences, templateId];
    setFavoriteSentences(newFavorites);
  };

  const toggleShowOnlyFavorites = () => {
    // Can't enable favorites if there are none
    if (!showOnlyFavorites && favoriteSentences.length === 0) {
      return;
    }
    
    const newShowOnlyFavorites = !showOnlyFavorites;
    setShowOnlyFavorites(newShowOnlyFavorites);
    
    // Regenerate sentences if switching modes
    if (newShowOnlyFavorites && favoriteSentences.length > 0) {
      // Show only favorites - limit to available count
      const count = Math.min(3, favoriteSentences.length);
      const newSentences = getRandomSentences(count, true);
      setCurrentSentences(newSentences);
    } else if (!newShowOnlyFavorites) {
      // Switching back to all sentences - regenerate
      const newSentences = getRandomSentences(3, false);
      setCurrentSentences(newSentences);
    }
  };

  const handlePronounSetChange = (pronounSetId: string) => {
    setSelectedPronounSet(pronounSetId);
  };
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg order-1 sm:order-2">
      <div className="flex justify-between items-center mb-3 sm:mb-4 gap-1.5 sm:gap-2 flex-wrap">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          Practice Sentences
        </h2>
        <div className="flex gap-1 sm:gap-2 items-center flex-wrap">
          <button
            onClick={replaceAllSentences}
            className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            title="Replace all sentences"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={toggleShowOnlyFavorites}
            className={`
              flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors
              ${showOnlyFavorites 
                ? 'bg-pink-500 text-white' 
                : favoriteSentences.length === 0
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }
            `}
            disabled={!showOnlyFavorites && favoriteSentences.length === 0}
          >
            {showOnlyFavorites ? (
              <>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Favorites</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Favorites</span>
              </>
            )}
          </button>
          <PronounSelector
            selectedPronounSet={selectedPronounSet}
            onPronounSetChange={handlePronounSetChange}
          />
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {currentSentences.map((sentence, index) => {
          const sentenceText = getSentenceWithPronouns(sentence.templateId, sentence.resolvedPronounSetId);
          // Skip if sentence text is empty (template not found)
          if (!sentenceText) return null;
          
          return (
            <SentenceItem
              key={index}
              sentenceText={sentenceText}
              isFavorite={favoriteSentences.includes(sentence.templateId)}
              onToggleFavorite={() => toggleFavorite(sentence.templateId)}
              onReplace={() => replaceSentence(index)}
            />
          );
        })}
      </div>
    </section>
  );
}

