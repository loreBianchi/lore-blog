import { useEffect, useRef } from "react";
import p5 from "p5";

export interface P5Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: number[];
  life: number;
  maxLife: number;
}

export type P5ParticleGenerator = (
  p: p5,
  count: number,
  w: number,
  h: number
) => P5Particle[];

export type P5ParticleUpdater = (
  p: p5,
  particle: P5Particle
) => void;

export type P5ParticleRenderer = (
  p: p5,
  particle: P5Particle
) => void;

export function useP5Particles(
  p: p5 | null,
  config: {
    count: number;
    generator: P5ParticleGenerator;
    updater: P5ParticleUpdater;
    renderer: P5ParticleRenderer;
  }
) {
  const particlesRef = useRef<P5Particle[]>([]);

  // init
  useEffect(() => {
    if (!p) return;
    particlesRef.current = config.generator(p, config.count, p.width, p.height);
  }, [p, config.count, config.generator]);

  // 🔥 HOOK NEL DRAW LOOP
  useEffect(() => {
    if (!p) return;

    const baseDraw = p.draw;

    p.draw = () => {
      baseDraw?.();

      for (const particle of particlesRef.current) {
        config.updater(p, particle);
        config.renderer(p, particle);
      }
    };

    return () => {
      p.draw = baseDraw!;
    };
  }, [p, config.updater, config.renderer]);

  return {
    regenerate() {
      if (!p) return;
      particlesRef.current = config.generator(
        p,
        config.count,
        p.width,
        p.height
      );
    },
  };
}
