export interface Experiment {
  id: number
  slug: string
  title: string
  description: string
  longDescription: string
  category: string
  tech: string[]
  color: string
  icon: string
  status: 'live' | 'wip' | 'planned'
  demoUrl?: string
  githubUrl?: string
  articleUrl?: string
  features: string[]
  createdAt: string
  updatedAt: string
}

export interface StatItem {
  label: string
  value: string | number
  color: string
  inline?: boolean
}

// Settings for Generative Art experiment
export type PatternType = "flow" | "spiral" | "orbit" | "explosion";

export type GenArtSettings = {
  particleCount: number;
  speed: number;
  size: number;
  pattern: PatternType;
};

// Settings for Audio Visualizer experiment
export type WaveForm = "sine" | "square" | "sawtooth" | "triangle";
export type WaveFormName =
  | "Sine"
  | "Square"
  | "Sawtooth"
  | "Triangle";

export type WaveFormOption = {
  id: WaveForm;
  name: WaveFormName;
};

export type VisualizerType = "bars" | "wave" | "circular";

export type VisualizerTypeName =
  | "Bars"
  | "Wave"
  | "Circular";

export type VisualizerOption = {
  id: VisualizerType;
  name: VisualizerTypeName;
};


