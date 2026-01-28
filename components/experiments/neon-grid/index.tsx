"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { CanvasContainer } from "../shared/canvas-container";
import { neonGridInstructions } from "@/data/experiments";
import { StatsPanel } from "../shared/stats-panel";
import { InstructionsPanel } from "../shared/instructions-panel";
import { colorsSets } from "@/data/colors";
import Controls from "./controls";
import { ColorKey } from "@/types/colors";

export function NeonGridExperiment() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(10);
  const [neonIntensity, setNeonIntensity] = useState<number>(2);
  const [colorScheme, setColorScheme] = useState<ColorKey>("purple");
  const [showControls, setShowControls] = useState<boolean>(true);

  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boxesRef = useRef<THREE.Mesh[]>([]);
  const gridRef = useRef<THREE.Mesh[][]>([]);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<any>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const stats = [
    {
      label: "CUBES",
      value: (gridSize * gridSize).toString(),
      color: "#00FFFF",
    },
    {
      label: "FPS",
      value: "60",
      color: "#00FF00",
      inline: true
    },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 25);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(12, 20, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);

    // Manual OrbitControls implementation
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
        radius: Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2),
        theta: Math.atan2(camera.position.x, camera.position.z),
        phi: Math.acos(
          camera.position.y /
            Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2),
        ),
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
        camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2,
      );
      const newDistance = Math.max(5, Math.min(30, currentDistance + delta));
      const scale = newDistance / currentDistance;

      camera.position.multiplyScalar(scale);
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    controlsRef.current = {
      cleanup: () => {
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("mouseup", handleMouseUp);
        renderer.domElement.removeEventListener("wheel", handleWheel);
      },
    };

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Clock
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Resize handler
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (controlsRef.current?.cleanup) {
        controlsRef.current.cleanup();
      }

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Dispose Three.js resources
      boxesRef.current.forEach((box) => {
        box.geometry.dispose();
        if (Array.isArray(box.material)) {
          box.material.forEach((m) => m.dispose());
        } else {
          box.material.dispose();
        }
      });

      if (particlesMeshRef.current) {
        particlesMeshRef.current.geometry.dispose();
        (particlesMeshRef.current.material as THREE.Material).dispose();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, []);

  // Effect for grid recreation
  useEffect(() => {
    if (!sceneRef.current) return;

    const currentColors = colorsSets[colorScheme];

    // Remove old boxes
    boxesRef.current.forEach((box) => {
      if (sceneRef.current) {
        sceneRef.current.remove(box);
      }
      box.geometry.dispose();
      if (Array.isArray(box.material)) {
        box.material.forEach((m) => m.dispose());
      } else {
        box.material.dispose();
      }
    });
    boxesRef.current = [];
    gridRef.current = [];

    // Create new grid
    for (let x = 0; x < gridSize; x++) {
      gridRef.current[x] = [];
      for (let z = 0; z < gridSize; z++) {
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const material = new THREE.MeshStandardMaterial({
          color: currentColors.primary,
          emissive: currentColors.glow,
          emissiveIntensity: neonIntensity * 0.3,
          metalness: 0.8,
          roughness: 0.2,
        });

        const box = new THREE.Mesh(geometry, material);
        box.position.set(x - gridSize / 2 + 0.5, 0, z - gridSize / 2 + 0.5);
        box.castShadow = true;
        box.receiveShadow = true;

        (box as any).originalY = 0;
        (box as any).originalX = x;
        (box as any).originalZ = z;

        sceneRef.current.add(box);
        boxesRef.current.push(box);
        gridRef.current[x][z] = box;
      }
    }

    // Update or create particles
    if (particlesMeshRef.current && sceneRef.current) {
      sceneRef.current.remove(particlesMeshRef.current);
      particlesMeshRef.current.geometry.dispose();
      (particlesMeshRef.current.material as THREE.Material).dispose();
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: currentColors.glow,
      transparent: true,
      opacity: 0.6,
    });

    particlesMeshRef.current = new THREE.Points(particlesGeometry, particlesMaterial);
    sceneRef.current.add(particlesMeshRef.current);
  }, [gridSize, colorScheme, neonIntensity]);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !clockRef.current)
        return;

      const time = clockRef.current.getElapsedTime();

      // Animate boxes
      boxesRef.current.forEach((box, i) => {
        const x = (box as any).originalX;
        const z = (box as any).originalZ;

        const float = Math.sin(time * 0.5 + x * 0.3 + z * 0.3) * 0.3;
        box.position.y = (box as any).originalY + float;

        const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
        (box.material as THREE.MeshStandardMaterial).emissiveIntensity =
          neonIntensity * (0.3 + pulse * 0.2);

        box.rotation.y = time * 0.2;
      });

      // Animate particles
      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.y = time * 0.1;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, neonIntensity]);

  const handleReset = () => {
    setGridSize(10);
    setNeonIntensity(2);
    setColorScheme("purple");
    setIsPlaying(true);
  };

  return (
    <CanvasContainer>
      <div ref={canvasRef} className="w-full h-full" />

      <ToggleControlsBtn
        onClick={() => setShowControls(!showControls)}
        label={showControls ? "Hide Controls" : "Show Controls"}
      />

      <InstructionsPanel
        title="Neon Grid Experiment"
        icon={<span className="text-cyan-400">💠</span>}
        instructions={neonGridInstructions}
        showControls={showControls}
      />

      <StatsPanel stats={stats} showControls={showControls} />

      <Controls
        showControls={showControls}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        neonIntensity={neonIntensity}
        onNeonIntensityChange={setNeonIntensity}
        colorScheme={colorScheme}
        onColorSchemeChange={(id) => setColorScheme(id as "purple" | "cyan" | "pink")}
        onReset={handleReset}
      />
    </CanvasContainer>
  );
}
