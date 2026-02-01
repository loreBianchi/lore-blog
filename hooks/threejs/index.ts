/**
 * Three.js Module
 * 
 * Complete Three.js rendering module built on core hooks
 */

// Main module hook
export { useThreeCanvas } from './useThreeCanvas';
export type {
  ThreeCameraConfig,
  ThreeRendererConfig,
  ThreeSceneConfig,
  ThreeCanvasConfig,
  ThreeCanvasContext,
} from './useThreeCanvas';

// Features
export { useLights } from './useLights';
export type {
  AmbientLightConfig,
  DirectionalLightConfig,
  PointLightConfig,
  SpotLightConfig,
  HemisphereLightConfig,
  LightsConfig,
  LightsRef,
} from './useLights';

export { useOrbitControls } from './useOrbitControls'
export type { 
  OrbitControlsConfig,
  OrbitControlsState
} from './useOrbitControls'

export { useParticles } from './useParticles'
export type { 
  ParticleGenerator,
  ParticlesConfig,
  ParticlesRef,
 } from './useParticles'