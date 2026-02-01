import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useCanvas, useResize } from '../core';

/**
 * Camera configuration for Three.js
 */
export interface ThreeCameraConfig {
  /** Camera type */
  type?: 'perspective' | 'orthographic';
  /** Field of view for perspective camera */
  fov?: number;
  /** Near clipping plane */
  near?: number;
  /** Far clipping plane */
  far?: number;
  /** Initial camera position [x, y, z] */
  position?: [number, number, number];
  /** Point to look at [x, y, z] */
  lookAt?: [number, number, number];
}

/**
 * Renderer configuration for Three.js
 */
export interface ThreeRendererConfig {
  /** Enable antialiasing */
  antialias?: boolean;
  /** Enable alpha channel */
  alpha?: boolean;
  /** Enable shadows */
  shadows?: boolean;
  /** Shadow map type */
  shadowMapType?: THREE.ShadowMapType;
  /** Tone mapping */
  toneMapping?: THREE.ToneMapping;
  /** Tone mapping exposure */
  toneMappingExposure?: number;
}

/**
 * Scene configuration for Three.js
 */
export interface ThreeSceneConfig {
  /** Background color */
  background?: THREE.ColorRepresentation;
  /** Enable fog */
  fog?: {
    color: THREE.ColorRepresentation;
    near: number;
    far: number;
  };
  /** Environment map */
  environment?: THREE.Texture;
}

/**
 * Complete configuration for Three.js canvas
 */
export interface ThreeCanvasConfig {
  /** Container element reference */
  container: React.RefObject<HTMLElement>;
  /** Camera configuration */
  camera?: ThreeCameraConfig;
  /** Renderer configuration */
  renderer?: ThreeRendererConfig;
  /** Scene configuration */
  scene?: ThreeSceneConfig;
  /** Auto resize on container change */
  autoResize?: boolean;
  /** Pixel ratio (default: min(devicePixelRatio, 2)) */
  pixelRatio?: number;
}

/**
 * Three.js canvas context
 */
export interface ThreeCanvasContext {
  /** Three.js scene */
  scene: THREE.Scene;
  /** Three.js camera */
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  /** Three.js renderer */
  renderer: THREE.WebGLRenderer;
  /** Container element */
  container: HTMLElement;
  /** Canvas element */
  canvas: HTMLCanvasElement;
  /** Is Three.js initialized and ready */
  isReady: boolean;
  /** Render the scene */
  render: () => void;
}

const DEFAULT_CAMERA: Required<ThreeCameraConfig> = {
  type: 'perspective',
  fov: 75,
  near: 0.1,
  far: 1000,
  position: [0, 0, 10],
  lookAt: [0, 0, 0],
};

const DEFAULT_RENDERER: Required<ThreeRendererConfig> = {
  antialias: true,
  alpha: true,
  shadows: false,
  shadowMapType: THREE.PCFSoftShadowMap,
  toneMapping: THREE.NoToneMapping,
  toneMappingExposure: 1,
};

const DEFAULT_SCENE: ThreeSceneConfig = {
  background: undefined,
  fog: undefined,
  environment: undefined,
};

/**
 * Hook for setting up a Three.js canvas
 * 
 * This is the main module hook for Three.js. It provides:
 * - Scene, camera, and renderer setup
 * - Automatic resize handling
 * - Proper cleanup
 * - Built on top of core hooks
 * 
 * @example
 * ```tsx
 * const { containerRef } = useCanvas();
 * 
 * const three = useThreeCanvas({
 *   container: containerRef,
 *   camera: {
 *     position: [0, 10, 30],
 *     fov: 60,
 *   },
 *   renderer: {
 *     antialias: true,
 *     shadows: true,
 *   },
 * });
 * 
 * return <div ref={containerRef} />;
 * ```
 */
export function useThreeCanvas(config: ThreeCanvasConfig): ThreeCanvasContext {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Merge configs with defaults
  const cameraConfig = { ...DEFAULT_CAMERA, ...config.camera };
  const rendererConfig = { ...DEFAULT_RENDERER, ...config.renderer };
  const sceneConfig = { ...DEFAULT_SCENE, ...config.scene };
  const pixelRatio = config.pixelRatio ?? (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1);

  // Initialize Three.js
  useEffect(() => {
    if (!config.container.current) return;

    const container = config.container.current;

    // Create scene
    const scene = new THREE.Scene();
    
    if (sceneConfig.background !== null) {
      scene.background = new THREE.Color(sceneConfig.background);
    }

    if (sceneConfig.fog) {
      scene.fog = new THREE.Fog(
        sceneConfig.fog.color,
        sceneConfig.fog.near,
        sceneConfig.fog.far
      );
    }

    if (sceneConfig.environment) {
      scene.environment = sceneConfig.environment;
    }

    sceneRef.current = scene;

    // Create camera
    const aspect = container.clientWidth / container.clientHeight;
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    if (cameraConfig.type === 'perspective') {
      camera = new THREE.PerspectiveCamera(
        cameraConfig.fov,
        aspect,
        cameraConfig.near,
        cameraConfig.far
      );
    } else {
      const frustumSize = 10;
      camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        cameraConfig.near,
        cameraConfig.far
      );
    }

    camera.position.set(...cameraConfig.position);
    camera.lookAt(...cameraConfig.lookAt);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: rendererConfig.antialias,
      alpha: rendererConfig.alpha,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);

    if (rendererConfig.shadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = rendererConfig.shadowMapType;
    }

    renderer.toneMapping = rendererConfig.toneMapping;
    renderer.toneMappingExposure = rendererConfig.toneMappingExposure;

    rendererRef.current = renderer;

    // Mount renderer
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Mark as ready
    setIsReady(true);

    // Cleanup
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
      setIsReady(false);
    };
  }, [config.container]);

  // Handle resize
  useResize(config.container, {
    onResize: (width, height) => {
      if (!cameraRef.current || !rendererRef.current) return;

      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      } else if (camera instanceof THREE.OrthographicCamera) {
        const frustumSize = 10;
        camera.left = (frustumSize * (width / height)) / -2;
        camera.right = (frustumSize * (width / height)) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
      }

      renderer.setSize(width, height);
    },
  });

  // Create render function
  const render = useCallback(() => {
    if (sceneRef.current && cameraRef.current && rendererRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  // Return context
  return {
    scene: sceneRef.current!,
    camera: cameraRef.current!,
    renderer: rendererRef.current!,
    container: config.container.current!,
    canvas: rendererRef.current?.domElement!,
    isReady,
    render,
  };
}
