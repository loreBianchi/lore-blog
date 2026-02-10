"use client";

import p5 from "p5";
import { useRef, useCallback } from "react";
import { useP5, useSettingsWithStats } from "@/hooks/p5js";
import Controls from "./controls";
import { CanvasContainer } from "../shared/canvas-container";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { InstructionsPanel } from "../shared/instructions-panel";
import { StatsPanel } from "../shared/stats-panel";
import { useCanvasControls } from "@/hooks/core/useCanvasControls";
import { generativeArtInstructions } from "@/data/experiments";

export default function GenerativeArt() {
  const { showControls, toggleControls, canvasExpanded, toggleCanvasExpand } = useCanvasControls();

  const { settings, stats, updateSettings, settingsVersion } = useSettingsWithStats({
    particleCount: 100,
    speed: 1,
    size: 2,
    pattern: "flow",
  });

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const regenerate = useRef<() => void>(() => {});

  const sketch = useCallback(
    (p: p5) => {
      let particles: any[] = [];

      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        hue: number;
        explosionAngle: number;
        birthTime: number;
        spiralAngleOffset: number;
        age: number;

        constructor(delayGroup: number = 0, spiralAngleOffset: number = 0) {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.hue = p.random(360);
          this.explosionAngle = p.random(p.TWO_PI);
          this.birthTime = delayGroup;
          this.spiralAngleOffset = spiralAngleOffset;
          this.age = 0;
        }

        reset() {
          const s = settingsRef.current;
          const center = p.createVector(p.width / 2, p.height / 2);
          
          if (s.pattern === "spiral") {
            this.age = 0;
            this.birthTime = p.frameCount;
            this.pos = center.copy();
          } else {
            this.pos = center.copy();
          }
          
          this.vel.set(0, 0);
          this.acc.set(0, 0);
          this.explosionAngle = p.random(p.TWO_PI);
        }

        update() {
          const s = settingsRef.current;

          switch (s.pattern) {
            case "flow":
              const angle =
                p.noise(this.pos.x * 0.01, this.pos.y * 0.01, p.frameCount * 0.01) * p.TWO_PI * 2;
              this.acc.add(p5.Vector.fromAngle(angle).mult(0.1 * s.speed));
              break;
            case "spiral":
              if (p.frameCount >= this.birthTime) {
                this.age++;
                const spiralRadius = this.age * 0.5 * s.speed;
                const currentAngle = this.spiralAngleOffset + spiralRadius * 0.02;
                const center = p.createVector(p.width / 2, p.height / 2);
                const x = center.x + p.cos(currentAngle) * spiralRadius;
                const y = center.y + p.sin(currentAngle) * spiralRadius;
                this.pos.x = x;
                this.pos.y = y;
              }
              break;
            case "orbit":
              const centerOrbit = p.createVector(p.width / 2, p.height / 2);
              const dirOrbit = p5.Vector.sub(this.pos, centerOrbit);
              const angleOrbit = dirOrbit.heading() + p.HALF_PI;
              this.acc.add(p5.Vector.fromAngle(angleOrbit).setMag(0.1 * s.speed));
              break;
            case "explosion":
              if (p.frameCount >= this.birthTime) {
                const explosionForce = p5.Vector.fromAngle(this.explosionAngle).mult(0.15 * s.speed);
                this.acc.add(explosionForce);
              }
              break;
          }
          
          if (s.pattern !== "spiral") {
            this.vel.add(this.acc);
            this.vel.limit(2 * s.speed);
            this.pos.add(this.vel);
            this.acc.mult(0);
          }

          if (s.pattern === "explosion" || s.pattern === "spiral") {
            if (
              this.pos.x > p.width ||
              this.pos.x < 0 ||
              this.pos.y > p.height ||
              this.pos.y < 0
            ) {
              this.reset();
            }
          } else {
            if (this.pos.x > p.width) this.pos.x = 0;
            if (this.pos.x < 0) this.pos.x = p.width;
            if (this.pos.y > p.height) this.pos.y = 0;
            if (this.pos.y < 0) this.pos.y = p.height;
          }
        }

        draw() {
          const s = settingsRef.current;
          // Per explosion e spiral, disegna solo se è nato
          if ((s.pattern === "explosion" || s.pattern === "spiral") && p.frameCount < this.birthTime) {
            return;
          }
          
          // Per spiral, disegna solo se ha iniziato a muoversi (age > 0)
          if (s.pattern === "spiral" && this.age === 0) {
            return;
          }

          p.colorMode(p.HSB);
          p.noStroke();
          p.fill(this.hue, 80, 100, 0.8);
          p.circle(this.pos.x, this.pos.y, s.size);
          p.colorMode(p.RGB);
        }
      }

      const init = () => {
        const particleCount = settingsRef.current.particleCount;
        const s = settingsRef.current;
        
        if (s.pattern === "explosion") {
          const groupSize = 10;
          const groupDelay = 20;
          
          particles = Array.from({ length: particleCount }, (_, i) => {
            const groupIndex = Math.floor(i / groupSize);
            const delayFrames = p.frameCount + groupIndex * groupDelay;
            const particle = new Particle(delayFrames, 0);
            const center = p.createVector(p.width / 2, p.height / 2);
            particle.pos = center.copy();
            return particle;
          });
        } else if (s.pattern === "spiral") {
          const delayPerParticle = 2;
          
          particles = Array.from({ length: particleCount }, (_, i) => {
            const angleOffset = (p.TWO_PI / particleCount) * i;
            const delayFrames = p.frameCount + i * delayPerParticle;
            const particle = new Particle(delayFrames, angleOffset);
            const center = p.createVector(p.width / 2, p.height / 2);
            particle.pos = center.copy();
            return particle;
          });
        } else {
          particles = Array.from({ length: particleCount }, () => new Particle(0, 0));
        }
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        init();
        regenerate.current = init;
        p.background(0);
      };

      p.draw = () => {
        p.background(0, 10);
        particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    },
    [settingsVersion],
  );

  const { containerRef } = useP5({ sketch });

  return (
    <CanvasContainer isFullscreen={canvasExpanded}>
      <div ref={containerRef} className="w-full h-full" />
      <ToggleControlsBtn
        onToggleClick={toggleControls}
        isVisible={showControls}
        onExpandClick={toggleCanvasExpand}
        isExpanded={canvasExpanded}
        hasExpand
      />
      <InstructionsPanel
        title="Generative Art Experiment"
        instructions={generativeArtInstructions}
        showControls={showControls}
      />
      <StatsPanel stats={stats} showControls={showControls} position="bottom-left" />
      <Controls
        settings={settings}
        onSettingsChange={updateSettings}
        onRegenerate={() => regenerate.current()}
        showControls={showControls}
      />
    </CanvasContainer>
  );
}
