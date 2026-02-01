/**
 * Core hooks and utilities for canvas experiments
 * 
 * These hooks provide the foundation that all rendering modules build upon.
 */

export { useCanvas } from './useCanvas';
export type { CanvasConfig, CanvasRefs } from './useCanvas';

export { useAnimation } from './useAnimation';
export type { FrameCallback, AnimationConfig, AnimationControls } from './useAnimation';

export { useResize } from './useResize';
export type { ResizeCallback, ResizeConfig } from './useResize';

export * from './types';