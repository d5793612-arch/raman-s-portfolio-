export interface Station {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  description: string;
  locationTag: string;
  accentColor: string;
  ctaText?: string;
  ctaAction?: 'openProjects' | 'openSkills' | 'openPlayground' | 'openAbout' | 'openContact';
  funFact?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  description: string;
  highlights: string[];
  technologies: string[];
  gradient: string;
  demoUrl?: string;
  githubUrl?: string;
  stats?: { label: string; value: string }[];
}

export interface SkillCategory {
  category: string;
  iconName: string;
  skills: { name: string; level: number; note: string }[];
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  welcomeSub: string;
  location: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  bio: string[];
  stations: Station[];
  projects: Project[];
  skillCategories: SkillCategory[];
}

export const initialProfileData: ProfileData = {
  name: "Raman",
  title: "Creative Developer & Interaction Designer",
  tagline: "Crafting poetic, immersive, and thoughtful digital experiences where art meets engineering.",
  welcomeSub: "Welcome to my world!",
  location: "Global / Remote",
  availability: "Available for select freelance & full-time roles in 2026",
  email: "raman.creates@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  bio: [
    "My journey began with a curiosity for how code could breathe life into static design. I fell in love with creative coding, 3D WebGL graphics, and physics-driven micro-interactions.",
    "Over the years, I have architected high-performance web applications, interactive 3D virtual spaces, and design systems for forward-thinking startups and studios.",
    "When I'm not tweaking GLSL shaders or refining UI animations, you'll find me brewing pour-over coffee, playing jazz piano, exploring analog photography, or hiking in search of new vistas."
  ],
  stations: [
    {
      id: "genesis",
      step: 1,
      title: "Genesis Island",
      subtitle: "WHERE IT ALL BEGAN",
      locationTag: "01 • THE STARTING SHORE",
      accentColor: "#757BFD",
      description: "Welcome to my interactive world! I'm Raman, a Creative Developer and Interaction Designer enthusiastic about building delightful, playful digital journeys.",
      ctaText: "Discover My Story",
      ctaAction: "openAbout",
      funFact: "Tip: Drag left or right, use your scroll wheel, or press ← → to travel across the island!"
    },
    {
      id: "workshop",
      step: 2,
      title: "The Workshop",
      subtitle: "CRAFT, CODE & SHADERS",
      locationTag: "02 • THE LAB & FORGE",
      accentColor: "#23008E",
      description: "A blend of engineering rigor and design intuition. I build with modern web standards, WebGL/Three.js, TypeScript, React, and motion systems designed to run smoothly at 60fps.",
      ctaText: "Inspect Full Stack",
      ctaAction: "openSkills",
      funFact: "Focusing on sub-second load times and fluid micro-interactions."
    },
    {
      id: "gallery",
      step: 3,
      title: "Project Pavilion",
      subtitle: "SELECTED WORKS 2024–2026",
      locationTag: "03 • THE EXHIBIT",
      accentColor: "#FF6464",
      description: "A curated collection of production applications, experimental spatial interfaces, and creative coding systems built for clients and passion projects.",
      ctaText: "Browse Case Studies",
      ctaAction: "openProjects",
      funFact: "Featuring generative canvases, 3D data visualization, and AI interfaces."
    },
    {
      id: "observatory",
      step: 4,
      title: "The Observatory",
      subtitle: "INTERACTION PLAYGROUND",
      locationTag: "04 • THE SKY LAB",
      accentColor: "#3ddc97",
      description: "Experimentation is the heart of discovery. Here you can trigger physics gravity simulations, observe procedural star clusters, and listen to the procedural soundscape.",
      ctaText: "Activate Gravity",
      ctaAction: "openPlayground",
      funFact: "Drop low-poly physics boulders and shapes right onto the archipelago!"
    },
    {
      id: "campsite",
      step: 5,
      title: "The Campfire",
      subtitle: "PHILOSOPHY & LIFE BEYOND CODE",
      locationTag: "05 • THE MOUNTAIN RETREAT",
      accentColor: "#ffb703",
      description: "Great digital craftsmanship stems from living deeply in the physical world. A glimpse into my principles, reading list, favorite tools, and creative routine.",
      ctaText: "Read About Raman",
      ctaAction: "openAbout",
      funFact: "Favorite quote: 'Simplicity is about subtracting the obvious and adding the meaningful.'"
    },
    {
      id: "lighthouse",
      step: 6,
      title: "The Beacon",
      subtitle: "LET'S BUILD SOMETHING BEAUTIFUL",
      locationTag: "06 • WORLD'S END",
      accentColor: "#757BFD",
      description: "You've reached the edge of Raman's World! Whether you have an ambitious new product, an interactive 3D vision, or just want to say hi, my inbox is always open.",
      ctaText: "Get in Touch",
      ctaAction: "openContact",
      funFact: "Click to copy email with celebration confetti!"
    }
  ],
  projects: [
    {
      id: "aetheria",
      title: "Aetheria Audio-Visualizer",
      tagline: "Real-time 3D spatial audio environment with generative GLSL shaders",
      category: "Creative Dev / Three.js / WebGL",
      year: "2025",
      description: "A browser-based interactive audio experience that analyzes microphone and audio stem frequencies in real time, translating harmonic signatures into dynamic 3D low-poly terrain deformations and bloom lighting.",
      highlights: [
        "Procedural terrain deformation shader using Simplex Noise running at 60 FPS",
        "Web Audio API FFT analysis mapped to custom Three.js post-processing passes",
        "Spatial 3D audio listener simulation with directional falloff"
      ],
      technologies: ["Three.js", "GLSL Shaders", "Web Audio API", "TypeScript", "Vite"],
      gradient: "from-purple-600 via-indigo-600 to-blue-500",
      demoUrl: "https://example.com/demo-aetheria",
      githubUrl: "https://github.com/raman/aetheria",
      stats: [
        { label: "Frame Rate", value: "60 FPS solid" },
        { label: "Bundle Size", value: "< 180 KB" },
        { label: "Audio Stems", value: "8 Channels" }
      ]
    },
    {
      id: "novaflow",
      title: "NovaFlow AI Workspace",
      tagline: "Infinite node-based canvas for orchestrating multi-agent AI systems",
      category: "Full-Stack Product / SaaS",
      year: "2025",
      description: "A modern visual workflow canvas empowering engineers and creators to connect LLM nodes, vector search databases, and automated tools with zero latency and real-time multiplayer cursor collaboration.",
      highlights: [
        "Virtual canvas engine rendering 10,000+ nodes with high-performance WebGL & SVG",
        "Real-time WebSocket multiplayer presence and optimistic state reconciliation",
        "Custom drag-and-drop spline connectors with dynamic bezier routing"
      ],
      technologies: ["React 19", "TypeScript", "Tailwind CSS", "Zustand", "Node.js", "WebSockets"],
      gradient: "from-blue-600 via-cyan-500 to-teal-400",
      demoUrl: "https://example.com/demo-novaflow",
      githubUrl: "https://github.com/raman/novaflow",
      stats: [
        { label: "Active Users", value: "25,000+" },
        { label: "Latency", value: "< 15ms" },
        { label: "Satisfaction", value: "98%" }
      ]
    },
    {
      id: "kinetica",
      title: "Kinetica Design System",
      tagline: "Physics-inspired animation and accessible component system",
      category: "Interaction Design / Open Source",
      year: "2024",
      description: "An open-source UI component library centered on natural spring physics, haptic feedback, and delightful tactile micro-interactions built with accessible headless primitives.",
      highlights: [
        "Spring physics solvers with configurable damping, stiffness, and mass",
        "WCAG 2.1 AAA contrast and comprehensive keyboard accessibility",
        "Used by over 40+ production engineering teams worldwide"
      ],
      technologies: ["React", "TypeScript", "Framer Motion", "Tailwind CSS", "Radix UI"],
      gradient: "from-rose-500 via-orange-500 to-amber-400",
      demoUrl: "https://example.com/demo-kinetica",
      githubUrl: "https://github.com/raman/kinetica",
      stats: [
        { label: "GitHub Stars", value: "3.2k ★" },
        { label: "Weekly Downloads", value: "48k" },
        { label: "Test Coverage", value: "99.4%" }
      ]
    },
    {
      id: "lumina",
      title: "Lumina Architectural Tour",
      tagline: "Interactive Scandinavian architectural walkthrough with day/night cycles",
      category: "3D Web / Architectural Viz",
      year: "2024",
      description: "An interactive digital showroom and architectural walk-through created for a sustainable modern architecture studio in Oslo, featuring interactive daylight simulations and material customization.",
      highlights: [
        "Baked lightmaps blended with dynamic Three.js directional sun shadows",
        "Interactive floorplan navigation with synchronized orthographic camera transitions",
        "Custom PBR materials for Nordic wood, honed concrete, and frosted glass"
      ],
      technologies: ["Three.js", "Blender Pipeline", "GLTF/Draco", "Vanilla JS", "CSS Grid"],
      gradient: "from-emerald-500 via-teal-600 to-indigo-700",
      demoUrl: "https://example.com/demo-lumina",
      githubUrl: "https://github.com/raman/lumina",
      stats: [
        { label: "Asset Compression", value: "85% reduction" },
        { label: "Initial Load", value: "1.2s" },
        { label: "Awards", value: "Awwwards Nominee" }
      ]
    }
  ],
  skillCategories: [
    {
      category: "Frontend & Creative Code",
      iconName: "Code",
      skills: [
        { name: "Three.js & WebGL", level: 95, note: "Custom shaders, scene optimization, low-poly & PBR" },
        { name: "TypeScript & JavaScript", level: 98, note: "Modern ESNext, type safety, functional architecture" },
        { name: "React 19 & Next.js", level: 96, note: "Server components, state management, suspense" },
        { name: "GLSL & Shaders", level: 88, note: "Fragment & vertex manipulation, post-processing" },
        { name: "Tailwind CSS & Animation", level: 96, note: "CSS variables, spring physics, buttery transitions" }
      ]
    },
    {
      category: "Backend & Systems",
      iconName: "Server",
      skills: [
        { name: "Node.js & Express / Fastify", level: 90, note: "High throughput APIs, streaming, microservices" },
        { name: "Python & FastAPI", level: 86, note: "AI pipelines, data processing, automation" },
        { name: "PostgreSQL & Redis", level: 88, note: "Relational modeling, caching, pub/sub" },
        { name: "WebSockets & Real-time", level: 92, note: "Low-latency multiplayer, delta synchronization" }
      ]
    },
    {
      category: "Interaction & Design",
      iconName: "Palette",
      skills: [
        { name: "Figma & UI/UX Systems", level: 92, note: "Design tokens, atomic components, prototyping" },
        { name: "Motion & Micro-interactions", level: 94, note: "Choreographed gestures, tactile responsiveness" },
        { name: "Blender 3D Modeling", level: 85, note: "Low-poly modeling, UV unwrapping, light baking" },
        { name: "Web Accessibility (A11y)", level: 90, note: "Semantic HTML, ARIA standards, screen readers" }
      ]
    }
  ]
};

const STORAGE_KEY = "ramans_world_profile_data_v1";

export function getSavedProfileData(): ProfileData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not read saved profile data from localStorage", e);
  }
  return initialProfileData;
}

export function saveProfileData(data: ProfileData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save profile data to localStorage", e);
  }
}
