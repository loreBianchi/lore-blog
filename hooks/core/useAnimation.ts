import { useEffect, useRef, useCallback } from 'react';

export type FrameCallback = (time: number, delta: number) => void;

export interface AnimationConfig {
  isPlaying: boolean;
  onFrame: FrameCallback;
  fps?: number;
}

export interface AnimationControls {
  start: () => void;
  stop: () => void;
  toggle: () => void;
  getTime: () => number;
}

export function useAnimation(config: AnimationConfig): AnimationControls {
  const animationIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(config.isPlaying);
  const onFrameRef = useRef(config.onFrame);

  // Update onFrame ref when callback changes
  useEffect(() => {
    onFrameRef.current = config.onFrame;
  }, [config.onFrame]);

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
    // Initialize start time only once
    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
      lastFrameTimeRef.current = startTimeRef.current;
    }

    const animate = (currentTime: number) => {
      // Check if should continue
      if (!isPlayingRef.current) {
        animationIdRef.current = null;
        return;
      }

      const elapsedTime = (currentTime - startTimeRef.current) / 1000;
      const delta = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      // Call the latest version of onFrame
      onFrameRef.current(elapsedTime, delta);

      // Schedule next frame
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start only if isPlaying is true
    if (config.isPlaying) {
      // Stop any previous loops
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      // Start new loop
      animationIdRef.current = requestAnimationFrame(animate);
    } else {
      // Stop the loop if isPlaying is false
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    }

    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [config.isPlaying]); // Reacts ONLY to isPlaying

  return {
    start,
    stop,
    toggle,
    getTime,
  };
}