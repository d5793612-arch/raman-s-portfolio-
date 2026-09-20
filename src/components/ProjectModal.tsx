import React, { useState, useEffect } from 'react';
import { Project } from '../data/portfolioData';
import { X, ExternalLink, Sparkles, CheckCircle2, Layers, Cpu, Award } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { soundManager } from '../audio/soundManager';

interface ProjectModalProps {
  projects: Project[];
  initialProjectId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  projects,
  initialProjectId,
  isOpen,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id || '');

  useEffect(() => {
    if (initialProjectId) {
      const match = projects.find(
        (p) => p.id.toLowerCase() === initialProjectId.toLowerCase() || p.title.toLowerCase().includes(initialProjectId.toLowerCase())
      );
      if (match) {
        setSelectedId(match.id);
      }
    }
  }, [initialProjectId, projects]);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedId) || projects[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-white/10 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Case Studies
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
              Project Pavilion
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

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-2 p-3 sm:px-6 bg-gray-100/50 dark:bg-black/30 overflow-x-auto custom-scrollbar border-b border-gray-200 dark:border-white/10">
          {projects.map((proj) => {
            const isTabActive = proj.id === currentProject.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedId(proj.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isTabActive
                    ? 'bg-brand-deep dark:bg-brand-accent text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                {proj.title}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-6">
          {/* Hero Visual Card */}
          <div
            className={`w-full rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${currentProject.gradient} text-white shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono tracking-wider font-semibold uppercase">
                  {currentProject.category}
                </span>
                <span className="text-white/80 text-xs font-mono">{currentProject.year}</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-4xl tracking-tight mb-2">
                {currentProject.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base max-w-2xl font-light">
                {currentProject.tagline}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          {currentProject.stats && currentProject.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {currentProject.stats.map((s, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5 text-center"
                >
                  <p className="font-display font-extrabold text-lg sm:text-2xl text-brand-accent">
                    {s.value}
                  </p>
                  <p className="font-mono text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Narrative */}
          <div>
            <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-2">
              Overview & Architecture
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {currentProject.description}
            </p>
          </div>

          {/* Key Engineering Highlights */}
          <div>
            <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-accent" />
              Key Features & Innovations
            </h4>
            <ul className="space-y-2.5">
              {currentProject.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies Used */}
          <div>
            <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-accent" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentProject.technologies.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-space-800 text-gray-800 dark:text-gray-200 text-xs font-mono border border-gray-200 dark:border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {currentProject.demoUrl && (
              <a
                href={currentProject.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-brand-deep dark:bg-brand-accent text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
              >
                <span>Live Interactive Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {currentProject.githubUrl && (
              <a
                href={currentProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl glass-pill text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Source</span>
              </a>
            )}
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="text-xs font-mono text-gray-500 dark:text-gray-400 hover:underline"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
