import React from 'react';
import { Volume2, VolumeX, Sun, Moon, Compass, Sparkles, Settings, Mail, MapPin } from 'lucide-react';
import { ProfileData } from '../data/portfolioData';

interface NavbarProps {
  profile: ProfileData;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  isFreeCamera: boolean;
  onToggleFreeCamera: () => void;
  onOpenCustomizer: () => void;
  onOpenContact: () => void;
  onSelectStation: (index: number) => void;
  currentStation: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isDarkMode,
  onToggleTheme,
  isSoundMuted,
  onToggleSound,
  isFreeCamera,
  onToggleFreeCamera,
  onOpenCustomizer,
  onOpenContact,
  onSelectStation,
  currentStation,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-4 sm:p-6 flex items-center justify-between">
      {/* Brand & Status */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => onSelectStation(0)}
          className="group flex items-center gap-2.5 glass-pill px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95"
          title="Return to start"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-sm sm:text-base tracking-wider uppercase text-gray-900 dark:text-white flex items-center gap-1.5">
              {profile.name}&apos;S WORLD
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-accent/15 text-brand-accent font-medium">
                3D Experience
              </span>
            </span>
          </div>
        </button>

        {/* Status Pill (desktop) */}
        <div className="hidden lg:flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-gray-700 dark:text-gray-300">
          <span className="w-2 h-2 rounded-full bg-brand-mint" />
          <span>{profile.availability}</span>
        </div>
      </div>

      {/* Control Buttons Dock */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`glass-pill p-2.5 sm:px-3 sm:py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-xs font-mono ${
            !isSoundMuted
              ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40 shadow-lg shadow-brand-accent/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title={isSoundMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
          aria-label="Toggle sound"
        >
          {isSoundMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-brand-accent" />
              <div className="hidden sm:flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-brand-accent rounded animate-pulse" />
                <span className="w-0.5 h-2 bg-brand-accent rounded animate-bounce" />
                <span className="w-0.5 h-3 bg-brand-accent rounded animate-pulse" />
              </div>
            </>
          )}
          <span className="hidden md:inline">{isSoundMuted ? 'Sound OFF' : 'Sound ON'}</span>
        </button>

        {/* Free Orbit / Story Mode Toggle */}
        <button
          onClick={onToggleFreeCamera}
          className={`glass-pill p-2.5 sm:px-3.5 sm:py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-xs font-mono ${
            isFreeCamera
              ? 'bg-brand-coral/20 text-brand-coral border-brand-coral/40 shadow-lg shadow-brand-coral/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title={isFreeCamera ? 'Switch to Story Rail Mode' : 'Switch to Free 3D Orbit Mode'}
          aria-label="Toggle Camera Mode"
        >
          <Compass className={`w-4 h-4 ${isFreeCamera ? 'animate-spin-slow text-brand-coral' : ''}`} />
          <span className="hidden sm:inline">{isFreeCamera ? 'Free Orbit' : 'Story Mode'}</span>
        </button>

        {/* Day / Night Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="glass-pill p-2.5 rounded-full transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent hover:rotate-12 active:scale-90"
          title={isDarkMode ? 'Switch to Light Mode (Day)' : 'Switch to Dark Mode (Night)'}
          aria-label="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-deep" />}
        </button>

        {/* Profile Customizer */}
        <button
          onClick={onOpenCustomizer}
          className="glass-pill p-2.5 rounded-full transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-brand-accent hover:rotate-45 active:scale-90"
          title="Customize Raman's Profile & Details"
          aria-label="Customize Profile"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Quick Contact CTA */}
        <button
          onClick={onOpenContact}
          className="glass-pill hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-brand-deep dark:bg-brand-accent text-white font-medium text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-brand-deep/20 dark:shadow-brand-accent/25"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>
      </div>
    </header>
  );
};
