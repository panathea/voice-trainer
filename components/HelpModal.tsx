'use client';

import { useState } from 'react';

export default function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Link */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
      >
        Need voice help?
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                How to Use Sweet Nothings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Getting Started
                </h3>
                <p className="leading-relaxed">
                  Welcome to Sweet Nothings! This tool helps you practice voice training by recording yourself reading sentences and listening back to your progress.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  How It Works
                </h3>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Choose practice sentences you like, including selecting affirming pronouns</li>
                  <li>Hold the record button (or spacebar) to record yourself reading them</li>
                  <li>Your recording will play back to you, giving immediate feedback</li>
                  <li>Pin or download your favorite recordings to keep them for reference</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Where is the vocal analysis?
                </h3>
                <p className="leading-relaxed">
                  Lots of voice training tools try to analyze your voice, using foments, pitch, and resonance measurements. These measures are somewhat useful when learning skills in isolation, but even a voice with &quot;perfect&quot; metrics can sound terrible.
                </p>
                <p className="leading-relaxed">
                  Instead of relying on metrics, listen to your voice and decide whether <i>you</i> like it. The only way to improve is to listen to your own voice and iterate on it.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Learn Voice Training Skills
                </h3>
                <p className="leading-relaxed mb-3">
                  This tool helps you practice, but there are lots of exercises and resources to help you improve. The following site provides explanations and guides on vocal weight, resonance, pitch, and more. It also has many voice examples to help you reach a voice that is natural, comfortable, and perfect for you.
                </p>
                <a
                  href="https://wiki.sumianvoice.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Visit Sumian Voice Wiki
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

