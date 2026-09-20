import React, { useState } from 'react';
import { Station, ProfileData } from '../data/portfolioData';
import { ArrowRight, MoveHorizontal, Sparkles, Compass, Lightbulb } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface StoryOverlayProps {
  station: Station;
  profile: ProfileData;
  isFreeCamera: boolean;
  onExitFreeCamera: () => void;
  onCtaClick: (action?: string) => void;
  hasInteracted: boolean;
  onNextStation: () => void;
}

export const StoryOverlay: React.FC<StoryOverlayProps> = ({
  station,
  profile,
  isFreeCamera,
  onExitFreeCamera,
  onCtaClick,
  hasInteracted,
  onNextStation,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-8 md:p-12">
      {/* Top spacer for navbar */}
      <div className="h-16 sm:h-20" />

      {/* Center / Free Camera banner */}
      {isFreeCamera && (
        <div className="self-center pointer-events-auto glass-panel px-5 py-3 rounded-2xl flex items-center gap-3.5 shadow-2xl animate-fade-in border border-brand-coral/30">
          <div className="p-2 rounded-xl bg-brand-coral/20 text-brand-coral">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <p className="font-display font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
              Free 3D Orbit Mode Active
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              Drag to orbit • Scroll to zoom • Shift+drag to pan
            </p>
          </div>
          <button
            onClick={onExitFreeCamera}
            className="ml-2 px-3 py-1.5 rounded-xl bg-brand-coral text-white text-xs font-medium hover:bg-brand-coral/90 transition-colors shadow-md"
          >
            Back to Story
          </button>
        </div>
      )}

      {/* Station Story Card */}
      {!isFreeCamera && (
        <div className="self-start max-w-lg w-full mb-20 sm:mb-24 animate-fade-in">
          <div className="pointer-events-auto glass-panel p-5 sm:p-7 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-brand-accent/10 border border-white/60 dark:border-white/10">
            {/* Station Step Badge & Location */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-accent flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: station.accentColor }} />
                {station.locationTag}
              </span>
              <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                0{station.step} / 06
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white tracking-tight leading-tight mb-1">
              {station.title}
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3.5">
              {station.subtitle}
            </p>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-5">
              {station.description}
            </p>

            {/* Interactive Fun Fact / Pro Tip */}
            {station.funFact && (
              <div className="mb-5 p-3 rounded-2xl bg-brand-accent/5 dark:bg-brand-accent/10 border border-brand-accent/15 flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                <Lightbulb className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <span className="leading-snug">{station.funFact}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {station.ctaText && (
                <button
                  onClick={() => {
                    soundManager.playPop();
                    onCtaClick(station.ctaAction);
                  }}
                  className="group px-5 py-2.5 rounded-2xl bg-brand-deep dark:bg-brand-accent text-white font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center gap-2 shadow-lg shadow-brand-deep/20 dark:shadow-brand-accent/30"
                >
                  <span>{station.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {station.step < 6 && (
                <button
                  onClick={onNextStation}
                  className="px-4 py-2.5 rounded-2xl glass-pill text-xs font-mono font-medium text-gray-700 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <span>Next Station</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drag to Explore Initial Hint (Famous Joshua's World signature) */}
      {!hasInteracted && !isFreeCamera && (
        <div className="self-center pointer-events-none mb-16 sm:mb-20 animate-fade-in flex flex-col items-center gap-2">
          <div className="glass-pill px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl animate-drag-hint border border-brand-accent/30">
            <MoveHorizontal className="w-4 h-4 text-brand-accent animate-pulse" />
            <span className="font-display font-medium text-xs sm:text-sm text-gray-900 dark:text-white tracking-wide">
              Drag horizontally or scroll to explore
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
