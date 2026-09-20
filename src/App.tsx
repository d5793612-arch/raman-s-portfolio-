import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { StoryOverlay } from './components/StoryOverlay';
import { ProgressNav } from './components/ProgressNav';
import { ProjectModal } from './components/ProjectModal';
import { SkillsModal } from './components/SkillsModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { CustomizerModal } from './components/CustomizerModal';
import { ProfileData, getSavedProfileData } from './data/portfolioData';
import { WorldScene } from './three/WorldScene';
import { soundManager } from './audio/soundManager';

export const App: React.FC = () => {
  // State
  const [profile, setProfile] = useState<ProfileData>(getSavedProfileData);
  const [currentStation, setCurrentStation] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ramans_world_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isFreeCamera, setIsFreeCamera] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'project' | 'skills' | 'about' | 'contact' | 'customizer' | null
  >(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('aetheria');

  // Ref to Three.js scene
  const sceneRef = useRef<WorldScene | null>(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ramans_world_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ramans_world_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    soundManager.playPop();
  }, []);

  const handleToggleSound = useCallback(() => {
    const isNowPlaying = soundManager.toggleMute();
    setIsSoundMuted(!isNowPlaying);
  }, []);

  const handleToggleFreeCamera = useCallback(() => {
    if (sceneRef.current) {
      const newFreeState = sceneRef.current.toggleFreeCamera();
      setIsFreeCamera(newFreeState);
      soundManager.playPop();
    }
  }, []);

  const handleStationChange = useCallback((index: number) => {
    setCurrentStation(index);
    setHasInteracted(true);
  }, []);

  const handleSelectStation = useCallback((index: number) => {
    setCurrentStation(index);
    setHasInteracted(true);
    if (isFreeCamera && sceneRef.current) {
      sceneRef.current.isFreeCamera = false;
      setIsFreeCamera(false);
    }
    if (sceneRef.current) {
      sceneRef.current.jumpToStation(index);
    }
  }, [isFreeCamera]);

  const handlePrevStation = useCallback(() => {
    handleSelectStation(Math.max(0, currentStation - 1));
  }, [currentStation, handleSelectStation]);

  const handleNextStation = useCallback(() => {
    handleSelectStation(Math.min(profile.stations.length - 1, currentStation + 1));
  }, [currentStation, profile.stations.length, handleSelectStation]);

  // Handle CTA buttons from station cards
  const handleCtaClick = useCallback(
    (action?: string) => {
      setHasInteracted(true);
      if (!action) return;

      switch (action) {
        case 'openProjects':
          setSelectedProjectId(profile.projects[0]?.id || 'aetheria');
          setActiveModal('project');
          break;
        case 'openSkills':
          setActiveModal('skills');
          break;
        case 'openAbout':
          setActiveModal('about');
          break;
        case 'openContact':
          setActiveModal('contact');
          break;
        case 'openPlayground':
          // Trigger physics boulder drop!
          if (sceneRef.current) {
            sceneRef.current.triggerPhysicsDrop();
            soundManager.playSuccess();
          }
          break;
      }
    },
    [profile.projects]
  );

  // Handle raycast click on 3D objects
  const handleObjectClick = useCallback((type: string, id?: string) => {
    setHasInteracted(true);
    if (type === 'project' && id) {
      setSelectedProjectId(id);
      setActiveModal('project');
    } else if (type === 'skill') {
      setActiveModal('skills');
    } else {
      soundManager.playPop();
    }
  }, []);

  const currentStationData = profile.stations[currentStation] || profile.stations[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#f4f6fb] dark:bg-[#0b0d19] font-sans">
      {/* Three.js Interactive 3D World Canvas */}
      <ThreeCanvas
        currentStation={currentStation}
        onStationChange={handleStationChange}
        isDarkMode={isDarkMode}
        isFreeCamera={isFreeCamera}
        onObjectClick={handleObjectClick}
        onSceneReady={(scene) => {
          sceneRef.current = scene;
        }}
      />

      {/* Top HUD & Navbar */}
      <Navbar
        profile={profile}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
        isFreeCamera={isFreeCamera}
        onToggleFreeCamera={handleToggleFreeCamera}
        onOpenCustomizer={() => setActiveModal('customizer')}
        onOpenContact={() => setActiveModal('contact')}
        onSelectStation={handleSelectStation}
        currentStation={currentStation}
      />

      {/* Dynamic Station Narrative Overlay */}
      <StoryOverlay
        station={currentStationData}
        profile={profile}
        isFreeCamera={isFreeCamera}
        onExitFreeCamera={() => {
          if (sceneRef.current) {
            sceneRef.current.isFreeCamera = false;
            setIsFreeCamera(false);
          }
        }}
        onCtaClick={handleCtaClick}
        hasInteracted={hasInteracted}
        onNextStation={handleNextStation}
      />

      {/* Bottom Progress Bar & Scrubber Dock */}
      <ProgressNav
        stations={profile.stations}
        currentStation={currentStation}
        onSelectStation={handleSelectStation}
        onPrevStation={handlePrevStation}
        onNextStation={handleNextStation}
      />

      {/* Interactive Modals */}
      <ProjectModal
        projects={profile.projects}
        initialProjectId={selectedProjectId}
        isOpen={activeModal === 'project'}
        onClose={() => setActiveModal(null)}
      />

      <SkillsModal
        categories={profile.skillCategories}
        isOpen={activeModal === 'skills'}
        onClose={() => setActiveModal(null)}
      />

      <AboutModal
        profile={profile}
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
        onOpenContact={() => setActiveModal('contact')}
      />

      <ContactModal
        profile={profile}
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal(null)}
      />

      <CustomizerModal
        profile={profile}
        isOpen={activeModal === 'customizer'}
        onClose={() => setActiveModal(null)}
        onUpdateProfile={(updated) => setProfile(updated)}
      />
    </div>
  );
};
