"use client";

import { useState, useCallback } from "react";
import * as THREE from "three";
import { useCanvas, useAnimation } from "@/hooks/core";
import { useThreeCanvas, useOrbitControls, useParticles } from "@/hooks/threejs";
import { useCanvasControls } from "@/hooks/useCanvasControls";
import { CanvasContainer } from "../shared/canvas-container";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { InstructionsPanel } from "../shared/instructions-panel";
import { galaxyTypes, instructions } from "@/data/experiments";
import { ControlsBtnGroup } from "../shared/controls-btn-group";
import { ColorPicker } from "../shared/color-picker";
import { colorOptions, colorMap } from "@/data/colors";
import { ControlsContainer } from "../shared/controls-container";
import { PlayPauseButton } from "../shared/play-pause-button";
import { RangeSlider } from "../shared/range-slider";
import { ColorKey } from "@/types/colors";
import { StatsPanel } from "../shared/stats-panel";

export function ParticleGalaxyExperiment() {
  const { showControls, toggleControls, canvasExpanded, toggleCanvasExpand } = useCanvasControls();

  const [isPlaying, setIsPlaying] = useState(true);
  const [particleCount, setParticleCount] = useState(3000);
  const [speed, setSpeed] = useState(1);
  const [colorScheme, setColorScheme] = useState<ColorKey>("cyan");
  const [galaxyType, setGalaxyType] = useState("spiral");

  // LEVEL 1: Core - Canvas setup
  const { containerRef } = useCanvas({
    width: "100%",
    height: "100vh",
  });

  // LEVEL 2: Module - Three.js setup
  const three = useThreeCanvas({
    container: containerRef,
    camera: {
      position: [0, 10, 30],
      fov: 75,
    },
    renderer: {
      antialias: true,
    },
    scene: {
      background: 0x000010,
    },
  });

  // LEVEL 3: Features - Orbit controls
  useOrbitControls(three.camera, three.canvas, {
    rotationSpeed: 0.005,
    minDistance: 10,
    maxDistance: 100,
  });

  // LEVEL 3: Features - Particle system
  const particles = useParticles(three.scene, {
    count: particleCount,
    size: 0.15,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    generator: useCallback(
      (positions, colors) => {
        // Get colors from color scheme
        const color = colorMap[colorScheme] || colorMap.cyan;
        const outerColor = new THREE.Color(0x7209b7);

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let x, y, z;

          // Different galaxy shapes based on type
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

          if (colors) {
            const distance = Math.sqrt(x * x + y * y + z * z);
            const normalizedDistance = distance / 25;
            const particleColor = color.clone().lerp(outerColor, normalizedDistance);

            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;
          }
        }
      },
      [particleCount, colorScheme, galaxyType],
    ),
  });

  // LEVEL 1: Core - Animation loop
  useAnimation({
    isPlaying,
    onFrame: useCallback(
      (time) => {
        // Animate particles with speed multiplier
        if (particles.points) {
          particles.points.rotation.y += 0.001 * speed;
        }

        // Render scene
        if (three.scene && three.camera && three.renderer) {
          three.render();
        }
      },
      [particles.points, three, speed],
    ),
  });

  const stats = [
    {
      label: "PARTICLES",
      value: particleCount.toLocaleString(),
      color: "#4CC9F0",
    },
    { label: "SPEED", value: `${speed.toFixed(1)}x`, color: "#9D4EDD" },
    { label: "FPS", value: "60", color: "#06D6A0" },
  ];

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
        title="Particle Galaxy Experiment"
        instructions={instructions}
        showControls={showControls}
      />

      <StatsPanel stats={stats} showControls={showControls} />

      <ControlsContainer showControls={showControls} position="bottom-left">
        <PlayPauseButton isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />

        <RangeSlider
          label="Particles"
          value={particleCount}
          min={1000}
          max={10000}
          step={500}
          onChange={(v) => setParticleCount(v)}
          accentColor="cyan"
        />

        <RangeSlider
          label="Rotation Speed"
          value={speed}
          min={0.1}
          max={5}
          step={0.1}
          onChange={(v) => setSpeed(v)}
          accentColor="purple"
        />

        <ColorPicker colors={colorOptions} selected={colorScheme} onChange={(id) => setColorScheme(id)} />

        <ControlsBtnGroup
          label="Galaxy Type"
          buttons={galaxyTypes.map((type) => ({
            label: type.name,
            onClick: () => setGalaxyType(type.id),
            isActive: galaxyType === type.id,
          }))}
        />
      </ControlsContainer>
    </CanvasContainer>
  );
}