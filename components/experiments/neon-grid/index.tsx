"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { useCanvas, useAnimation } from "@/hooks/core";
import { useThreeCanvas, useOrbitControls, useParticles, useLights } from "@/hooks/threejs";
import { useCanvasControls } from "@/hooks/useCanvasControls";
import { CanvasContainer } from "../shared/canvas-container";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { InstructionsPanel } from "../shared/instructions-panel";
import { StatsPanel } from "../shared/stats-panel";
import { neonGridInstructions } from "@/data/experiments";
import { colorsSets } from "@/data/colors";
import { ColorKey } from "@/types/colors";
import Controls from "./controls";

export function NeonGridExperiment() {
  const { showControls, toggleControls, canvasExpanded, toggleCanvasExpand } = useCanvasControls();

  const [isPlaying, setIsPlaying] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [neonIntensity, setNeonIntensity] = useState(2);
  const [colorScheme, setColorScheme] = useState<ColorKey>("purple");

  const boxesRef = useRef<THREE.Mesh[]>([]);
  const gridRef = useRef<THREE.Mesh[][]>([]);

  // LEVEL 1: Core - Canvas setup
  const { containerRef } = useCanvas({
    width: "100%",
    height: "100vh",
  });

  // LEVEL 2: Module - Three.js setup
  const three = useThreeCanvas({
    container: containerRef,
    camera: {
      position: [12, 20, 12],
      fov: 75,
    },
    renderer: {
      antialias: true,
      shadows: true,
      shadowMapType: THREE.PCFSoftShadowMap,
    },
    scene: {
      background: 0x000000,
      fog: {
        color: 0x000000,
        near: 10,
        far: 25,
      },
    },
  });

  // LEVEL 3: Features - Orbit controls
  useOrbitControls(three.camera, three.canvas, {
    rotationSpeed: 0.005,
    minDistance: 5,
    maxDistance: 30,
  });

  // LEVEL 3: Features - Lights
  useLights(three.scene, {
    ambient: {
      color: 0xffffff,
      intensity: 0.2,
    },
    directional: {
      color: 0xffffff,
      intensity: 0.8,
      position: [10, 20, 15],
      castShadow: true,
    },
  });

  // LEVEL 3: Features - Particles (ambient)
  const particles = useParticles(three.scene, {
    count: 500,
    size: 0.05,
    opacity: 0.6,
    transparent: true,
    vertexColors: false,
    color: colorsSets[colorScheme]?.glow || 0x00ffff,
    generator: useCallback((positions) => {
      for (let i = 0; i < 500; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 30;
        positions[i3 + 1] = (Math.random() - 0.5) * 30;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;
      }
    }, []),
  });

  // Update particle color when color scheme changes
  useEffect(() => {
    if (particles.points) {
      const currentColors = colorsSets[colorScheme];
      (particles.points.material as THREE.PointsMaterial).color.set(currentColors.glow);
    }
  }, [colorScheme, particles.points]);

  // Create grid of boxes (custom 3D objects)
  useEffect(() => {
    if (!three.scene) return;

    const currentColors = colorsSets[colorScheme];

    // Remove old boxes
    boxesRef.current.forEach((box) => {
      three.scene?.remove(box);
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

        // Store original position and indices
        (box as any).originalY = 0;
        (box as any).originalX = x;
        (box as any).originalZ = z;

        three.scene.add(box);
        boxesRef.current.push(box);
        gridRef.current[x][z] = box;
      }
    }

    return () => {
      boxesRef.current.forEach((box) => {
        box.geometry.dispose();
        if (Array.isArray(box.material)) {
          box.material.forEach((m) => m.dispose());
        } else {
          box.material.dispose();
        }
      });
    };
  }, [gridSize, colorScheme, neonIntensity, three.scene]);

  // LEVEL 1: Core - Animation loop
  useAnimation({
    isPlaying,
    onFrame: useCallback(
      (time) => {
        // Animate boxes
        boxesRef.current.forEach((box, i) => {
          const x = (box as any).originalX;
          const z = (box as any).originalZ;

          // Float animation
          const float = Math.sin(time * 0.5 + x * 0.3 + z * 0.3) * 0.3;
          box.position.y = (box as any).originalY + float;

          // Pulse animation
          const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
          (box.material as THREE.MeshStandardMaterial).emissiveIntensity =
            neonIntensity * (0.3 + pulse * 0.2);

          // Rotation
          box.rotation.y = time * 0.2;
        });

        // Animate particles
        if (particles.points) {
          particles.points.rotation.y = time * 0.1;
        }

        // Render scene
        if (three.scene && three.camera && three.renderer) {
          three.render();
        }
      },
      [neonIntensity, particles.points, three],
    ),
  });

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
      inline: true,
    },
  ];

  const handleReset = () => {
    setGridSize(10);
    setNeonIntensity(2);
    setColorScheme("purple");
    setIsPlaying(true);
  };

  return (
    <CanvasContainer isFullscreen={canvasExpanded}>
      <div ref={containerRef} />

      <ToggleControlsBtn
        onToggleClick={toggleControls}
        isVisible={showControls}
        onExpandClick={toggleCanvasExpand}
        isExpanded={canvasExpanded}
        hasExpand
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
        onColorSchemeChange={(id) => setColorScheme(id as ColorKey)}
        onReset={handleReset}
      />
    </CanvasContainer>
  );
}