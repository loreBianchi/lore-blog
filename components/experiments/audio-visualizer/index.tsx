"use client";

import { useEffect, useRef, useState } from "react";
import { StatsPanel } from "../shared/stats-panel";
import { VisualizerType, WaveForm } from "@/types/experiments";
import {
  audioVisualizerInstructions,
} from "@/data/experiments";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { InstructionsPanel } from "../shared/instructions-panel";
import Controls from "./controls";
import { useCanvasControls } from "@/hooks/core/useCanvasControls";

export default function AudioVisualizerExperiment() {
  const { showControls, toggleControls, canvasExpanded, toggleCanvasExpand } = useCanvasControls();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<WaveForm>("sine");
  const [visualizerType, setVisualizerType] = useState<VisualizerType>("bars");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = volume;

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioContextRef.current || !analyserRef.current || !gainNodeRef.current) return;

    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      setIsPlaying(false);
    } else {
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.type = waveform;
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNodeRef.current);
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      oscillator.start();
      oscillatorRef.current = oscillator;

      visualize();
      setIsPlaying(true);
    }
  };

  // Update frequency
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = frequency;
    }
  }, [frequency]);

  // Update waveform
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.type = waveform;
    }
  }, [waveform]);

  // Visualization
  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (visualizerType === "bars") {
        drawBars(ctx, dataArray, canvas.width, canvas.height);
      } else if (visualizerType === "wave") {
        drawWave(ctx, dataArray, canvas.width, canvas.height);
      } else if (visualizerType === "circular") {
        drawCircular(ctx, dataArray, canvas.width, canvas.height);
      }
    };

    draw();
  };

  const drawBars = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
  ) => {
    const barWidth = (width / data.length) * 2.5;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height;
      const hue = (i / data.length) * 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  const drawWave = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
  ) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00ff88";
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 255.0;
      const y = v * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  const drawCircular = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const barHeight = (data[i] / 255) * radius;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const hue = (i / data.length) * 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const stats = [
    { label: "FREQ", value: `${frequency}Hz`, color: "#00ff88" },
    { label: "VOL", value: `${Math.round(volume * 100)}%`, color: "#ff00ff" },
    { label: "WAVE", value: waveform.toUpperCase(), color: "#00ffff" },
  ];

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl bg-black">
      <canvas ref={canvasRef} width={1200} height={600} className="w-full h-full" />

      <ToggleControlsBtn
        onToggleClick={toggleControls}
        isVisible={showControls}
        onExpandClick={toggleCanvasExpand}
        isExpanded={canvasExpanded}
        hasExpand
      />

      <InstructionsPanel
        instructions={audioVisualizerInstructions}
        showControls={showControls}
        title="Audio Visualizer"
      />

      <StatsPanel stats={stats} showControls={showControls} />

      <Controls
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        volume={volume}
        onSetVolume={setVolume}
        frequency={frequency}
        onSetFrequency={setFrequency}
        waveform={waveform}
        onSetWaveform={setWaveform}
        visualizerType={visualizerType}
        onSetVisualizerType={setVisualizerType}
        showControls={showControls}
      />
    </div>
  );
}
