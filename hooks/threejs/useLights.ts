import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Ambient light configuration
 */
export interface AmbientLightConfig {
  /** Light color */
  color?: THREE.ColorRepresentation;
  /** Light intensity */
  intensity?: number;
}

/**
 * Directional light configuration
 */
export interface DirectionalLightConfig {
  /** Light color */
  color?: THREE.ColorRepresentation;
  /** Light intensity */
  intensity?: number;
  /** Light position [x, y, z] */
  position?: [number, number, number];
  /** Enable shadows */
  castShadow?: boolean;
  /** Shadow camera size */
  shadowCameraSize?: number;
}

/**
 * Point light configuration
 */
export interface PointLightConfig {
  /** Light color */
  color?: THREE.ColorRepresentation;
  /** Light intensity */
  intensity?: number;
  /** Light position [x, y, z] */
  position?: [number, number, number];
  /** Light distance */
  distance?: number;
  /** Light decay */
  decay?: number;
  /** Enable shadows */
  castShadow?: boolean;
}

/**
 * Spot light configuration
 */
export interface SpotLightConfig {
  /** Light color */
  color?: THREE.ColorRepresentation;
  /** Light intensity */
  intensity?: number;
  /** Light position [x, y, z] */
  position?: [number, number, number];
  /** Target position [x, y, z] */
  target?: [number, number, number];
  /** Light distance */
  distance?: number;
  /** Spotlight angle (radians) */
  angle?: number;
  /** Penumbra (soft edge) */
  penumbra?: number;
  /** Light decay */
  decay?: number;
  /** Enable shadows */
  castShadow?: boolean;
}

/**
 * Hemisphere light configuration
 */
export interface HemisphereLightConfig {
  /** Sky color */
  skyColor?: THREE.ColorRepresentation;
  /** Ground color */
  groundColor?: THREE.ColorRepresentation;
  /** Light intensity */
  intensity?: number;
}

/**
 * Complete lights configuration
 */
export interface LightsConfig {
  /** Ambient light */
  ambient?: AmbientLightConfig;
  /** Directional light(s) */
  directional?: DirectionalLightConfig | DirectionalLightConfig[];
  /** Point light(s) */
  point?: PointLightConfig | PointLightConfig[];
  /** Spot light(s) */
  spot?: SpotLightConfig | SpotLightConfig[];
  /** Hemisphere light */
  hemisphere?: HemisphereLightConfig;
}

/**
 * Lights reference
 */
export interface LightsRef {
  /** All lights in the scene */
  lights: THREE.Light[];
  /** Get light by type and index */
  getLight: (type: string, index?: number) => THREE.Light | undefined;
}

/**
 * Hook for adding lights to a Three.js scene
 * 
 * Provides a declarative way to add different types of lights.
 * Automatically handles cleanup when component unmounts.
 * 
 * @example
 * ```tsx
 * const lights = useLights(three.scene, {
 *   ambient: {
 *     color: 0xffffff,
 *     intensity: 0.5,
 *   },
 *   directional: {
 *     color: 0xffffff,
 *     intensity: 1,
 *     position: [10, 10, 10],
 *     castShadow: true,
 *   },
 *   point: [
 *     {
 *       color: 0xff0000,
 *       intensity: 1,
 *       position: [-5, 5, 0],
 *     },
 *     {
 *       color: 0x0000ff,
 *       intensity: 1,
 *       position: [5, 5, 0],
 *     },
 *   ],
 * });
 * ```
 */
export function useLights(scene: THREE.Scene, config: LightsConfig): LightsRef {
  const lightsRef = useRef<THREE.Light[]>([]);
  const lightMapRef = useRef<Map<string, THREE.Light[]>>(new Map());

  useEffect(() => {
    const lights: THREE.Light[] = [];
    const lightMap = new Map<string, THREE.Light[]>();

    // Ambient Light
    if (config.ambient) {
      const light = new THREE.AmbientLight(
        config.ambient.color ?? 0xffffff,
        config.ambient.intensity ?? 1
      );
      lights.push(light);
      lightMap.set('ambient', [light]);
      scene?.add(light);
    }

    // Directional Light(s)
    if (config.directional) {
      const directionals = Array.isArray(config.directional)
        ? config.directional
        : [config.directional];

      const dirLights: THREE.Light[] = [];
      directionals.forEach((cfg) => {
        const light = new THREE.DirectionalLight(
          cfg.color ?? 0xffffff,
          cfg.intensity ?? 1
        );

        if (cfg.position) {
          light.position.set(...cfg.position);
        }

        if (cfg.castShadow) {
          light.castShadow = true;
          const size = cfg.shadowCameraSize ?? 10;
          light.shadow.camera.left = -size;
          light.shadow.camera.right = size;
          light.shadow.camera.top = size;
          light.shadow.camera.bottom = -size;
        }

        lights.push(light);
        dirLights.push(light);
        scene?.add(light);
      });
      lightMap.set('directional', dirLights);
    }

    // Point Light(s)
    if (config.point) {
      const points = Array.isArray(config.point) ? config.point : [config.point];

      const pointLights: THREE.Light[] = [];
      points.forEach((cfg) => {
        const light = new THREE.PointLight(
          cfg.color ?? 0xffffff,
          cfg.intensity ?? 1,
          cfg.distance ?? 0,
          cfg.decay ?? 2
        );

        if (cfg.position) {
          light.position.set(...cfg.position);
        }

        if (cfg.castShadow) {
          light.castShadow = true;
        }

        lights.push(light);
        pointLights.push(light);
        scene.add(light);
      });
      lightMap.set('point', pointLights);
    }

    // Spot Light(s)
    if (config.spot) {
      const spots = Array.isArray(config.spot) ? config.spot : [config.spot];

      const spotLights: THREE.Light[] = [];
      spots.forEach((cfg) => {
        const light = new THREE.SpotLight(
          cfg.color ?? 0xffffff,
          cfg.intensity ?? 1,
          cfg.distance ?? 0,
          cfg.angle ?? Math.PI / 3,
          cfg.penumbra ?? 0,
          cfg.decay ?? 2
        );

        if (cfg.position) {
          light.position.set(...cfg.position);
        }

        if (cfg.target) {
          light.target.position.set(...cfg.target);
          scene.add(light.target);
        }

        if (cfg.castShadow) {
          light.castShadow = true;
        }

        lights.push(light);
        spotLights.push(light);
        scene.add(light);
      });
      lightMap.set('spot', spotLights);
    }

    // Hemisphere Light
    if (config.hemisphere) {
      const light = new THREE.HemisphereLight(
        config.hemisphere.skyColor ?? 0xffffff,
        config.hemisphere.groundColor ?? 0x444444,
        config.hemisphere.intensity ?? 1
      );
      lights.push(light);
      lightMap.set('hemisphere', [light]);
      scene.add(light);
    }

    lightsRef.current = lights;
    lightMapRef.current = lightMap;

    // Cleanup
    return () => {
      lights.forEach((light) => {
        scene?.remove(light);
        if (light instanceof THREE.SpotLight && light.target) {
          scene.remove(light.target);
        }
      });
    };
  }, [scene, config]);

  const getLight = (type: string, index: number = 0): THREE.Light | undefined => {
    const lights = lightMapRef.current.get(type);
    return lights?.[index];
  };

  return {
    lights: lightsRef.current,
    getLight,
  };
}
