import React from 'react';
import { SkillCategory } from '../data/portfolioData';
import { X, Code2, Server, Palette, Terminal, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface SkillsModalProps {
  categories: SkillCategory[];
  isOpen: boolean;
  onClose: () => void;
}

export const SkillsModal: React.FC<SkillsModalProps> = ({
  categories,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code2 className="w-5 h-5 text-brand-accent" />;
      case 'Server':
        return <Server className="w-5 h-5 text-brand-mint" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-brand-coral" />;
      default:
        return <Terminal className="w-5 h-5 text-brand-accent" />;
    }
  };

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
              Technical Stack & Craft
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
              The Creative Workshop
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-white/10">
                <div className="p-2 rounded-xl bg-white/60 dark:bg-space-850/60 shadow-sm">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  {cat.category}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200/80 dark:border-white/5 shadow-sm hover:border-brand-accent/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-display font-semibold text-sm text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs font-semibold text-brand-accent">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-space-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-brand-accent to-brand-deep dark:to-brand-mint rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-tight">
                      {skill.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Philosophy Banner */}
          <div className="p-5 rounded-2xl bg-brand-accent/5 dark:bg-brand-accent/10 border border-brand-accent/20">
            <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mb-1">
              Guiding Engineering Principles
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Performance first (60fps animation budgets, lazy chunking, strict shader optimization), accessible by default, and engineered with clean modular architectures that delight both users and teammates.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20 flex justify-end">
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-brand-deep dark:bg-brand-accent text-white font-medium text-xs sm:text-sm shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
