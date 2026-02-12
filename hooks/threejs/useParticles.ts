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

export function useParticles(
  scene: THREE.Scene,
  config: ParticlesConfig
): ParticlesRef {
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const configRef = useRef(config);
  const generatorRef = useRef(config.generator);

  // Update config ref
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Update generator ref
  useEffect(() => {
    generatorRef.current = config.generator;
  }, [config.generator]);

  // Create particles
  useEffect(() => {
    if (!scene) return;
    
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = mergedConfig.vertexColors ? new Float32Array(config.count * 3) : undefined;

    // Usa generatorRef invece di config.generator
    generatorRef.current(positions, colors, config.count);

    // Set attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

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

    // Create points
    const points = new THREE.Points(geometry, material);
    
    // Rimuovi il vecchio se esiste
    if (pointsRef.current) {
      scene.remove(pointsRef.current);
    }
    
    // Aggiungi il nuovo
    scene.add(points);
    
    // Salva le ref
    pointsRef.current = points;
    geometryRef.current = geometry;
    materialRef.current = material;

    // Cleanup - rimuovi solo dalla scena, NON settare a null
    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      // NON fare: pointsRef.current = null
    };
  }, [scene, config.count]);

  // Effect separato per aggiornare le particelle quando generator cambia
  useEffect(() => {
    if (!geometryRef.current || !pointsRef.current) return;

    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const positions = new Float32Array(config.count * 3);
    const colors = mergedConfig.vertexColors ? new Float32Array(config.count * 3) : undefined;

    // Rigenera con il nuovo generator
    config.generator(positions, colors, config.count);

    // Aggiorna gli attributi
    geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    geometryRef.current.attributes.position.needsUpdate = true;
    if (geometryRef.current.attributes.color) {
      geometryRef.current.attributes.color.needsUpdate = true;
    }
  }, [config.generator, config.count]);

  const regenerate = (generator?: ParticleGenerator) => {
    if (!geometryRef.current) return;

    const gen = generator || generatorRef.current;
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