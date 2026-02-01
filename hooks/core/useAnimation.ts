import { useEffect, useRef, useCallback } from 'react';

/**
 * Frame callback function type
 * @param time - Elapsed time in seconds since animation start
 * @param delta - Delta time in seconds since last frame
 */
export type FrameCallback = (time: number, delta: number) => void;

/**
 * Configuration for animation loop
 */
export interface AnimationConfig {
  /** Whether the animation is playing */
  isPlaying: boolean;
  /** Callback function called on each frame */
  onFrame: FrameCallback;
  /** Target FPS (optional, defaults to requestAnimationFrame) */
  fps?: number;
}

/**
 * Return type for useAnimation hook
 */
export interface AnimationControls {
  /** Start the animation */
  start: () => void;
  /** Stop the animation */
  stop: () => void;
  /** Toggle play/pause */
  toggle: () => void;
  /** Get current elapsed time */
  getTime: () => number;
}

/**
 * Core hook for animation loop
 * 
 * Provides a flexible animation loop that works with any rendering technology.
 * Handles play/pause, timing, and cleanup automatically.
 * 
 * @example
 * ```tsx
 * const controls = useAnimation({
 *   isPlaying: true,
 *   onFrame: (time, delta) => {
 *     // Update your scene
 *     updateObjects(time, delta);
 *   },
 * });
 * ```
 */
export function useAnimation(config: AnimationConfig): AnimationControls {
  const animationIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(config.isPlaying);

  // Update playing state ref when prop changes
  useEffect(() => {
    isPlayingRef.current = config.isPlaying;
  }, [config.isPlaying]);

  const start = useCallback(() => {
    isPlayingRef.current = true;
  }, []);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    isPlayingRef.current = !isPlayingRef.current;
    if (!isPlayingRef.current && animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  const getTime = useCallback(() => {
    return (performance.now() - startTimeRef.current) / 1000;
  }, []);

  useEffect(() => {
    // Initialize start time
    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
      lastFrameTimeRef.current = startTimeRef.current;
    }

    if (!config.isPlaying) {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (!isPlayingRef.current) return;

      // Calculate time and delta
      const elapsedTime = (currentTime - startTimeRef.current) / 1000;
      const delta = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      // Call user's frame callback
      config.onFrame(elapsedTime, delta);

      // Schedule next frame
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [config.isPlaying, config.onFrame]);

  return {
    start,
    stop,
    toggle,
    getTime,
  };
}
