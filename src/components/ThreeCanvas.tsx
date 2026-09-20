import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WorldScene } from '../three/WorldScene';
import { soundManager } from '../audio/soundManager';

interface ThreeCanvasProps {
  currentStation: number;
  onStationChange: (index: number) => void;
  isDarkMode: boolean;
  isFreeCamera: boolean;
  onObjectClick: (type: string, id?: string) => void;
  onSceneReady?: (scene: WorldScene) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentStation,
  onStationChange,
  isDarkMode,
  isFreeCamera,
  onObjectClick,
  onSceneReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<WorldScene | null>(null);

  // Drag interaction states
  const isPointerDown = useRef<boolean>(false);
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistance = useRef<number>(0);
  const velocity = useRef<number>(0);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  // Sync theme
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setDarkMode(isDarkMode);
    }
  }, [isDarkMode]);

  // Sync free camera mode
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.isFreeCamera = isFreeCamera;
    }
  }, [isFreeCamera]);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new WorldScene(containerRef.current);
    sceneRef.current = scene;
    scene.setDarkMode(isDarkMode);
    scene.isFreeCamera = isFreeCamera;

    scene.onStationChange = (index) => {
      onStationChange(index);
      soundManager.setStationChord(index);
    };

    scene.onObjectClick = (type, id) => {
      soundManager.playPop();
      onObjectClick(type, id);
    };

    if (onSceneReady) {
      onSceneReady(scene);
    }

    const handleResize = () => {
      scene.handleResize();
    };
    window.addEventListener('resize', handleResize);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        scene.setProgress(scene.progress + 0.05);
        soundManager.playDragTick();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        scene.setProgress(scene.progress - 0.05);
        soundManager.playDragTick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Jump to station when requested by parent
  useEffect(() => {
    if (sceneRef.current && !sceneRef.current.isFreeCamera) {
      sceneRef.current.jumpToStation(currentStation);
    }
  }, [currentStation]);

  // Mouse / Touch handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isPointerDown.current = true;
    setIsGrabbing(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    dragDistance.current = 0;
    velocity.current = 0;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!sceneRef.current) return;

    // Parallax update
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    sceneRef.current.targetMouseNorm = { x: normX, y: normY };

    if (!isPointerDown.current) return;

    const deltaX = e.clientX - lastPointerPos.current.x;
    const deltaY = e.clientY - lastPointerPos.current.y;
    dragDistance.current += Math.abs(deltaX) + Math.abs(deltaY);

    if (sceneRef.current.isFreeCamera) {
      if (e.shiftKey || e.buttons === 2) {
        sceneRef.current.panFreeOrbit(deltaX, deltaY);
      } else {
        sceneRef.current.rotateFreeOrbit(deltaX, deltaY);
      }
    } else {
      // Story mode horizontal drag
      // Dragging left advances the scene, dragging right reverses
      const sensitivity = 0.0018;
      const progressDelta = -deltaX * sensitivity;
      velocity.current = progressDelta;
      sceneRef.current.setProgress(sceneRef.current.progress + progressDelta);

      if (Math.abs(deltaX) > 4) {
        soundManager.playDragTick();
      }
    }

    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!sceneRef.current) return;
    isPointerDown.current = false;
    setIsGrabbing(false);

    // If small movement, treat as raycast click on 3D elements!
    if (dragDistance.current < 6) {
      sceneRef.current.handleRaycastClick(e.clientX, e.clientY);
    } else if (!sceneRef.current.isFreeCamera) {
      // Apply subtle inertia
      const inertiaProgress = sceneRef.current.progress + velocity.current * 8.0;
      sceneRef.current.setProgress(inertiaProgress);
    }
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (!sceneRef.current) return;

    if (sceneRef.current.isFreeCamera) {
      sceneRef.current.zoomFreeOrbit(e.deltaY);
    } else {
      // Scroll wheel advances story
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.0006;
      sceneRef.current.setProgress(sceneRef.current.progress + delta);
      soundManager.playDragTick();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full touch-none select-none ${
        isFreeCamera ? (isGrabbing ? 'cursor-move' : 'cursor-grab') : isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};
