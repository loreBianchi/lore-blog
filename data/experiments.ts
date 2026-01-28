import { Experiment } from "@/types/experiment";

export const experiments: Experiment[] = [
  {
    id: 1,
    slug: "particle-flow",
    title: "Particle Flow",
    description: "Interactive magnetic particle simulation",
    longDescription:
      "A 3D particle system that reacts to mouse movements, creating dynamic magnetic flows. Implemented with Three.js and custom shaders.",
    category: "threejs",
    tech: ["Three.js", "WebGL", "React"],
    color: "#FF6B6B",
    createdAt: "2024-01-15",
    updatedAt: "2024-06-10",
    icon: "🌌",
    status: "live",
    features: [
      "Interactive magnetic particles",
      "Custom shaders",
      "Optimized performance",
      "Real-time controls",
    ],
  },
  {
    id: 2,
    slug: "neon-grid",
    title: "Neon Grid",
    description: "3D grid with interactive neon effect",
    longDescription:
      "A grid of 3D cubes that light up with neon effects on mouse hover. Includes day/night mode.",
    category: "animation",
    tech: ["Three.js", "GSAP", "React Spring"],
    color: "#4ECDC4",
    icon: "🔷",
    status: "live",
    features: [
      "Interactive ripple effects",
      "Pulsing neon animations",
      "Adjustable grid size (5x5 to 20x20)",
      "Three color schemes",
      "Smooth camera controls",
    ],
    createdAt: "2024-02-20",
    updatedAt: "2024-06-15",
  },
  {
    id: 3,
    slug: "ascii-art",
    title: "ASCII Art Generator",
    description: "Real-time ASCII rendering of 3D text with customizable character sets",
    longDescription:
      "Converts 3D graphics into ASCII art using post-processing effects. Features multiple character sets, real-time customization, and interactive controls for creating retro-style visualizations.",
    category: "creative",
    tech: ["Three.js", "WebGL", "FontLoader"],
    color: "#00ff88",
    icon: "💻",
    status: "live",
    features: [
      "Real-time 3D text generation",
      "5 character set presets",
      "Custom text input (up to 10 chars)",
      "Color inversion effects",
      "Auto-rotation with speed control",
    ],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-10",
  },
  {
    id: 4,
    slug: "audio-visualizer",
    title: "Audio Visualizer",
    description: "Real-time audio synthesis with dynamic visualizations",
    longDescription:
      "Generate tones with Web Audio API and visualize them in real-time. Features multiple waveforms (sine, square, sawtooth, triangle) and three visualization modes: bars, wave, and circular.",
    category: "audio",
    tech: ["Web Audio API", "Canvas API", "React"],
    color: "#FF00FF",
    icon: "🎧",
    status: "live",
    features: [
      "Real-time audio synthesis",
      "4 waveform types",
      "3 visualization modes",
      "Frequency control (100-1000Hz)",
      "Volume and speed adjustments",
    ],
    createdAt: "2024-03-20",
    updatedAt: "2024-03-25",
  },
  {
    id: 5,
    slug: "generative-art",
    title: "Generative Art",
    description: "P5.js particle system with multiple pattern modes",
    longDescription:
      "A generative art experiment using P5.js to create mesmerizing particle animations. Features flow fields, spirals, orbits, and explosions with adjustable particle count and speed.",
    category: "creative",
    tech: ["P5.js", "Canvas API", "Perlin Noise"],
    color: "#00FFFF",
    icon: "🎨",
    status: "live",
    features: [
      "4 pattern modes (Flow, Spiral, Orbit, Explosion)",
      "Noise-based flow fields",
      "50-300 particles",
      "Real-time parameter adjustment",
      "Click to regenerate",
    ],
    createdAt: "2024-04-05",
    updatedAt: "2024-04-10",
  },
  {
    id: 6,
    slug: "retro-runner",
    title: "Retro Runner",
    description: "Chrome Dino-style endless runner game",
    longDescription:
      "An addictive endless runner game inspired by Chrome's offline dinosaur game. Jump over obstacles, beat your high score, and enjoy the retro neon aesthetic. Features increasing difficulty and smooth gameplay.",
    category: "game",
    tech: ["Canvas API", "React", "Game Logic"],
    color: "#FF0088",
    icon: "🎮",
    status: "live",
    features: [
      "Endless runner gameplay",
      "Collision detection",
      "High score tracking",
      "Increasing difficulty",
      "Keyboard and mouse controls",
    ],
    createdAt: "2024-04-15",
    updatedAt: "2024-04-20",
  },
];

// Export helper functions
export const getExperimentBySlug = (slug: string) => {
  return experiments.find((exp) => exp.slug === slug);
};

export const getExperimentsByCategory = (category: string) => {
  return experiments.filter((exp) => exp.category === category);
};

export const getExperimentsByTech = (tech: string) => {
  return experiments.filter((exp) => exp.tech.includes(tech));
};

// Categories for filtering
export const categories = [
  { id: "all", name: "All", icon: "🌟" },
  { id: "threejs", name: "Three.js", icon: "🔷" },
  { id: "creative", name: "Creative", icon: "🎨" },
  { id: "audio", name: "Audio", icon: "🎵" },
  { id: "game", name: "Games", icon: "🎮" },
];

// Color options used across experiments
export const colorOptions = [
  { id: "cyan", name: "Cyan", color: "#00B4D8" },
  { id: "purple", name: "Purple", color: "#9D4EDD" },
  { id: "pink", name: "Pink", color: "#FF006E" },
  { id: "green", name: "Green", color: "#00FF88" },
  { id: "blue", name: "Blue", color: "#4CC9F0" },
];

// Galaxy types for Particle Galaxy
export const galaxyTypes = [
  { id: "spiral", name: "Spiral" },
  { id: "elliptical", name: "Elliptical" },
  { id: "irregular", name: "Irregular" },
];

// Instructions used across experiments
export const instructions = [
  { icon: "🎯", text: "Drag to rotate camera", color: "#00B4D8" },
  { icon: "🔍", text: "Scroll to zoom", color: "#9D4EDD" },
  { icon: "⚡", text: "Adjust controls below", color: "#06D6A0" },
];
