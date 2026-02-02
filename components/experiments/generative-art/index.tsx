"use client";

import p5 from "p5";
import { useRef, useCallback } from "react";
import { useP5 } from "@/hooks/useP5";
import Controls from "./controls";
import { CanvasContainer } from "../shared/canvas-container";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { InstructionsPanel } from "../shared/instructions-panel";
import { StatsPanel } from "../shared/stats-panel";
import { useCanvasControls } from "@/hooks/useCanvasControls";
import { generativeArtInstructions } from "@/data/experiments";
import { useSettingsWithStats } from "@/hooks/p5js/useSettingsWithStats";

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
        pos = p.createVector(p.random(p.width), p.random(p.height));
        vel = p.createVector(0, 0);
        acc = p.createVector(0, 0);
        hue = p.random(360);

        update() {
          const s = settingsRef.current;

          switch (s.pattern) {
            case "flow":
              const angle =
                p.noise(this.pos.x * 0.01, this.pos.y * 0.01, p.frameCount * 0.01) * p.TWO_PI * 2;
              this.acc.add(p5.Vector.fromAngle(angle).mult(0.1 * s.speed));
              break;
            case "spiral":
              const center = p.createVector(p.width / 2, p.height / 2);
              const dir = p5.Vector.sub(this.pos, center);
              const angleSpiral = dir.heading() + 0.1;
              this.acc.add(p5.Vector.fromAngle(angleSpiral).setMag(0.1 * s.speed));
              break;
            case "orbit":
              const centerOrbit = p.createVector(p.width / 2, p.height / 2);
              const dirOrbit = p5.Vector.sub(this.pos, centerOrbit);
              const angleOrbit = dirOrbit.heading() + p.HALF_PI;
              this.acc.add(p5.Vector.fromAngle(angleOrbit).setMag(0.1 * s.speed));
              break;
            case "explosion":
              const centerExplosion = p.createVector(p.width / 2, p.height / 2);
              const dirExplosion = p5.Vector.sub(this.pos, centerExplosion);
              this.acc.add(dirExplosion.setMag(0.1 * s.speed));
              break;
          }
          this.vel.add(this.acc);
          this.vel.limit(2 * s.speed);
          this.pos.add(this.vel);
          this.acc.mult(0);

          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.y > p.height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
        }

        draw() {
          p.colorMode(p.HSB);
          p.noStroke();
          p.fill(this.hue, 80, 100, 0.8);
          p.circle(this.pos.x, this.pos.y, settingsRef.current.size);
          p.colorMode(p.RGB);
        }
      }

      const init = () => {
        particles = Array.from({ length: settingsRef.current.particleCount }, () => new Particle());
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
  ); // RICREA lo sketch quando cambiano le impostazioni

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
        icon={<span className="text-cyan-400">🎨</span>}
        instructions={generativeArtInstructions}
        showControls={showControls}
      />
      <StatsPanel stats={stats} showControls={showControls} position="bottom-left" />
      <Controls
        settings={settings}
        onSettingsChange={updateSettings} // Passa la funzione
        onRegenerate={() => regenerate.current()}
        showControls={showControls}
      />
    </CanvasContainer>
  );
}
