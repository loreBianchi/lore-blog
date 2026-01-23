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
    tech: ["Three.js", "Shader", "WebGL", "Framer Motion"],
    color: "#FF6B6B",
    createdAt: "2024-01-15",
    updatedAt: "2024-06-10",
    icon: "🌀",
    status: "live",
    demoUrl: "/demos/particle-flow",
    githubUrl: "https://github.com/...",
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
      "Real-time neon effect",
      "Smooth animations",
      "Full interactivity",
      "Theme switcher",
    ],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 3,
    slug: "ascii-art",
    title: "ASCII Art Generator",
    description: "Real-time ASCII rendering of 3D text with customizable character sets",
    longDescription:
      "Converts 3D graphics into ASCII art using post-processing effects. Features multiple character sets, real-time customization, and interactive controls for creating retro-style visualizations.",
    category: "creative",
    tech: ["Three.js", "@react-three/drei", "WebGL", "Post-processing"],
    color: "#00ff88",
    icon: "💻",
    status: "live",
    demoUrl: "/experiments/ascii-art",
    githubUrl:
      "https://github.com/yourusername/experiments/tree/main/components/experiments/ASCIIArtExperiment.tsx",
    features: [
      "Real-time ASCII conversion",
      "Multiple character sets",
      "Customizable 3D text",
      "Color inversion effects",
      "Performance optimized",
    ],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-10",
  },
];

export const colorOptions = [
  { id: "cyan", name: "Cyan", color: "#00B4D8" },
  { id: "purple", name: "Purple", color: "#9D4EDD" },
  { id: "pink", name: "Pink", color: "#FF006E" },
];

export const galaxyTypes = [
  { id: "spiral", name: "Spiral" },
  { id: "elliptical", name: "Elliptical" },
  { id: "irregular", name: "Irregular" },
];

export const instructions = [
  { icon: "🎯", text: "Drag to rotate camera", color: "#00B4D8" },
  { icon: "🔍", text: "Scroll to zoom", color: "#9D4EDD" },
  { icon: "⚡", text: "Adjust controls below", color: "#06D6A0" },
];
