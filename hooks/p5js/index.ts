/**
 * p5.js Module
 * 
 * Complete p5.js rendering module built on core hooks
 * Consistent API with Three.js module
 */

// Main module hook
export { useP5Canvas } from './useP5Canvas';

export { useP5Mouse } from './useP5Mouse';
export type {
  P5MouseConfig,
  P5MouseCallbacks,
  P5MouseState,
  P5MouseRef,
} from './useP5Mouse';

export { useP5Noise } from './useP5Noise';
export type { P5NoiseConfig, P5NoiseRef, NoiseField } from './useP5Noise';

export { useP5Particles } from './useP5Particles';
export type { P5Particle } from './useP5Particles';
