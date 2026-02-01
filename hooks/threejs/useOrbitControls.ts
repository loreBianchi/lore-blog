import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Configuration for orbit controls
 */
export interface OrbitControlsConfig {
  /** Enable/disable controls */
  enabled?: boolean;
  /** Rotation speed */
  rotationSpeed?: number;
  /** Zoom speed */
  zoomSpeed?: number;
  /** Minimum distance from target */
  minDistance?: number;
  /** Maximum distance from target */
  maxDistance?: number;
  /** Minimum polar angle (radians) */
  minPolarAngle?: number;
  /** Maximum polar angle (radians) */
  maxPolarAngle?: number;
  /** Enable damping for smooth movement */
  enableDamping?: boolean;
  /** Damping factor */
  dampingFactor?: number;
  /** Auto rotate */
  autoRotate?: boolean;
  /** Auto rotate speed */
  autoRotateSpeed?: number;
}

/**
 * Orbit controls state
 */
export interface OrbitControlsState {
  /** Enable/disable controls */
  enabled: boolean;
  /** Update controls (call in animation loop if damping enabled) */
  update: () => void;
  /** Reset controls to initial state */
  reset: () => void;
}

const DEFAULT_CONFIG: Required<OrbitControlsConfig> = {
  enabled: true,
  rotationSpeed: 0.005,
  zoomSpeed: 0.1,
  minDistance: 5,
  maxDistance: 100,
  minPolarAngle: 0.1,
  maxPolarAngle: Math.PI - 0.1,
  enableDamping: false,
  dampingFactor: 0.05,
  autoRotate: false,
  autoRotateSpeed: 2.0,
};

/**
 * Hook for adding orbit controls to Three.js camera
 * 
 * Provides mouse-based camera controls with rotation and zoom.
 * Implements manual orbit controls without external dependencies.
 * 
 * @example
 * ```tsx
 * const three = useThreeCanvas({ container: containerRef });
 * 
 * const controls = useOrbitControls(three.camera, three.canvas, {
 *   rotationSpeed: 0.01,
 *   minDistance: 10,
 *   maxDistance: 50,
 * });
 * 
 * // In animation loop (if damping enabled):
 * useAnimation({
 *   onFrame: () => {
 *     controls.update();
 *     three.render();
 *   },
 * });
 * ```
 */
export function useOrbitControls(
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  config: OrbitControlsConfig = {}
): OrbitControlsState {
  const stateRef = useRef({
    enabled: true,
    isDragging: false,
    previousMouse: { x: 0, y: 0 },
    target: new THREE.Vector3(0, 0, 0),
    spherical: {
      radius: 0,
      theta: 0,
      phi: 0,
    },
  });

  const configRef = useRef({ ...DEFAULT_CONFIG, ...config });

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = { ...DEFAULT_CONFIG, ...config };
  }, [config]);

  // Initialize spherical coordinates from camera position
  useEffect(() => {
    if (!camera) return; // Guard against null camera
    
    const state = stateRef.current;
    const cam = camera as THREE.PerspectiveCamera | THREE.OrthographicCamera;

    // Calculate initial spherical coordinates
    const offset = new THREE.Vector3().subVectors(cam.position, state.target);
    state.spherical.radius = offset.length();
    state.spherical.theta = Math.atan2(offset.x, offset.z);
    state.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / state.spherical.radius)));
  }, [camera]);

  // Setup event listeners
  useEffect(() => {
    if (!camera || !canvas) return; // Guard against null camera/canvas
    
    const state = stateRef.current;
    const currentConfig = configRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      if (!currentConfig.enabled) return;
      
      state.isDragging = true;
      state.previousMouse = { x: e.clientX, y: e.clientY };
      
      // Prevent text selection while dragging
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging || !state.enabled || !currentConfig.enabled) return;

      const deltaX = e.clientX - state.previousMouse.x;
      const deltaY = e.clientY - state.previousMouse.y;

      // Update spherical coordinates
      state.spherical.theta -= deltaX * currentConfig.rotationSpeed;
      state.spherical.phi -= deltaY * currentConfig.rotationSpeed;

      // Clamp phi to avoid gimbal lock
      state.spherical.phi = Math.max(
        currentConfig.minPolarAngle,
        Math.min(currentConfig.maxPolarAngle, state.spherical.phi)
      );

      // Update camera position
      updateCameraPosition();

      state.previousMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      state.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!currentConfig.enabled) return;

      e.preventDefault();

      const delta = e.deltaY * currentConfig.zoomSpeed;
      state.spherical.radius = Math.max(
        currentConfig.minDistance,
        Math.min(currentConfig.maxDistance, state.spherical.radius + delta)
      );

      updateCameraPosition();
    };

    const updateCameraPosition = () => {
      const { radius, theta, phi } = state.spherical;
      const cam = camera as THREE.PerspectiveCamera | THREE.OrthographicCamera;

      // Convert spherical to cartesian
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      cam.position.set(
        state.target.x + x,
        state.target.y + y,
        state.target.z + z
      );

      cam.lookAt(state.target);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [camera, canvas]);

  const update = () => {
    // For future damping implementation
    if (configRef.current.enableDamping) {
      // Apply damping logic here
    }
  };

  const reset = () => {
    const state = stateRef.current;
    const cam = camera as THREE.PerspectiveCamera | THREE.OrthographicCamera;

    // Reset to initial camera position
    const offset = new THREE.Vector3().subVectors(cam.position, state.target);
    state.spherical.radius = offset.length();
    state.spherical.theta = Math.atan2(offset.x, offset.z);
    state.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / state.spherical.radius)));
  };

  return {
    enabled: stateRef.current.enabled,
    update,
    reset,
  };
}
