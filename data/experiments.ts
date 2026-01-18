import { Experiment } from "@/types/experiment";

export const experiments: Experiment[] = [
  {
    id: 1,
    slug: 'particle-flow',
    title: 'Particle Flow',
    description: 'Simulazione di particelle magnetiche interattive',
    longDescription: 'Un sistema di particelle 3D che reagisce al mouse, creando flussi magnetici dinamici. Implementato con Three.js e shader personalizzati.',
    category: 'threejs',
    tech: ['Three.js', 'Shader', 'WebGL', 'Framer Motion'],
    color: '#FF6B6B',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10',
    icon: '🌀',
    status: 'live',
    demoUrl: '/demos/particle-flow',
    githubUrl: 'https://github.com/...',
    features: [
      'Particles magnetiche interattive',
      'Shader personalizzati',
      'Performance ottimizzata',
      'Controlli real-time'
    ]
  },
  {
    id: 2,
    slug: 'neon-grid',
    title: 'Neon Grid',
    description: 'Griglia 3D con effetto neon interattivo',
    longDescription: 'Una griglia di cubi 3D che si illuminano con effetti neon al passaggio del mouse. Include modalità giorno/notte.',
    category: 'animation',
    tech: ['Three.js', 'GSAP', 'React Spring'],
    color: '#4ECDC4',
    icon: '🔷',
    status: 'live',
    features: [
      'Effetto neon real-time',
      'Animazioni fluide',
      'Interattività completa',
      'Theme switcher'
    ],
    createdAt: "",
    updatedAt: ""
  },
  // ... altri experiments
];