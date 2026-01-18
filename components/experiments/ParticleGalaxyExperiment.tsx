"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { CanvasContainer } from "@/components/experiments/CanvasContainer";
import { ControlsPanel } from "@/components/experiments/ControlsPanel";
import { RangeSlider } from "@/components/experiments/RangeSlider";
import { InstructionsPanel } from "@/components/experiments/InstructionsPanel";
import { StatsPanel } from "@/components/experiments/StatsPanel";
import { ToggleButton } from "@/components/experiments/ToggleButton";

export default function ParticleGalaxyExperiment() {
  const [particleCount, setParticleCount] = useState<number>(5000);
  const [speed, setSpeed] = useState<number>(1);
  const [galaxyType, setGalaxyType] = useState<"spiral" | "elliptical" | "irregular">("spiral");
  const [mouseAttraction, setMouseAttraction] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const velocitiesRef = useRef<{ x: number; y: number; z: number }[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Controls (OrbitControls)
    const OrbitControls = require("three/examples/jsm/controls/OrbitControls").OrbitControls;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create galaxy particles
    const createGalaxy = () => {
      if (!sceneRef.current) return;

      const geometry = new THREE.BufferGeometry();
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      velocitiesRef.current = [];

      const centerColor = new THREE.Color(0x4cc9f0);
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
        }

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        const distance = Math.sqrt(x * x + y * y + z * z);
        const normalizedDistance = distance / 25;
        const color = centerColor.clone().lerp(outerColor, normalizedDistance);

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        velocitiesRef.current.push({
          x: -z * 0.01 * speed,
          y: 0,
          z: x * 0.01 * speed,
        });
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      if (particlesRef.current) {
        sceneRef.current.remove(particlesRef.current);
        geometry.dispose();
        material.dispose();
      }

      particlesRef.current = new THREE.Points(geometry, material);
      sceneRef.current.add(particlesRef.current);
    };

    createGalaxy();

    // Animation
    const animate = () => {
      if (!particlesRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];

        if (velocitiesRef.current[i]) {
          const distance = Math.sqrt(x * x + z * z);
          const gravityStrength = 0.0001 * speed;

          velocitiesRef.current[i].x -= (x / distance) * gravityStrength;
          velocitiesRef.current[i].z -= (z / distance) * gravityStrength;

          positions[i3] += velocitiesRef.current[i].x;
          positions[i3 + 2] += velocitiesRef.current[i].z;

          velocitiesRef.current[i].x *= 0.999;
          velocitiesRef.current[i].z *= 0.999;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += 0.001 * speed;

      controls.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    // Handle resize
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Dispose resources
      if (sceneRef.current && particlesRef.current) {
        sceneRef.current.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        if (Array.isArray(particlesRef.current.material)) {
          particlesRef.current.material.forEach((m) => m.dispose());
        } else {
          particlesRef.current.material.dispose();
        }
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [particleCount, galaxyType, speed]);

  // Update velocities when speed changes
  useEffect(() => {
    velocitiesRef.current = velocitiesRef.current.map((vel) => ({
      x: vel.x * (speed / Math.max(speed - 0.1, 0.1)),
      y: vel.y,
      z: vel.z * (speed / Math.max(speed - 0.1, 0.1)),
    }));
  }, [speed]);

  const instructions = [
    { icon: "🔵", text: "Drag to rotate camera", color: "#00B4D8" },
    { icon: "🟣", text: "Scroll to zoom in/out", color: "#9D4EDD" },
    { icon: "🟢", text: "Hover mouse to attract particles", color: "#06D6A0" },
  ];

  const stats = [
    {
      label: "PARTICLES",
      value: particleCount.toLocaleString(),
      color: "#4CC9F0",
    },
    {
      label: "TYPE",
      value: galaxyType.charAt(0).toUpperCase() + galaxyType.slice(1),
      color: "#9D4EDD",
    },
    {
      label: "FPS",
      value: "60",
      color: "#06D6A0",
    },
  ];

  const galaxyTypes = [
    { id: "spiral", name: "Spiral" },
    { id: "elliptical", name: "Elliptical" },
    { id: "irregular", name: "Irregular" },
  ];

  const handleGalaxyTypeChange = (type: "spiral" | "elliptical" | "irregular") => {
    setGalaxyType(type);
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-blue-900/20">
        <div ref={containerRef} className="w-full h-full" />

        <InstructionsPanel
          title="Galaxy Controls"
          icon={<span className="text-cyan-400">🌌</span>}
          instructions={instructions}
        />

        <StatsPanel stats={stats} />

        <ControlsPanel className="min-w-[400px]">
          <RangeSlider
            label={`Particles: ${particleCount.toLocaleString()}`}
            value={particleCount}
            min={1000}
            max={20000}
            step={1000}
            onChange={setParticleCount}
            accentColor="cyan"
          />

          <RangeSlider
            label={`Speed: ${speed.toFixed(1)}x`}
            value={speed}
            min={0.1}
            max={3}
            step={0.1}
            onChange={setSpeed}
            accentColor="purple"
          />

          <div className="flex gap-2">
            {galaxyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleGalaxyTypeChange(type.id as any)}
                className={`
                  px-3 py-2 rounded-lg text-sm capitalize transition-all
                  ${
                    galaxyType === type.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }
                `}
              >
                {type.name}
              </button>
            ))}
          </div>

          <ToggleButton
            label="Mouse Gravity"
            isActive={mouseAttraction}
            onChange={setMouseAttraction}
            activeColor="green"
          />
        </ControlsPanel>
      </div>
    </div>
  );
}
