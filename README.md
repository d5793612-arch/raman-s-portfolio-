# Raman's World 🌐

An award-winning inspired interactive 3D portfolio website built with **Three.js**, **React 19**, **TypeScript**, and **Tailwind CSS**, capturing the spirit and mechanics of [Joshua's World](https://joshuasworld.netlify.app/) (Awwwards Site of the Day).

![Raman's World Preview](https://img.shields.io/badge/Awwwards-Inspired-757bfd?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![React](https://img.shields.io/badge/React_19-TypeScript-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features & Architecture

### 🏝️ 1. Interactive 3D Low-Poly Archipelago
- **Procedural Flat-Shaded Low-Poly World**: Handcrafted stylized archipelago with elevation levels, sandy shores, stone pathways, birch and pine forests, blooming blossom trees, and dramatic sea bluffs.
- **6 Story Landmarks & Stations**:
  1. **Genesis Island (01)**: The starting pier with a moored rowing boat, lanterns, welcoming stone portal, and initial journey intro.
  2. **The Workshop (02)**: Modern architectural studio atelier with spinning interactive code polyhedra (Three.js, React, Shaders, Design Systems) and creative workstation.
  3. **Project Pavilion (03)**: Glass-walled modern exhibition pavilions with floating interactive holographic project cubes.
  4. **The Observatory (04)**: Classical observatory dome with brass telescope, spinning planetary gyroscope, and an interactive **Gravity Mode** physics playground!
  5. **The Campfire (05)**: Cozy mountain retreat with flickering campfire flames, tent, log benches, and personal story cards.
  6. **The Beacon (06)**: Towering Scandinavian red-and-white lighthouse with a rotating volumetric light beam casting across the ocean at World's End, mailbox, and contact harbor.
- **Dynamic Living Environment**:
  - Procedural vertex-displaced animated ocean waves.
  - Drifting low-poly clouds casting shadows.
  - Floating hot air balloon gently bobbing in the sky.
  - Low-poly paper airplane flying in a figure-eight loop.
  - Floating fireflies and starfield particles in dark mode.

### 🎮 2. Navigation & Smooth Spline Controls
- **Horizontal Drag & Inertia**: Drag left/right with mouse or touch swipe to glide seamlessly across the island.
- **Mouse Wheel / Trackpad**: Scroll horizontally or vertically to advance along the journey.
- **Keyboard Navigation**: Use `←` / `→` arrow keys or `A` / `D` keys to walk the story path.
- **Station Scrubber Dock**: Bottom timeline bar displaying all 6 milestones with progress percentages and 1-click station jumping.
- **Free 3D Orbit Mode**: Switch from cinematic story rail to free drone orbit view to inspect every corner of the 3D world with drag-to-rotate and scroll-to-zoom!

### 🌓 3. Day & Night Mode (Dark / Light Theme)
- Smooth material, sky, fog, and light color interpolation between:
  - **Day Mode**: Warm Mediterranean/Nordic daylight, pastel sky, emerald meadows, and crystal blue water.
  - **Night Mode**: Deep midnight indigo cosmos, illuminated glowing windows, bioluminescent water edges, starfield, fireflies, and lighthouse beam.

### 🎵 4. Procedural Web Audio Sound Engine
- Zero external MP3 asset dependency: uses the native Web Audio API.
- Relaxing, warm ambient synthesizer chord progressions that shift harmonics as you travel between stations.
- Delightful tactile UI sound effects for milestone ticks, hover chimes, button pops, and celebration chords.

### 💼 5. Case Studies, Stack & In-App Customizer
- **Project Modals**: In-depth breakdowns of featured projects (*Aetheria*, *NovaFlow*, *Kinetica*, *Lumina*) with stats, key features, tech stacks, live demo links, and GitHub links.
- **Interactive Skills Modal**: Technical proficiencies across Frontend, Backend, and Design.
- **Interactive Contact Modal**: 1-click "Copy Email" with celebratory canvas confetti burst and direct message dispatch.
- **Live Profile Customizer**: Customize Raman's name, title, bio, email, and social handles directly from the website with localStorage persistence!

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or pnpm

### Installation
```bash
git clone https://github.com/d5793612-arch/raman-s-portfolio-.git
cd raman-s-portfolio-
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Engine**: Three.js (WebGL, Flat Shading, PCFSoftShadowMap, CatmullRomCurve3 Splines)
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism
- **Audio**: Web Audio API (Harmonic Synthesizer)
- **Effects**: Canvas-Confetti, Raycasting & Custom Physics
- **Bundler**: Vite 8
