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
  fullName: string;
  title: string;
  tagline: string;
  welcomeSub: string;
  location: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  education: {
    degree: string;
    institution: string;
    period: string;
    score: string;
    details: string;
  }[];
  achievements: {
    title: string;
    organization: string;
    year: string;
    description: string;
  }[];
  experience: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }[];
  bio: string[];
  stations: Station[];
  projects: Project[];
  skillCategories: SkillCategory[];
}

export const initialProfileData: ProfileData = {
  name: "Raman",
  fullName: "Raman Kumar",
  title: "Full Stack Developer, Cloud Engineer & Data Analyst",
  tagline: "Building scalable cloud-native architectures, AI/ML intelligence systems, and high-performance digital experiences.",
  welcomeSub: "Welcome to my world!",
  location: "Bhubaneswar / Deoghar, India",
  availability: "B.Tech CSE '26 @ KIIT • Open to Full-Stack, Cloud & Data roles",
  email: "ramankumar7c@gmail.com",
  github: "https://github.com/ramankumar7c",
  linkedin: "https://www.linkedin.com/in/ramankumar7c",
  twitter: "https://x.com/ramankumar7c",
  website: "https://www.ramankumar.cloud",
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
      period: "2022 – 2026",
      score: "CGPA: 8.54 / 10",
      details: "Specialized in Data Structures & Algorithms (Java), Machine Learning, Cloud Architecture, and Software Engineering."
    },
    {
      degree: "AISSCE (Class XII - Science)",
      institution: "Jawahar Vidya Mandir, Shyamali, Ranchi",
      period: "2020 – 2022",
      score: "First Division with Distinction",
      details: "Core subjects in Physics, Chemistry, Mathematics, and Computer Science."
    },
    {
      degree: "AISSE (Class X)",
      institution: "GD DAV Public School, Deoghar",
      period: "2018 – 2020",
      score: "Top percentile",
      details: "Strong foundational academics and competitive mathematics."
    }
  ],
  achievements: [
    {
      title: "GATE 2025 Qualified",
      organization: "IIT / National Examination",
      year: "2025",
      description: "Secured All India Rank (AIR) 6450 in Computer Science and Information Technology."
    },
    {
      title: "Reliance Foundation Scholar",
      organization: "Reliance Foundation",
      year: "2022 – 2026",
      description: "Prestigious national scholarship awarded for academic excellence and innovation leadership."
    },
    {
      title: "Published Research Paper (Springer Nature)",
      organization: "Springer Nature • Computational Intelligence",
      year: "2026",
      description: "Authored 'Identifying Anomalies: A Data Mining Approach to Fraud Detection' with novel anomaly detection techniques."
    },
    {
      title: "Smart India Hackathon (SIH 2024)",
      organization: "Ministry of Education & AICTE",
      year: "2024",
      description: "Ranked among top 45 teams out of 300+ in internal institutional hackathons."
    }
  ],
  experience: [
    {
      role: "Cloud Team Lead",
      company: "GeeksforGeeks - KIIT Chapter",
      period: "Jul 2024 – Aug 2025",
      highlights: [
        "Led a multidisciplinary engineering team of 15 members to architect and optimize cloud infrastructure, achieving a 20% boost in operational efficiency.",
        "Delivered hands-on workshops on AWS/GCP resource management and CI/CD pipelines, elevating team proficiency by 40%.",
        "Instituted structured pull request and code review guidelines, increasing codebase maintainability and test coverage by 30%."
      ]
    },
    {
      role: "AI/ML Virtual Intern",
      company: "AICTE Eduskills & Google for Developers",
      period: "Oct 2025 – Dec 2025",
      highlights: [
        "Constructed deep learning and computer vision pipelines using TensorFlow, Keras, and Python.",
        "Implemented real-world data preprocessing, model evaluation, and inference optimization on Google AI infrastructure."
      ]
    },
    {
      role: "Cloud Computing Intern",
      company: "AICTE Eduskills & AWS Cloud",
      period: "Oct 2024 – Dec 2024",
      highlights: [
        "Deployed serverless microservices, EC2 clusters, S3 storage buckets, and VPC security groups on AWS.",
        "Implemented automated cloud monitoring and cost-optimization strategies."
      ]
    },
    {
      role: "Generative AI Intern",
      company: "AICTE Eduskills & Google Cloud Platform",
      period: "Jul 2024 – Sep 2024",
      highlights: [
        "Explored generative LLMs, prompt engineering, and Vertex AI model fine-tuning for conversational applications."
      ]
    }
  ],
  bio: [
    "I am Raman Kumar — a Full Stack Engineer, Cloud Architect, and Data Analyst currently pursuing B.Tech in Computer Science at KIIT University (Graduating 2026).",
    "As Cloud Team Lead at GeeksforGeeks-KIIT, I directed a team of 15 engineers in managing cloud infrastructure. My technical journey spans full-stack development (Next.js, React, Node.js), machine learning (PyTorch, TensorFlow, Scikit-Learn), and published research in fraud detection with Springer Nature.",
    "Driven by the philosophy 'Work for a cause, not for applause', I bridge deep algorithmic problem-solving (GATE AIR 6450, LeetCode, Java DSA) with tactile, modern UI experiences and cloud-native reliability."
  ],
  stations: [
    {
      id: "genesis",
      step: 1,
      title: "Genesis Island",
      subtitle: "RAMAN KUMAR • FULL STACK & CLOUD",
      locationTag: "01 • THE STARTING SHORE",
      accentColor: "#757BFD",
      description: "Welcome to Raman Kumar's World! Final Year CSE student @ KIIT (GPA 8.54), Reliance Foundation Scholar, and GATE '25 qualifier passionate about full-stack engineering, cloud systems, and data analytics.",
      ctaText: "Explore My Journey",
      ctaAction: "openAbout",
      funFact: "Drag left/right, scroll, or press ← → to travel across the island!"
    },
    {
      id: "workshop",
      step: 2,
      title: "The Workshop",
      subtitle: "FULL STACK, CLOUD & DATA STACK",
      locationTag: "02 • THE LAB & FORGE",
      accentColor: "#23008E",
      description: "A battle-tested tech arsenal: Next.js, React 19, TypeScript, Java (DSA), AWS, Docker, Kubernetes, Python (ML/Pandas/FastAPI), and SQL databases engineered for scale.",
      ctaText: "Inspect Full Stack",
      ctaAction: "openSkills",
      funFact: "Led cloud infrastructure for 15 engineers @ GFG-KIIT Chapter."
    },
    {
      id: "gallery",
      step: 3,
      title: "Project Pavilion",
      subtitle: "AI SYSTEMS, FULL-STACK & ML RESEARCH",
      locationTag: "03 • THE EXHIBIT",
      accentColor: "#FF6464",
      description: "Showcasing production apps, RAG AI platforms, published Springer Nature fraud detection research, and deep learning predictive models.",
      ctaText: "Browse Case Studies",
      ctaAction: "openProjects",
      funFact: "Published research with Springer Nature on Data Mining & Anomaly Detection."
    },
    {
      id: "observatory",
      step: 4,
      title: "The Observatory",
      subtitle: "CLOUD LAB & INTERACTION PLAYGROUND",
      locationTag: "04 • THE SKY LAB",
      accentColor: "#3ddc97",
      description: "Where data and creative engineering meet. Test cloud simulations, play with the planetary gyroscope, or drop physics-simulated boulders across the terrain!",
      ctaText: "Activate Gravity",
      ctaAction: "openPlayground",
      funFact: "3x AICTE Eduskills Internships (AWS, Google Cloud, TensorFlow)."
    },
    {
      id: "campsite",
      step: 5,
      title: "The Campfire",
      subtitle: "LEADERSHIP, EDUCATION & ACHIEVEMENTS",
      locationTag: "05 • THE MOUNTAIN RETREAT",
      accentColor: "#ffb703",
      description: "AIR 6450 in GATE 2025, Reliance Foundation Undergraduate Scholar, SIH 2024 Top 45. Living by the motto: 'Work for a cause, not for applause. Live life to express, not to impress.'",
      ctaText: "Read About Raman",
      ctaAction: "openAbout",
      funFact: "Active problem solver across LeetCode, GFG, Codeforces & HackerRank."
    },
    {
      id: "lighthouse",
      step: 6,
      title: "The Beacon",
      subtitle: "CONNECT WITH RAMAN KUMAR",
      locationTag: "06 • WORLD'S END",
      accentColor: "#757BFD",
      description: "You've reached the edge of Raman's World! Ready to discuss full-stack engineering, cloud architecture, or data analyst opportunities.",
      ctaText: "Get in Touch",
      ctaAction: "openContact",
      funFact: "Click to copy ramankumar7c@gmail.com with celebration confetti!"
    }
  ],
  projects: [
    {
      id: "multi-subject-ai-chatbot",
      title: "Multi-Subject AI Chatbot Platform",
      tagline: "Full-stack RAG conversational platform using Next.js, FastAPI & ChromaDB",
      category: "Full-Stack AI / Generative AI / RAG",
      year: "2025",
      description: "An enterprise-grade document intelligence platform enabling domain-specific querying across technical and academic texts. Built with Next.js frontend, FastAPI backend, ChromaDB vector database, and LangChain Retrieval-Augmented Generation (RAG) with real-time response streaming.",
      highlights: [
        "Integrated ChromaDB vector search with cosine similarity retrieval for high-accuracy context recall",
        "Implemented streaming responses via Server-Sent Events (SSE) with sub-second time-to-first-token",
        "Built dynamic multi-document ingestion supporting PDF, Markdown, and TXT parsing with semantic chunking"
      ],
      technologies: ["Next.js", "TypeScript", "FastAPI", "Python", "ChromaDB", "LangChain", "Tailwind CSS"],
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      demoUrl: "https://www.ramankumar.cloud",
      githubUrl: "https://github.com/ramankumar7c",
      stats: [
        { label: "Query Latency", value: "< 250ms" },
        { label: "Embedding Recall", value: "96.4%" },
        { label: "Document Formats", value: "PDF/TXT/MD" }
      ]
    },
    {
      id: "fraud-detection-research",
      title: "Credit Card Fraud & Anomaly Detection",
      tagline: "Published research in Springer Nature • Machine Learning & Data Mining",
      category: "Research / Data Science / Machine Learning",
      year: "2026",
      description: "A machine learning research project published with Springer Nature ('Identifying Anomalies: A Data Mining Approach to Fraud Detection'). Engineered hybrid classification models combining Random Forest, Particle Swarm Optimization (PSO), and PCA dimensionality reduction to identify anomalous financial transactions.",
      highlights: [
        "Published in Springer Nature computational intelligence proceedings (co-authored with Rituraj Singh)",
        "Tackled extreme class imbalance using SMOTE oversampling and hyperparameter tuning with PSO",
        "Built production inference REST API with Flask and real-time dashboard analytics"
      ],
      technologies: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Flask", "SMOTE", "Matplotlib"],
      gradient: "from-rose-600 via-pink-600 to-amber-500",
      demoUrl: "https://www.ramankumar.cloud",
      githubUrl: "https://github.com/ramankumar7c",
      stats: [
        { label: "Publication", value: "Springer '26" },
        { label: "AUC-ROC Score", value: "0.982" },
        { label: "False Positives", value: "-34% drop" }
      ]
    },
    {
      id: "hybrid-pca-gnn-transformer",
      title: "Hybrid PCA-GNN-Transformer Predictor",
      tagline: "Graph Neural Networks & Multi-Head Attention for vehicle insurance campaign analytics",
      category: "Deep Learning / Graph Neural Networks",
      year: "2024",
      description: "An advanced hybrid deep learning framework combining Principal Component Analysis (PCA) and Linear Discriminant Analysis (LDA) with PyTorch Geometric Graph Neural Networks (GNN) and multi-head attention Transformer layers to predict customer response to marketing campaigns.",
      highlights: [
        "Modeled tabular customer interactions as a heterogeneous graph with PyTorch Geometric",
        "Coupled Graph Convolutional Networks (GCN) with self-attention transformer heads to capture non-linear relationships",
        "Outperformed traditional gradient boosted trees by 12.8% F1-score on benchmark insurance conversion datasets"
      ],
      technologies: ["PyTorch", "PyTorch Geometric", "Python", "Transformers", "PCA / LDA", "CUDA"],
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      demoUrl: "https://www.ramankumar.cloud",
      githubUrl: "https://github.com/ramankumar7c",
      stats: [
        { label: "F1-Score Gain", value: "+12.8%" },
        { label: "Graph Nodes", value: "150,000+" },
        { label: "Framework", value: "PyTorch GNN" }
      ]
    },
    {
      id: "google-forms-ai-helper",
      title: "Google & MS Forms AI Answer Helper",
      tagline: "Chrome extension using Gemini AI for context-aware questionnaire autocompletion",
      category: "Browser Extension / Generative AI",
      year: "2024",
      description: "A lightweight Chrome extension that integrates Google Gemini AI to analyze web form questions (multiple choice, long text, scale ratings) in real time and generate contextually intelligent, structured answers with one-click autofill.",
      highlights: [
        "DOM tree parser identifying question types, required fields, and validation constraints",
        "Contextual prompting pipeline with Gemini 1.5 Flash for rapid low-latency response generation",
        "Privacy-centric architecture keeping API keys encrypted in local browser storage"
      ],
      technologies: ["JavaScript", "Chrome Extensions Manifest V3", "Gemini AI API", "HTML5", "CSS3"],
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      demoUrl: "https://www.ramankumar.cloud",
      githubUrl: "https://github.com/ramankumar7c",
      stats: [
        { label: "Response Speed", value: "< 400ms" },
        { label: "Supported Formats", value: "Google & MS" },
        { label: "Manifest", value: "V3 Compliant" }
      ]
    }
  ],
  skillCategories: [
    {
      category: "Full Stack & Web Technologies",
      iconName: "Code",
      skills: [
        { name: "Next.js & React 19", level: 94, note: "App router, SSR/SSG, server actions, state management" },
        { name: "TypeScript & JavaScript", level: 96, note: "Type safety, async concurrency, modern ESNext patterns" },
        { name: "Java & Data Structures", level: 92, note: "Strong DSA, object-oriented design, competitive coding" },
        { name: "Tailwind CSS & Three.js", level: 90, note: "Responsive glassmorphism UI, 3D WebGL visualizers" },
        { name: "HTML5, CSS3 & REST APIs", level: 95, note: "Semantic structure, responsive design, API architecture" }
      ]
    },
    {
      category: "Cloud Architecture & DevOps",
      iconName: "Server",
      skills: [
        { name: "AWS Cloud (EC2, S3, VPC)", level: 90, note: "Cloud Team Lead @ GFG-KIIT; serverless, IAM, networking" },
        { name: "Google Cloud Platform (GCP)", level: 86, note: "Generative AI intern; Vertex AI, Cloud Run, Cloud Storage" },
        { name: "Docker & Containerization", level: 88, note: "Multi-stage builds, container orchestration, microservices" },
        { name: "CI/CD & Git Workflows", level: 92, note: "Automated pipelines, GitHub Actions, strict PR reviews" },
        { name: "Linux & Bash Scripting", level: 89, note: "Server administration, environment management, system scripting" }
      ]
    },
    {
      category: "Data Analytics, AI/ML & Databases",
      iconName: "Palette",
      skills: [
        { name: "Python, NumPy & Pandas", level: 95, note: "Data manipulation, exploratory analysis, statistical modeling" },
        { name: "PyTorch & TensorFlow", level: 88, note: "Deep learning, Graph Neural Networks, CNNs, model training" },
        { name: "PostgreSQL, MySQL & MongoDB", level: 91, note: "Relational schema design, indexing, NoSQL collections" },
        { name: "Vector DBs & LangChain", level: 87, note: "ChromaDB, semantic embeddings, Retrieval-Augmented Generation" },
        { name: "Scikit-Learn & Data Mining", level: 93, note: "Springer Nature published research, anomaly & fraud detection" }
      ]
    }
  ]
};

const STORAGE_KEY = "ramans_world_profile_data_v2";

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
