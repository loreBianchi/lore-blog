"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PlayPauseButton } from "../shared/play-pause-button";
import { ColorPicker } from "../shared/color-picker";
import { StatsPanel } from "../shared/stats-panel";
import { CanvasContainer } from "../shared/canvas-container";
import { galaxyTypes, instructions } from "@/data/experiments";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { ControlsContainer } from "../shared/controls-container";
import { ControlsBtnGroup } from "../shared/controls-btn-group";
import { InstructionsPanel } from "../shared/instructions-panel";
import { RangeSlider } from "../shared/range-slider";
import { colorMap, colorOptions } from "@/data/colors";
import { ColorKey } from "@/types/colors";

export const ParticleGalaxyExperiment = () => {
  const [particleCount, setParticleCount] = useState(3000);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [colorScheme, setColorScheme] = useState<ColorKey>("cyan");
  const [galaxyType, setGalaxyType] = useState("spiral");
  const [isMounted, setIsMounted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

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
      const newDistance = Math.max(10, Math.min(100, currentDistance + delta));
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

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (controlsRef.current?.cleanup) {
        controlsRef.current.cleanup();
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Create/update particles
  useEffect(() => {
    if (!sceneRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = colorMap[colorScheme] || colorMap.cyan;
    const outerColor = new THREE.Color(0x7209b7);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      let x, y, z;

      switch (galaxyType) {
        case "spiral":
          const radius = Math.random() * 25;
          const angle = Math.random() * Math.PI * 2;
          const spiral = Math.sin(radius * 0.5) * 2;
          x = Math.cos(angle + spiral) * radius;
          y = (Math.random() - 0.5) * 2;
          z = Math.sin(angle + spiral) * radius;
          break;

        case "elliptical":
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const r = Math.cbrt(Math.random()) * 20;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta) * 0.5;
          z = r * Math.cos(phi);
          break;

        case "irregular":
          x = (Math.random() - 0.5) * 30;
          y = (Math.random() - 0.5) * 30;
          z = (Math.random() - 0.5) * 30;
          break;

        default:
          const rad = Math.random() * 15;
          const ang = Math.random() * Math.PI * 2;
          x = Math.cos(ang) * rad;
          y = (Math.random() - 0.5) * 5;
          z = Math.sin(ang) * rad;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const distance = Math.sqrt(x * x + y * y + z * z);
      const normalizedDistance = distance / 25;
      const particleColor = color.clone().lerp(outerColor, normalizedDistance);

      colors[i3] = particleColor.r;
      colors[i3 + 1] = particleColor.g;
      colors[i3 + 2] = particleColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      (particlesRef.current.material as THREE.Material).dispose();
    }

    particlesRef.current = new THREE.Points(geometry, material);
    sceneRef.current.add(particlesRef.current);

    return () => {
      if (particlesRef.current && sceneRef.current) {
        sceneRef.current.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
    };
  }, [particleCount, colorScheme, galaxyType]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.001 * speed;
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
  }, [isPlaying, speed]);

  const stats = [
    {
      label: "PARTICLES",
      value: isMounted ? particleCount.toLocaleString() : String(particleCount),
      color: "#4CC9F0",
    },
    { label: "SPEED", value: `${speed.toFixed(1)}x`, color: "#9D4EDD" },
    { label: "FPS", value: "60", color: "#06D6A0" },
  ];

  return (
    <CanvasContainer>
      <div ref={containerRef} className="w-full h-full" />

      <ToggleControlsBtn
        onClick={() => setShowControls(!showControls)}
        label={showControls ? "Hide Controls" : "Show Controls"}
      />

      <InstructionsPanel
        title="Particle Flow Experiment"
        icon={<span className="text-cyan-400">✨</span>}
        instructions={instructions}
        showControls={showControls}
      />

      <StatsPanel stats={stats} showControls={showControls} />

      <ControlsContainer showControls={showControls} position="bottom-left">
        <PlayPauseButton isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />

        {/* Particle Count Slider */}
        <RangeSlider
          label="Particles"
          value={particleCount}
          min={1000}
          max={10000}
          step={500}
          onChange={(v) => setParticleCount(v)}
          accentColor="cyan"
        />

        {/* Speed Slider */}
        <RangeSlider
          label="Rotation Speed"
          value={speed}
          min={0.1}
          max={5}
          step={0.1}
          onChange={(v) => setSpeed(v)}
          accentColor="purple"
        />

        {/* Color Scheme */}
        <ColorPicker
          colors={colorOptions}
          selected={colorScheme}
          onChange={(id) => setColorScheme(id)}
        />

        {/* Galaxy Type */}
        <ControlsBtnGroup
          buttons={galaxyTypes.map((type) => ({
            label: type.name,
            onClick: () => setGalaxyType(type.id),
            className:
              galaxyType === type.id
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent",
          }))}
        />
      </ControlsContainer>
    </CanvasContainer>
  );
};
