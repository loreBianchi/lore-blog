"use client";

import { audioVisualizerOptions, waveformOptions } from "@/data/experiments";
import { ControlsBtnGroup } from "../shared/controls-btn-group";
import { ControlsContainer } from "../shared/controls-container";
import { PlayPauseButton } from "../shared/play-pause-button";
import { RangeSlider } from "../shared/range-slider";
import { VisualizerType, WaveForm } from "@/types/experiments";

type Props = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onSetVolume: (v: number) => void;
  frequency: number;
  onSetFrequency: (f: number) => void;
  waveform: WaveForm;
  onSetWaveform: (w: WaveForm) => void;
  visualizerType: VisualizerType;
  onSetVisualizerType: (v: VisualizerType) => void;
  showControls: boolean;
};

export default function Controls({
  isPlaying,
  onTogglePlay,
  volume,
  onSetVolume,
  frequency,
  onSetFrequency,
  waveform,
  onSetWaveform,
  visualizerType,
  onSetVisualizerType,
  showControls,
}: Props) {
  return (
    <ControlsContainer showControls={showControls} position="bottom-left" display="horizontal">
      <div className="flex flex-col gap-3 mr-2">
        <PlayPauseButton isPlaying={isPlaying} onToggle={onTogglePlay} />
        {/* Frequency */}
        <RangeSlider
          label="Frequency"
          value={frequency}
          min={100}
          max={1000}
          step={10}
          onChange={onSetFrequency}
        />
        {/* Volume */}
        <RangeSlider label="Volume" value={volume} min={0} max={1} step={0.01} onChange={onSetVolume} />
      </div>
      {/* Waveform */}
      <ControlsBtnGroup
        label="Waveform"
        size="sm"
        buttons={waveformOptions.map((w) => ({
          label: w.name,
          onClick: () => onSetWaveform(w.id),
          isActive: waveform === w.id,
        }))}
      />

      {/* Visualizer Type */}
      <ControlsBtnGroup
        size="sm"
        label="Visualizer Type"
        buttons={audioVisualizerOptions.map((viz) => ({
          label: viz.name,
          onClick: () => onSetVisualizerType(viz.id),
          isActive: visualizerType === viz.id,
        }))}
      />
    </ControlsContainer>
  );
}
