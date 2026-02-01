import { useEffect, useRef } from 'react';
import p5 from 'p5';

/**
 * Noise configuration
 */
export interface P5NoiseConfig {
  /** Noise seed for reproducibility */
  seed?: number;
  /** Number of octaves (detail level) */
  octaves?: number;
  /** Falloff for each octave */
  falloff?: number;
}

/**
 * 2D noise field configuration
 */
export interface NoiseFieldConfig {
  /** Width of field in cells */
  cols: number;
  /** Height of field in cells */
  rows: number;
  /** Scale of noise (smaller = smoother) */
  scale?: number;
  /** Z offset for animation */
  zOffset?: number;
}

/**
 * Noise field data
 */
export interface NoiseField {
  /** 2D array of noise values */
  values: number[][];
  /** Width in cells */
  cols: number;
  /** Height in cells */
  rows: number;
  /** Current z offset */
  z: number;
}

/**
 * Noise utilities reference
 */
export interface P5NoiseRef {
  /** Get 1D noise value */
  noise1D: (x: number) => number;
  /** Get 2D noise value */
  noise2D: (x: number, y: number) => number;
  /** Get 3D noise value */
  noise3D: (x: number, y: number, z: number) => number;
  /** Generate 2D noise field */
  generateField: (config: NoiseFieldConfig) => NoiseField;
  /** Update noise field (for animation) */
  updateField: (field: NoiseField, zIncrement: number) => void;
  /** Set noise seed */
  setSeed: (seed: number) => void;
  /** Set noise detail */
  setDetail: (octaves: number, falloff: number) => void;
}

/**
 * Hook for working with Perlin noise in p5.js
 * 
 * Provides utilities for generating and working with Perlin noise.
 * Useful for organic movement, terrain generation, flow fields, etc.
 * 
 * @example
 * ```tsx
 * const p5Canvas = useP5Canvas({ container: containerRef, sketch });
 * 
 * const noise = useP5Noise(p5Canvas.instance, {
 *   seed: 12345,
 *   octaves: 4,
 *   falloff: 0.5,
 * });
 * 
 * // Create flow field
 * const field = noise.generateField({
 *   cols: 50,
 *   rows: 50,
 *   scale: 0.1,
 * });
 * 
 * // In draw loop:
 * p.draw = () => {
 *   noise.updateField(field, 0.01); // Animate
 *   drawFlowField(field);
 * };
 * ```
 */
export function useP5Noise(
  p5Instance: p5 | null,
  config: P5NoiseConfig = {}
): P5NoiseRef {
  const configRef = useRef(config);

  // Initialize noise settings
  useEffect(() => {
    if (!p5Instance) return;

    const p = p5Instance;

    if (config.seed !== undefined) {
      p.noiseSeed(config.seed);
    }

    if (config.octaves !== undefined || config.falloff !== undefined) {
      p.noiseDetail(
        config.octaves ?? 4,
        config.falloff ?? 0.5
      );
    }
  }, [p5Instance, config.seed, config.octaves, config.falloff]);

  const noise1D = (x: number): number => {
    if (!p5Instance) return 0;
    return p5Instance.noise(x);
  };

  const noise2D = (x: number, y: number): number => {
    if (!p5Instance) return 0;
    return p5Instance.noise(x, y);
  };

  const noise3D = (x: number, y: number, z: number): number => {
    if (!p5Instance) return 0;
    return p5Instance.noise(x, y, z);
  };

  const generateField = (fieldConfig: NoiseFieldConfig): NoiseField => {
    if (!p5Instance) {
      return {
        values: [],
        cols: 0,
        rows: 0,
        z: 0,
      };
    }

    const scale = fieldConfig.scale ?? 0.1;
    const z = fieldConfig.zOffset ?? 0;
    const values: number[][] = [];

    for (let y = 0; y < fieldConfig.rows; y++) {
      values[y] = [];
      for (let x = 0; x < fieldConfig.cols; x++) {
        const noiseValue = p5Instance.noise(x * scale, y * scale, z);
        values[y][x] = noiseValue;
      }
    }

    return {
      values,
      cols: fieldConfig.cols,
      rows: fieldConfig.rows,
      z,
    };
  };

  const updateField = (field: NoiseField, zIncrement: number): void => {
    if (!p5Instance) return;

    field.z += zIncrement;

    const scale = 0.1; // Could be configurable

    for (let y = 0; y < field.rows; y++) {
      for (let x = 0; x < field.cols; x++) {
        const noiseValue = p5Instance.noise(x * scale, y * scale, field.z);
        field.values[y][x] = noiseValue;
      }
    }
  };

  const setSeed = (seed: number): void => {
    if (!p5Instance) return;
    p5Instance.noiseSeed(seed);
  };

  const setDetail = (octaves: number, falloff: number): void => {
    if (!p5Instance) return;
    p5Instance.noiseDetail(octaves, falloff);
  };

  return {
    noise1D,
    noise2D,
    noise3D,
    generateField,
    updateField,
    setSeed,
    setDetail,
  };
}
