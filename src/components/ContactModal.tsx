import React, { useState } from 'react';
import { ProfileData } from '../data/portfolioData';
import { X, Mail, Copy, Check, Send, Sparkles, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
import confetti from 'canvas-confetti';
import { soundManager } from '../audio/soundManager';

interface ContactModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setHasCopied(true);
    soundManager.playSuccess();

    // Celebration confetti burst!
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#757BFD', '#FF6464', '#3ddc97', '#ffb703'],
    });

    setTimeout(() => {
      setHasCopied(false);
    }, 2800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    soundManager.playSuccess();
    setFormSent(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#757BFD', '#FF6464', '#3ddc97'],
    });

    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              World&apos;s End & Lighthouse Beacon
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
              Let&apos;s Build Together
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
          {/* Email Quick-Copy Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-deep/10 via-brand-accent/10 to-transparent dark:from-brand-deep/20 dark:via-brand-accent/20 border border-brand-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-deep dark:bg-brand-accent text-white shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Direct Inquiries
                </p>
                <p className="font-mono font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  {profile.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm ${
                hasCopied
                  ? 'bg-brand-mint text-gray-900'
                  : 'bg-white dark:bg-space-850 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-space-800 border border-gray-200 dark:border-white/10 active:scale-95'
              }`}
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-brand-accent" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>

          {/* Contact Message Form */}
          {formSent ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-emerald-800 dark:text-emerald-200">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                Thank you for dropping a line at the lighthouse. I&apos;ll reply shortly!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ada Lovelace"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="ada@computing.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Project Vision or Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hey Raman, I loved exploring your 3D world! We'd love to collaborate on..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-space-850/70 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none custom-scrollbar"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-deep dark:bg-brand-accent text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-deep/20 dark:shadow-brand-accent/30 hover:opacity-90 active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Dispatch to Lighthouse</span>
              </button>
            </form>
          )}

          {/* Social Profiles */}
          <div className="pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 text-center">
              Find Raman on the Web
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl glass-pill text-gray-700 dark:text-gray-300 hover:text-brand-accent hover:scale-110 transition-all shadow-sm"
                title="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl glass-pill text-gray-700 dark:text-gray-300 hover:text-brand-accent hover:scale-110 transition-all shadow-sm"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={profile.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl glass-pill text-gray-700 dark:text-gray-300 hover:text-brand-accent hover:scale-110 transition-all shadow-sm"
                title="Twitter / X"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
