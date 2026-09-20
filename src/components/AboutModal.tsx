import React, { useState } from 'react';
import { ProfileData } from '../data/portfolioData';
import {
  X,
  User,
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  MapPin,
  ExternalLink,
  Sparkles,
  Quote,
  CheckCircle,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
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
  const [activeTab, setActiveTab] = useState<'bio' | 'experience' | 'education' | 'achievements'>('bio');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Behind Raman&apos;s World
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
              About {profile.fullName || profile.name}
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

        {/* Profile Identity Bar */}
        <div className="p-5 sm:px-8 bg-white/60 dark:bg-space-850/60 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-deep via-brand-accent to-brand-coral flex items-center justify-center text-white text-2xl font-display font-black shadow-lg shrink-0">
              RK
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                {profile.fullName || profile.name}
                <span className="px-2 py-0.5 rounded-full bg-brand-mint/15 text-brand-mint text-[11px] font-mono font-medium">
                  GATE &apos;25 AIR 6450
                </span>
              </h3>
              <p className="font-mono text-xs text-brand-accent mb-0.5">{profile.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl glass-pill text-gray-700 dark:text-gray-300 hover:text-brand-accent transition-all"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl glass-pill text-gray-700 dark:text-gray-300 hover:text-brand-accent transition-all"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={profile.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl glass-pill text-gray-700 dark:text-gray-300 hover:text-brand-accent transition-all"
              title="Twitter / X"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 pt-3 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('bio');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bio'
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Bio & Principles</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('experience');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience & Leadership</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('education');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'education'
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('achievements');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Research & Honors</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8">
          {/* TAB 1: BIO */}
          {activeTab === 'bio' && (
            <div className="space-y-6">
              {/* Quote banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-brand-accent/5 dark:bg-brand-accent/10 border border-brand-accent/20 flex items-start gap-3">
                <Quote className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 italic">
                    &ldquo;Work for a cause, not for applause. Live life to express, not to impress.&rdquo;
                  </p>
                  <p className="text-xs font-mono text-brand-accent mt-1">— Raman Kumar</p>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-3.5">
                {profile.bio.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Quick Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5">
                  <p className="font-mono text-xs uppercase text-brand-accent font-semibold mb-1">
                    Problem Solver
                  </p>
                  <p className="font-display font-bold text-base text-gray-900 dark:text-white">
                    AIR 6450 GATE 2025
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    LeetCode, GFG, Codeforces & HackerRank active coder.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5">
                  <p className="font-mono text-xs uppercase text-brand-mint font-semibold mb-1">
                    Cloud Leader
                  </p>
                  <p className="font-display font-bold text-base text-gray-900 dark:text-white">
                    Team Lead @ GFG-KIIT
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Led 15 developers, boosted operational efficiency by 20%.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5">
                  <p className="font-mono text-xs uppercase text-brand-coral font-semibold mb-1">
                    Published Author
                  </p>
                  <p className="font-display font-bold text-base text-gray-900 dark:text-white">
                    Springer Nature &apos;26
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Research on Anomaly & Fraud Detection with Data Mining.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-display font-bold text-base text-gray-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <p className="text-xs font-mono text-brand-accent">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-space-800 text-gray-700 dark:text-gray-300 text-xs font-mono self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-display font-bold text-base text-gray-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-xs font-mono text-brand-accent">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-brand-mint/15 text-brand-mint text-xs font-mono font-semibold">
                        {edu.score}
                      </span>
                      <span className="text-xs font-mono text-gray-500">{edu.period}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ACHIEVEMENTS & RESEARCH */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              {profile.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/60 dark:bg-space-850/60 border border-gray-200 dark:border-white/5 flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-display font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                        {ach.title}
                      </h4>
                      <span className="text-xs font-mono text-brand-accent">{ach.year}</span>
                    </div>
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {ach.organization}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pt-0.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* Research Highlight Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-deep/10 via-brand-accent/15 to-transparent border border-brand-accent/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-semibold uppercase">
                  <BookOpen className="w-4 h-4" />
                  <span>Springer Nature Research Publication</span>
                </div>
                <h4 className="font-display font-bold text-base text-gray-900 dark:text-white">
                  Identifying Anomalies: A Data Mining Approach to Fraud Detection
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  Authors: Raman Kumar, Rituraj Singh (2026)
                </p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Focusing on anomaly detection in high-volume transaction datasets using hybrid classification algorithms, Particle Swarm Optimization (PSO), and PCA dimensionality reduction.
                </p>
              </div>
            </div>
          )}
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
