"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioVisualizerExperiment() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<"sine" | "square" | "sawtooth" | "triangle">("sine");
  const [visualizerType, setVisualizerType] = useState<"bars" | "wave" | "circular">("bars");
  const [showControls, setShowControls] = useState(true);

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

  const drawBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
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

  const drawWave = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
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

  const drawCircular = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
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

  const waveforms = [
    { id: "sine", name: "Sine" },
    { id: "square", name: "Square" },
    { id: "sawtooth", name: "Sawtooth" },
    { id: "triangle", name: "Triangle" },
  ];

  const visualizers = [
    { id: "bars", name: "Bars" },
    { id: "wave", name: "Wave" },
    { id: "circular", name: "Circular" },
  ];

  const instructions = [
    { icon: "🎵", text: "Press play to generate audio", color: "#00ff88" },
    { icon: "🎚️", text: "Adjust frequency and volume", color: "#ff00ff" },
    { icon: "📊", text: "Switch visualization modes", color: "#00ffff" },
  ];

  const stats = [
    { label: "FREQ", value: `${frequency}Hz`, color: "#00ff88" },
    { label: "VOL", value: `${Math.round(volume * 100)}%`, color: "#ff00ff" },
    { label: "WAVE", value: waveform.toUpperCase(), color: "#00ffff" },
  ];

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl bg-black">
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        className="w-full h-full"
      />

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-green-400/30 hover:bg-black/80 transition-all text-green-400/80 hover:text-green-400 text-sm"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </button>

      {/* Instructions Panel */}
      <div
        className={`absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 max-w-xs border border-green-400/30 z-10 transition-all duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
          <span>🎧</span> Audio Visualizer
        </h3>
        <ul className="text-green-400/80 text-sm space-y-1">
          {instructions.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats Panel */}
      <div
        className={`absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-green-400/30 z-10 transition-all duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-2">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-green-400/60 text-xs">{stat.label}</div>
              <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Panel */}
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-lg border border-green-400/30 rounded-2xl p-4 flex flex-col gap-3 z-10 transition-all duration-300 max-w-[280px] ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center border ${
            isPlaying
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : "bg-white/10 text-white/60 hover:bg-white/20 border-white/20"
          }`}
        >
          {isPlaying ? (
            <>
              <div className="w-1.5 h-5 bg-green-300 rounded-sm" />
              <div className="w-1.5 h-5 bg-green-300 rounded-sm" />
              <span className="ml-1 text-sm">Pause</span>
            </>
          ) : (
            <>
              <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-1" />
              <span className="ml-2 text-sm">Play</span>
            </>
          )}
        </button>

        {/* Frequency */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-green-400/70 text-sm">Frequency</span>
            <span className="text-green-400 text-sm font-bold">{frequency}Hz</span>
          </div>
          <input
            type="range"
            min={100}
            max={1000}
            step={10}
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>

        {/* Volume */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-green-400/70 text-sm">Volume</span>
            <span className="text-pink-400 text-sm font-bold">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>

        {/* Waveform */}
        <div className="flex flex-col gap-2">
          <span className="text-green-400/70 text-sm">Waveform</span>
          <div className="flex flex-col gap-1">
            {waveforms.map((wave) => (
              <button
                key={wave.id}
                onClick={() => setWaveform(wave.id as any)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-all border ${
                  waveform === wave.id
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent"
                }`}
              >
                {wave.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer Type */}
        <div className="flex flex-col gap-2">
          <span className="text-green-400/70 text-sm">Visualizer</span>
          <div className="flex flex-col gap-1">
            {visualizers.map((viz) => (
              <button
                key={viz.id}
                onClick={() => setVisualizerType(viz.id as any)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-all border ${
                  visualizerType === viz.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent"
                }`}
              >
                {viz.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}