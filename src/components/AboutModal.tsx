import React from 'react';
import { ProfileData } from '../data/portfolioData';
import { X, User, Heart, Coffee, Compass, FileText, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface AboutModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  profile,
  isOpen,
  onClose,
  onOpenContact,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Behind the Canvas
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
              About {profile.name}
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-6">
          {/* Intro profile snippet */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200/80 dark:border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-deep to-brand-accent flex items-center justify-center text-white text-2xl font-display font-extrabold shadow-lg shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {profile.name}
              </h3>
              <p className="font-mono text-xs text-brand-accent mb-1">{profile.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {profile.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Journey */}
          <div className="space-y-3.5">
            <h4 className="font-display font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-accent" />
              The Journey
            </h4>
            {profile.bio.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Timeline / Milestones */}
          <div className="space-y-3 pt-2">
            <h4 className="font-display font-bold text-base text-gray-900 dark:text-white">
              Milestones Along the Way
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/40 dark:bg-space-850/40 border border-gray-200/60 dark:border-white/5 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-brand-accent/20 text-brand-accent font-semibold">
                  2024–Now
                </span>
                <div>
                  <p className="font-sans font-semibold text-gray-900 dark:text-white">
                    Creative Developer & Lead Interaction Designer
                  </p>
                  <p className="text-gray-500 font-sans mt-0.5">
                    Building experimental 3D applications, WebGL visualizers, and accessible design systems.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/40 dark:bg-space-850/40 border border-gray-200/60 dark:border-white/5 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-brand-mint/20 text-brand-mint font-semibold">
                  2022–2024
                </span>
                <div>
                  <p className="font-sans font-semibold text-gray-900 dark:text-white">
                    Full-Stack Software Engineer
                  </p>
                  <p className="text-gray-500 font-sans mt-0.5">
                    Architected high-throughput reactive web interfaces, data dashboards, and real-time collaboration engines.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/40 dark:bg-space-850/40 border border-gray-200/60 dark:border-white/5 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-brand-coral/20 text-brand-coral font-semibold">
                  Origin
                </span>
                <div>
                  <p className="font-sans font-semibold text-gray-900 dark:text-white">
                    B.S. in Computer Science & Interactive Media
                  </p>
                  <p className="text-gray-500 font-sans mt-0.5">
                    Graduated with honors, focusing on computer graphics, human-computer interaction, and typography.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Off-screen interests */}
          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <Coffee className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Off the Keyboard
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                When not writing shaders: crafting light roast pour-overs (Ethiopian Yirgacheffe), tinkering with ortholinear mechanical keyboards, shooting 35mm film photography, and road cycling.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
              onOpenContact();
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-deep dark:bg-brand-accent text-white font-medium text-xs sm:text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            Get in Touch with {profile.name}
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="text-xs font-mono text-gray-500 dark:text-gray-400 hover:underline"
          >
            Back to Island
          </button>
        </div>
      </div>
    </div>
  );
};
