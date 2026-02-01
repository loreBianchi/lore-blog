import { useEffect, useRef } from "react";
import p5 from "p5";

export function useP5Canvas({
  container,
  sketch,
}: {
  container: React.RefObject<HTMLElement>;
  sketch: (p: p5) => void;
}) {
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!container.current || instanceRef.current) return;

    instanceRef.current = new p5((p) => sketch(p), container.current);

    return () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [container, sketch]);

  return {
    instance: instanceRef.current,
    restart: () => {
      if (!container.current) return;
      instanceRef.current?.remove();
      instanceRef.current = new p5((p) => sketch(p), container.current);
    },
  };
}
