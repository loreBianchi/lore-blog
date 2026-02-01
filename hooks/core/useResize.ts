import { useEffect, useCallback, useRef } from 'react';

/**
 * Resize callback function type
 * @param width - New width in pixels
 * @param height - New height in pixels
 */
export type ResizeCallback = (width: number, height: number) => void;

/**
 * Configuration for resize handling
 */
export interface ResizeConfig {
  /** Callback function called when container resizes */
  onResize: ResizeCallback;
  /** Debounce delay in ms (default: 0 - no debounce) */
  debounce?: number;
  /** Listen to window resize (default: true) */
  listenToWindow?: boolean;
  /** Use ResizeObserver for container (default: true) */
  useResizeObserver?: boolean;
}

/**
 * Core hook for handling resize events
 * 
 * Provides a unified way to handle resize for any rendering technology.
 * Supports both window resize and ResizeObserver for container changes.
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * 
 * useResize(containerRef, {
 *   onResize: (width, height) => {
 *     camera.aspect = width / height;
 *     camera.updateProjectionMatrix();
 *     renderer.setSize(width, height);
 *   },
 * });
 * ```
 */
export function useResize(
  containerRef: React.RefObject<HTMLElement>,
  config: ResizeConfig
): void {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;

    // Skip if size hasn't changed
    if (
      lastSizeRef.current.width === clientWidth &&
      lastSizeRef.current.height === clientHeight
    ) {
      return;
    }

    lastSizeRef.current = { width: clientWidth, height: clientHeight };

    // Apply debounce if configured
    if (config.debounce && config.debounce > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        config.onResize(clientWidth, clientHeight);
      }, config.debounce);
    } else {
      config.onResize(clientWidth, clientHeight);
    }
  }, [containerRef, config]);

  useEffect(() => {
    if (!containerRef.current) return;

    const listenToWindow = config.listenToWindow !== false;
    const useObserver = config.useResizeObserver !== false;

    // Initial resize call
    handleResize();

    // Window resize listener
    if (listenToWindow) {
      window.addEventListener('resize', handleResize);
    }

    // ResizeObserver for container
    let resizeObserver: ResizeObserver | null = null;
    if (useObserver && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      // Cleanup
      if (listenToWindow) {
        window.removeEventListener('resize', handleResize);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [containerRef, handleResize, config.listenToWindow, config.useResizeObserver]);
}
