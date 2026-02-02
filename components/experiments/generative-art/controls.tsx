"use client";

import { GenArtSettings } from "@/types/experiments";
import { RangeSlider } from "../shared/range-slider";
import { ControlsContainer } from "../shared/controls-container";
import { ControlsBtnGroup } from "../shared/controls-btn-group";

type Props = {
  settings: GenArtSettings;
  onRegenerate: () => void;
  onSettingsChange: (updates: Partial<GenArtSettings>) => void;
  showControls: boolean;
};

export default function Controls({
  settings,
  onRegenerate,
  onSettingsChange,
  showControls,
}: Props) {
  // Rimuovi forceRender, usa direttamente onSettingsChange

  return (
    <ControlsContainer showControls={showControls} position="bottom-right">
      <RangeSlider
        label="Particles"
        value={settings.particleCount}
        min={50}
        max={300}
        step={10}
        onChange={(v) => onSettingsChange({ particleCount: v })}
      />

      <RangeSlider
        label="Speed"
        value={settings.speed}
        min={0.1}
        max={3}
        step={0.1}
        onChange={(v) => onSettingsChange({ speed: v })}
      />

      <RangeSlider
        label="Size"
        value={settings.size}
        min={1}
        max={10}
        step={1}
        onChange={(v) => onSettingsChange({ size: v })}
      />

      <ControlsBtnGroup
        label="Pattern"
        size="sm"
        buttons={(["flow", "spiral", "orbit", "explosion"] as const).map((p) => ({
          label: p,
          onClick: () => onSettingsChange({ pattern: p }),
          isActive: settings.pattern === p,
        }))}
      />
    </ControlsContainer>
  );
}
