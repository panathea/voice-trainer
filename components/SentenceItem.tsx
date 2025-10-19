'use client';

interface SentenceItemProps {
  sentenceText: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReplace: () => void;
}

export default function SentenceItem({ 
  sentenceText, 
  isFavorite, 
  onToggleFavorite, 
  onReplace 
}: SentenceItemProps) {
  return (
    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
      <p className="flex-1 text-md sm:text-base text-gray-800 dark:text-gray-200 leading-snug sm:leading-relaxed">
        {sentenceText}
      </p>
      <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-1 flex-shrink-0">
        <button
          onClick={onToggleFavorite}
          className="p-1.5 sm:p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        <button
          onClick={onReplace}
          className="p-1.5 sm:p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title="Replace sentence"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}

