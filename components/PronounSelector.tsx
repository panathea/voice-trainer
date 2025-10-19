'use client';

import { getPronounSetOptions } from '@/lib/pronouns';

interface PronounSelectorProps {
  selectedPronounSet: string;
  onPronounSetChange: (pronounSetId: string) => void;
}

export default function PronounSelector({ selectedPronounSet, onPronounSetChange }: PronounSelectorProps) {
  const options = getPronounSetOptions();

  return (
    <div className="relative">
      <select
        value={selectedPronounSet}
        onChange={(e) => onPronounSetChange(e.target.value)}
        className="
          px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm
          bg-gray-100 dark:bg-slate-700
          text-gray-700 dark:text-gray-300
          rounded-lg
          border border-gray-200 dark:border-slate-600
          hover:bg-gray-200 dark:hover:bg-slate-600
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors
          cursor-pointer
          appearance-none
          pr-7 sm:pr-8
        "
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

