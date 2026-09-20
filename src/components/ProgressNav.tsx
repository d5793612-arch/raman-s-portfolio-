import React from 'react';
import { Station } from '../data/portfolioData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface ProgressNavProps {
  stations: Station[];
  currentStation: number;
  onSelectStation: (index: number) => void;
  onPrevStation: () => void;
  onNextStation: () => void;
}

export const ProgressNav: React.FC<ProgressNavProps> = ({
  stations,
  currentStation,
  onSelectStation,
  onPrevStation,
  onNextStation,
}) => {
  const currentStep = currentStation + 1;
  const progressPercent = Math.round((currentStation / (stations.length - 1)) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none p-4 sm:p-6 flex justify-center">
      <div className="pointer-events-auto glass-pill px-3 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-4 border border-white/60 dark:border-white/10 max-w-full overflow-x-auto custom-scrollbar">
        {/* Previous Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onPrevStation();
          }}
          disabled={currentStation <= 0}
          className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
            currentStation <= 0
              ? 'opacity-30 cursor-not-allowed text-gray-400'
              : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90'
          }`}
          title="Previous Station"
          aria-label="Previous Station"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Timeline Station Nodes */}
        <div className="flex items-center gap-1 sm:gap-2">
          {stations.map((st, idx) => {
            const isActive = idx === currentStation;
            return (
              <button
                key={st.id}
                onClick={() => {
                  soundManager.playChime(400 + idx * 80);
                  onSelectStation(idx);
                }}
                className={`group relative px-2.5 py-1.5 rounded-full text-xs font-mono transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-deep dark:bg-brand-accent text-white shadow-md shadow-brand-deep/25 scale-105 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={st.title}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isActive ? 'bg-white scale-125' : 'bg-gray-400 dark:bg-gray-600 group-hover:bg-brand-accent'
                  }`}
                />
                <span className="hidden md:inline text-[11px] uppercase tracking-wider">
                  0{idx + 1} {st.title.split(' ')[0]}
                </span>
                <span className="md:hidden text-[10px]">0{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onNextStation();
          }}
          disabled={currentStation >= stations.length - 1}
          className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
            currentStation >= stations.length - 1
              ? 'opacity-30 cursor-not-allowed text-gray-400'
              : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90'
          }`}
          title="Next Station"
          aria-label="Next Station"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Progress percent badge */}
        <div className="hidden sm:flex items-center pl-2 border-l border-gray-300 dark:border-gray-700">
          <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
            {progressPercent}%
          </span>
        </div>
      </div>
    </div>
  );
};
