import { useRef, useEffect } from 'react';

/**
 * Base configuration for any canvas
 */
export interface CanvasConfig {
  /** Canvas width (css value or number in px) */
  width?: string | number;
  /** Canvas height (css value or number in px) */
  height?: string | number;
  /** Pixel ratio for high DPI displays */
  pixelRatio?: number;
  /** CSS class for container */
  className?: string;
  /** Enable pointer events */
  pointerEvents?: boolean;
}

/**
 * Return type for useCanvas hook
 */
export interface CanvasRefs {
  /** Reference to the container element */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Reference to the canvas element (if created by hook) */
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const DEFAULT_CONFIG: Required<Omit<CanvasConfig, 'className'>> = {
  width: '100%',
  height: '100%',
  pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
  pointerEvents: true,
};

/**
 * Core hook for setting up a canvas container
 * 
 * This is the base hook that all rendering modules build upon.
 * It provides:
 * - A container ref for mounting renderers
 * - Optional canvas element creation
 * - Basic styling and configuration
 * 
 * @example
 * ```tsx
 * const { containerRef, canvasRef } = useCanvas({
 *   width: '100%',
 *   height: '100vh',
 *   pixelRatio: 2,
 * });
 * 
 * return <div ref={containerRef} />;
 * ```
 */
export function useCanvas(config: CanvasConfig = {}): CanvasRefs {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const container = containerRef.current;

    // Apply container styles
    container.style.width = typeof mergedConfig.width === 'number' 
      ? `${mergedConfig.width}px` 
      : mergedConfig.width;
    
    container.style.height = typeof mergedConfig.height === 'number'
      ? `${mergedConfig.height}px`
      : mergedConfig.height;

    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    if (config.className) {
      container.className = config.className;
    }

    // Pointer events
    if (!mergedConfig.pointerEvents) {
      container.style.pointerEvents = 'none';
    }

  }, [config.width, config.height, config.className, config.pointerEvents]);

  return {
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
  };
}