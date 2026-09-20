import React, { useState } from 'react';
import { ProfileData, saveProfileData, initialProfileData } from '../data/portfolioData';
import { X, Save, RotateCcw, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface CustomizerModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updated: ProfileData) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  profile,
  isOpen,
  onClose,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData(formData);
    onUpdateProfile(formData);
    soundManager.playSuccess();
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Reset portfolio profile details to original defaults?')) {
      setFormData(initialProfileData);
      saveProfileData(initialProfileData);
      onUpdateProfile(initialProfileData);
      soundManager.playPop();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Profile Customizer
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
              Personalize Raman&apos;s World
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

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Customize any details below to match your exact identity, role, and links. Changes persist immediately in your browser!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Display Name / Full Name
              </label>
              <input
                type="text"
                value={formData.fullName || formData.name}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value, name: e.target.value.split(' ')[0] })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Headline Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Availability Status
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                Twitter / X URL
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-200 dark:border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl glass-pill text-xs font-mono text-gray-600 dark:text-gray-300 hover:text-brand-coral flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-deep dark:bg-brand-accent text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-brand-deep/20 dark:shadow-brand-accent/30 hover:opacity-90 active:scale-95 transition-all"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Changes Saved!' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
