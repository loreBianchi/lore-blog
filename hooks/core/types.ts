/**
 * Core types used across all canvas experiments
 */

/**
 * Base configuration that all canvas types share
 */
export interface BaseCanvasConfig {
  /** Canvas width */
  width?: string | number;
  /** Canvas height */
  height?: string | number;
  /** Device pixel ratio */
  pixelRatio?: number;
  /** CSS class name */
  className?: string;
}

/**
 * Common animation state
 */
export interface AnimationState {
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Elapsed time in seconds */
  time: number;
  /** Delta time in seconds */
  delta: number;
  /** Current FPS */
  fps: number;
}

/**
 * Mouse/pointer position
 */
export interface PointerPosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Normalized X (-1 to 1) */
  nx: number;
  /** Normalized Y (-1 to 1) */
  ny: number;
}

/**
 * Keyboard key state
 */
export interface KeyState {
  /** Key code */
  code: string;
  /** Whether key is pressed */
  pressed: boolean;
  /** Timestamp when state changed */
  timestamp: number;
}

/**
 * Generic experiment state
 */
export interface ExperimentState {
  /** Animation state */
  animation: AnimationState;
  /** Mouse/pointer state */
  pointer?: PointerPosition;
  /** Keyboard state */
  keyboard?: Map<string, KeyState>;
}

/**
 * Common controls interface
 */
export interface ExperimentControls {
  /** Play animation */
  play: () => void;
  /** Pause animation */
  pause: () => void;
  /** Toggle play/pause */
  toggle: () => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Dimension information
 */
export interface Dimensions {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Aspect ratio (width / height) */
  aspect: number;
}