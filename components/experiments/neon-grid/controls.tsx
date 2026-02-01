import { colorOptions } from "@/data/colors";
import { ControlsContainer } from "../shared/controls-container";
import { PlayPauseButton } from "../shared/play-pause-button";
import { RangeSlider } from "../shared/range-slider";
import { ColorPicker } from "../shared/color-picker";
import { ResetButton } from "../shared/reset-button";
import { ColorKey } from "@/types/colors";

interface ControlsProps {
  showControls: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  gridSize: number;
  onGridSizeChange: (value: number) => void;
  neonIntensity: number;
  onNeonIntensityChange: (value: number) => void;
  colorScheme: ColorKey;
  onColorSchemeChange: (id: ColorKey) => void;
  onReset: () => void;
}

export default function Controls({
  showControls,
  isPlaying,
  onTogglePlay,
  gridSize,
  onGridSizeChange,
  neonIntensity,
  onNeonIntensityChange,
  colorScheme,
  onColorSchemeChange,
  onReset,
}: ControlsProps) {
  return (
    <ControlsContainer showControls={showControls} position="bottom-left">
      {/* Play/Pause */}
      <PlayPauseButton isPlaying={isPlaying} onToggle={onTogglePlay} />
      {/* Grid Size Slider */}
      <RangeSlider
        label="Grid Size"
        value={gridSize}
        min={5}
        max={20}
        step={1}
        onChange={onGridSizeChange}
        accentColor="cyan"
      />
      {/* Neon Intensity */}
      <RangeSlider
        label="Glow"
        value={neonIntensity}
        min={0.5}
        max={5}
        step={0.1}
        onChange={onNeonIntensityChange}
        accentColor="pink"
      />
      {/* Color Scheme */}
      <ColorPicker
        colors={colorOptions}
        selected={colorScheme}
        className="justify-center"
        onChange={onColorSchemeChange}
      />

      <ResetButton onReset={onReset} className="mt-2" />
    </ControlsContainer>
  );
}
