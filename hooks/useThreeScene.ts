import React, { useEffect, useState, useRef, ReactNode } from 'react';
import * as THREE from 'three';

// ============================================================================
// CORE THREE.JS HOOK
// ============================================================================

interface UseThreeSceneOptions {
  cameraPosition?: [number, number, number];
  background?: number;
  fog?: { color: number; near: number; far: number };
  enableOrbitControls?: boolean;
  orbitControlsConfig?: {
    enableDamping?: boolean;
    dampingFactor?: number;
    minDistance?: number;
    maxDistance?: number;
  };
}

export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement>,
  options: UseThreeSceneOptions = {}
) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    if (options.background !== undefined) {
      scene.background = new THREE.Color(options.background);
    }
    if (options.fog) {
      scene.fog = new THREE.Fog(options.fog.color, options.fog.near, options.fog.far);
    }
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const [x, y, z] = options.cameraPosition || [0, 0, 50];
    camera.position.set(x, y, z);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // OrbitControls setup - manual implementation
    if (options.enableOrbitControls !== false) {
      const config = options.orbitControlsConfig || {};
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      const rotationSpeed = 0.005;
      const zoomSpeed = 0.1;

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !cameraRef.current) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const spherical = {
          radius: Math.sqrt(
            camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
          ),
          theta: Math.atan2(camera.position.x, camera.position.z),
          phi: Math.acos(camera.position.y / Math.sqrt(
            camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
          )),
        };

        spherical.theta -= deltaX * rotationSpeed;
        spherical.phi -= deltaY * rotationSpeed;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        camera.position.y = spherical.radius * Math.cos(spherical.phi);
        camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.lookAt(0, 0, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!cameraRef.current) return;

        const delta = e.deltaY * zoomSpeed;
        const currentDistance = Math.sqrt(
          camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
        );
        const newDistance = Math.max(
          config.minDistance || 5,
          Math.min(config.maxDistance || 100, currentDistance + delta)
        );
        const scale = newDistance / currentDistance;

        camera.position.multiplyScalar(scale);
      };

      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      renderer.domElement.addEventListener('mousemove', handleMouseMove);
      renderer.domElement.addEventListener('mouseup', handleMouseUp);
      renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

      controlsRef.current = {
        cleanup: () => {
          renderer.domElement.removeEventListener('mousedown', handleMouseDown);
          renderer.domElement.removeEventListener('mousemove', handleMouseMove);
          renderer.domElement.removeEventListener('mouseup', handleMouseUp);
          renderer.domElement.removeEventListener('wheel', handleWheel);
        },
      };
    }

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (controlsRef.current?.cleanup) {
        controlsRef.current.cleanup();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const startAnimation = (callback: () => void) => {
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      callback();
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  };

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    startAnimation,
    stopAnimation,
  };
}
