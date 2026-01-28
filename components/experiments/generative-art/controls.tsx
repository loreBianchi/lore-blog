"use client";

import { GenArtSettings } from "@/types/experiment";
import { useState } from "react";
import { RangeSlider } from "../shared/range-slider";
import { ControlsContainer } from "../shared/controls-container";

type Props = {
  settings: React.MutableRefObject<GenArtSettings>;
  onRegenerate: () => void;
};

export default function Controls({ settings, onRegenerate }: Props) {
  const [, forceRender] = useState(0);

  const update = <K extends keyof GenArtSettings>(key: K, value: GenArtSettings[K]) => {
    settings.current[key] = value;
    forceRender((v) => v + 1); // solo per UI
  };

  return (
    <ControlsContainer position="bottom-right">
      <RangeSlider
        label="Particles"
        value={settings.current.particleCount}
        min={50}
        max={300}
        step={10}
        onChange={(v) => update("particleCount", v)}
      />

      <RangeSlider
        label="Speed"
        value={settings.current.speed}
        min={0.1}
        max={3}
        step={0.1}
        onChange={(v) => update("speed", v)}
      />

      <RangeSlider
        label="Size"
        value={settings.current.size}
        min={1}
        max={10}
        step={1}
        onChange={(v) => update("size", v)}
      />

      <div className="mt-4 space-y-2">
        {(["flow", "spiral", "orbit", "explosion"] as const).map((p) => (
          <button
            key={p}
            onClick={() => update("pattern", p)}
            className={`w-full py-2 rounded text-xs border ${
              settings.current.pattern === p
                ? "bg-emerald-400/20 border-emerald-400 text-emerald-300"
                : "border-emerald-400/30 text-emerald-500"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={onRegenerate}
        className="mt-4 w-full py-2 rounded text-xs border border-emerald-400/30 hover:bg-white/10"
      >
        Regenerate
      </button>
    </ControlsContainer>
  );
}
