import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Particle generator function
 * Fills position and color arrays for particles
 */
export type ParticleGenerator = (
  positions: Float32Array,
  colors?: Float32Array,
  count?: number
) => void;

/**
 * Configuration for particle system
 */
export interface ParticlesConfig {
  /** Number of particles */
  count: number;
  /** Particle size */
  size?: number;
  /** Particle opacity */
  opacity?: number;
  /** Enable transparency */
  transparent?: boolean;
  /** Blending mode */
  blending?: THREE.Blending;
  /** Use vertex colors */
  vertexColors?: boolean;
  /** Size attenuation (particles get smaller with distance) */
  sizeAttenuation?: boolean;
  /** Particle color (if not using vertex colors) */
  color?: THREE.ColorRepresentation;
  /** Particle generator function */
  generator: ParticleGenerator;
}

/**
 * Particle system reference
 */
export interface ParticlesRef {
  /** The THREE.Points object */
  points: THREE.Points | null;
  /** Regenerate particles with new generator */
  regenerate: (generator?: ParticleGenerator) => void;
  /** Update particle positions */
  updatePositions: (generator: ParticleGenerator) => void;
  /** Update particle colors */
  updateColors: (generator: ParticleGenerator) => void;
}

const DEFAULT_CONFIG = {
  size: 0.1,
  opacity: 1.0,
  transparent: true,
  blending: THREE.NormalBlending,
  vertexColors: true,
  sizeAttenuation: true,
  color: 0xffffff,
};

/**
 * Hook for creating and managing a particle system in Three.js
 * 
 * Creates a THREE.Points object with configurable particles.
 * Provides utilities for updating positions and colors.
 * 
 * @example
 * ```tsx
 * const particles = useParticles(three.scene, {
 *   count: 5000,
 *   size: 0.1,
 *   generator: (positions, colors) => {
 *     for (let i = 0; i < 5000; i++) {
 *       const i3 = i * 3;
 *       // Random positions in sphere
 *       const radius = Math.random() * 10;
 *       const theta = Math.random() * Math.PI * 2;
 *       const phi = Math.acos(2 * Math.random() - 1);
 *       
 *       positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
 *       positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
 *       positions[i3 + 2] = radius * Math.cos(phi);
 *       
 *       if (colors) {
 *         colors[i3] = Math.random();
 *         colors[i3 + 1] = Math.random();
 *         colors[i3 + 2] = Math.random();
 *       }
 *     }
 *   },
 * });
 * 
 * // In animation loop:
 * useAnimation({
 *   onFrame: (time) => {
 *     if (particles.points) {
 *       particles.points.rotation.y = time * 0.1;
 *     }
 *   },
 * });
 * ```
 */
export function useParticles(
  scene: THREE.Scene,
  config: ParticlesConfig
): ParticlesRef {
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const configRef = useRef(config);

  // Update config ref
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Create particles
  useEffect(() => {
    if (!scene) return; // Guard against null scene
    
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = mergedConfig.vertexColors ? new Float32Array(config.count * 3) : undefined;

    // Generate particles using provided function
    config.generator(positions, colors, config.count);

    // Set attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    geometryRef.current = geometry;

    // Create material
    const material = new THREE.PointsMaterial({
      size: mergedConfig.size,
      opacity: mergedConfig.opacity,
      transparent: mergedConfig.transparent,
      blending: mergedConfig.blending,
      vertexColors: mergedConfig.vertexColors,
      sizeAttenuation: mergedConfig.sizeAttenuation,
      color: mergedConfig.vertexColors ? undefined : new THREE.Color(mergedConfig.color),
    });

    materialRef.current = material;

    // Create points
    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;

    // Add to scene
    scene.add(points);

    // Cleanup
    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, config.count, config.generator]);

  const regenerate = (generator?: ParticleGenerator) => {
    if (!geometryRef.current) return;

    const gen = generator || configRef.current.generator;
    const positions = new Float32Array(configRef.current.count * 3);
    const colors = configRef.current.vertexColors !== false 
      ? new Float32Array(configRef.current.count * 3)
      : undefined;

    gen(positions, colors, configRef.current.count);

    const geometry = geometryRef.current;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    geometry.attributes.position.needsUpdate = true;
    if (geometry.attributes.color) {
      geometry.attributes.color.needsUpdate = true;
    }
  };

  const updatePositions = (generator: ParticleGenerator) => {
    if (!geometryRef.current) return;

    const positions = new Float32Array(configRef.current.count * 3);
    generator(positions, undefined, configRef.current.count);

    geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryRef.current.attributes.position.needsUpdate = true;
  };

  const updateColors = (generator: ParticleGenerator) => {
    if (!geometryRef.current || !configRef.current.vertexColors) return;

    const colors = new Float32Array(configRef.current.count * 3);
    generator(new Float32Array(configRef.current.count * 3), colors, configRef.current.count);

    geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometryRef.current.attributes.color.needsUpdate = true;
  };

  return {
    points: pointsRef.current,
    regenerate,
    updatePositions,
    updateColors,
  };
}
