"use client";

import { useEffect, useRef } from "react";
import p5 from "p5";

type UseP5Props = {
  sketch: (p: p5) => void;
};

export function useP5({ sketch }: UseP5Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    instanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [sketch]);

  return {
    containerRef,
    p5: instanceRef,
  };
}
