"use client";

import p5 from "p5";
import { useRef, useCallback } from "react";
import { useP5 } from "@/hooks/useP5";
import Controls from "./controls";
import { GenArtSettings } from "@/types/experiment";
import { CanvasContainer } from "../shared/canvas-container";

export default function GenerativeArt() {
  const settings = useRef<GenArtSettings>({
    particleCount: 100,
    speed: 1,
    size: 2,
    pattern: "flow",
  });

  const regenerate = useRef<() => void>(() => {});

  const sketch = useCallback((p: p5) => {
    let particles: any[] = [];

    class Particle {
      pos = p.createVector(p.random(p.width), p.random(p.height));
      vel = p.createVector(0, 0);
      acc = p.createVector(0, 0);
      hue = p.random(360);

      update() {
        switch (settings.current.pattern) {
          case "flow":
            const angle =
              p.noise(
                this.pos.x * 0.01,
                this.pos.y * 0.01,
                p.frameCount * 0.01
              ) *
              p.TWO_PI *
              2;
            this.acc.add(
              p5.Vector.fromAngle(angle).mult(
                0.1 * settings.current.speed
              )
            );
            break;
        }

        this.vel.add(this.acc);
        this.vel.limit(2 * settings.current.speed);
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
        p.circle(this.pos.x, this.pos.y, settings.current.size);
        p.colorMode(p.RGB);
      }
    }

    const init = () => {
      particles = Array.from(
        { length: settings.current.particleCount },
        () => new Particle()
      );
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      init();
      regenerate.current = init;
      p.background(0);
    };

    p.draw = () => {
      p.background(0, 10);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  }, []);

  const { containerRef } = useP5({ sketch });

  return (
    <CanvasContainer>
      <div ref={containerRef} className="w-full h-full" />
      <Controls settings={settings} onRegenerate={() => regenerate.current()} />
    </CanvasContainer>
  );
}
