import { useEffect, useRef } from 'react';
import p5 from 'p5';

/**
 * Mouse state information
 */
export interface P5MouseState {
  /** Current X position */
  x: number;
  /** Current Y position */
  y: number;
  /** Previous X position */
  px: number;
  /** Previous Y position */
  py: number;
  /** Normalized X (-1 to 1) */
  nx: number;
  /** Normalized Y (-1 to 1) */
  ny: number;
  /** Is mouse pressed */
  pressed: boolean;
  /** Mouse button (LEFT, RIGHT, CENTER) */
  button: string;
  /** Delta X since last frame */
  deltaX: number;
  /** Delta Y since last frame */
  deltaY: number;
  /** Is mouse dragging */
  dragging: boolean;
}

/**
 * Mouse event callbacks
 */
export interface P5MouseCallbacks {
  /** Called when mouse is moved */
  onMove?: (state: P5MouseState) => void;
  /** Called when mouse is pressed */
  onPress?: (state: P5MouseState) => void;
  /** Called when mouse is released */
  onRelease?: (state: P5MouseState) => void;
  /** Called when mouse is clicked */
  onClick?: (state: P5MouseState) => void;
  /** Called when mouse is dragged */
  onDrag?: (state: P5MouseState) => void;
  /** Called when mouse wheel is scrolled */
  onWheel?: (delta: number, state: P5MouseState) => void;
}

/**
 * Configuration for mouse controls
 */
export interface P5MouseConfig extends P5MouseCallbacks {
  /** Enable mouse controls */
  enabled?: boolean;
}

/**
 * Mouse controls reference
 */
export interface P5MouseRef {
  /** Current mouse state */
  state: P5MouseState;
  /** Enable/disable controls */
  enabled: boolean;
  /** Update state (called automatically) */
  update: () => void;
}

/**
 * Hook for adding mouse controls to p5.js sketch
 * 
 * Provides consistent API with Three.js orbit controls but adapted for p5.js.
 * Automatically tracks mouse state and triggers callbacks.
 * 
 * @example
 * ```tsx
 * const p5Canvas = useP5Canvas({ container: containerRef, sketch });
 * 
 * const mouse = useP5Mouse(p5Canvas.instance, {
 *   onMove: (state) => {
 *     console.log('Mouse at:', state.x, state.y);
 *   },
 *   onDrag: (state) => {
 *     // Draw while dragging
 *   },
 *   onClick: (state) => {
 *     // Spawn particle at click
 *   },
 * });
 * 
 * // In draw loop:
 * p.draw = () => {
 *   mouse.update(); // Update state
 *   // Use mouse.state for rendering
 * };
 * ```
 */
export function useP5Mouse(
  p5Instance: p5 | null,
  config: P5MouseConfig = {}
): P5MouseRef {
  const stateRef = useRef<P5MouseState>({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    nx: 0,
    ny: 0,
    pressed: false,
    button: '',
    deltaX: 0,
    deltaY: 0,
    dragging: false,
  });

  const configRef = useRef(config);
  const enabledRef = useRef(config.enabled !== false);

  // Update config ref
  useEffect(() => {
    configRef.current = config;
    enabledRef.current = config.enabled !== false;
  }, [config]);

  // Setup event listeners
  useEffect(() => {
    if (!p5Instance || !enabledRef.current) return;

    const p = p5Instance;

    // Mouse moved
    p.mouseMoved = () => {
      if (!enabledRef.current) return;
      updateState(p);
      configRef.current.onMove?.(stateRef.current);
    };

    // Mouse dragged
    p.mouseDragged = () => {
      if (!enabledRef.current) return;
      updateState(p);
      stateRef.current.dragging = true;
      configRef.current.onDrag?.(stateRef.current);
    };

    // Mouse pressed
    p.mousePressed = () => {
      if (!enabledRef.current) return;
      updateState(p);
      stateRef.current.pressed = true;
      stateRef.current.button = getButton(p);
      configRef.current.onPress?.(stateRef.current);
    };

    // Mouse released
    p.mouseReleased = () => {
      if (!enabledRef.current) return;
      updateState(p);
      stateRef.current.pressed = false;
      stateRef.current.dragging = false;
      configRef.current.onRelease?.(stateRef.current);
    };

    // Mouse clicked
    p.mouseClicked = () => {
      if (!enabledRef.current) return;
      updateState(p);
      configRef.current.onClick?.(stateRef.current);
    };

    // Mouse wheel
    const handleWheel = (event: WheelEvent) => {
      if (!enabledRef.current) return;
      updateState(p);
      configRef.current.onWheel?.(event.deltaY, stateRef.current);
    };

    const canvas = (p as any).canvas as HTMLCanvasElement | undefined;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [p5Instance]);

  const updateState = (p: p5) => {
    const state = stateRef.current;

    // Store previous position
    state.px = state.x;
    state.py = state.y;

    // Update current position
    state.x = p.mouseX;
    state.y = p.mouseY;

    // Calculate normalized coordinates (-1 to 1)
    state.nx = (p.mouseX / p.width) * 2 - 1;
    state.ny = (p.mouseY / p.height) * 2 - 1;

    // Calculate delta
    state.deltaX = state.x - state.px;
    state.deltaY = state.y - state.py;

    // Update pressed state
    state.pressed = p.mouseIsPressed;
  };

  const getButton = (p: p5): string => {
    if ((p.mouseButton as any) === p.LEFT) return 'LEFT';
    if ((p.mouseButton as any) === p.RIGHT) return 'RIGHT';
    if ((p.mouseButton as any) === p.CENTER) return 'CENTER';
    return '';
  };

  const update = () => {
    if (!p5Instance || !enabledRef.current) return;
    updateState(p5Instance);
  };

  return {
    state: stateRef.current,
    enabled: enabledRef.current,
    update,
  };
}
