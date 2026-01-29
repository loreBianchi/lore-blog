"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { InstructionsPanel } from "../shared/instructions-panel";
import { instructions } from "@/data/experiments";
import { CanvasContainer } from "../shared/canvas-container";
import { ResetButton } from "../shared/reset-button";
import { ControlsContainer } from "../shared/controls-container";
import { RangeSlider } from "../shared/range-slider";
import { ToggleControlsBtn } from "../shared/toggle-controls-btn";
import { StatsPanel } from "../shared/stats-panel";
import { ControlsBtnGroup } from "../shared/controls-btn-group";
import { ColorPicker } from "../shared/color-picker";
import { ColorKey } from "@/types/colors";
import { colorMap, colorOptions } from "@/data/colors";

export default function ASCIIArtExperiment() {
  const [text, setText] = useState("ASCII 3D");
  const [fontSize, setFontSize] = useState(1.5);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [invert, setInvert] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [characters, setCharacters] = useState(" .:-+*=%@#");
  const [colorScheme, setColorScheme] = useState<ColorKey>("cyan");
  const [fps, setFps] = useState(60);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(undefined);
  const cameraRef = useRef<THREE.PerspectiveCamera>(undefined);
  const rendererRef = useRef<THREE.WebGLRenderer>(undefined);
  const meshRef = useRef<THREE.Mesh>(undefined);
  const animationIdRef = useRef<number>(undefined);
  // @ts-ignore
  const fontRef = useRef<THREE.Font>();

  const characterSets = [
    { id: "default", name: "Default", chars: " .:-+*=%@#" },
    { id: "simple", name: "Simple", chars: " .:░▒▓█" },
    {
      id: "dense",
      name: "Dense",
      chars: " .':;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    },
    { id: "binary", name: "Binary", chars: "01" },
    { id: "blocks", name: "Blocks", chars: " ░▒▓█" },
  ];

  // --- FPS counter ---
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    const updateFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFps);
    };
    updateFps();
  }, []);

  // --- Initialize scene, camera, renderer ---
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(invert ? 0xffffff : 0x000000, 1);
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(10, 10, 10);
    const pointLight2 = new THREE.PointLight(
      new THREE.Color(colorOptions[colorScheme]?.color ?? "#00ffff"),
      0.5,
    );
    pointLight2.position.set(-10, -10, -10);
    scene.add(ambientLight, pointLight1, pointLight2);

    // Load font
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      fontRef.current = font;
      createOrUpdateMesh();
    });

    // Animation loop
    const animate = () => {
      if (meshRef.current && isAutoRotate) {
        meshRef.current.rotation.x += 0.005 * rotationSpeed;
        meshRef.current.rotation.y += 0.01 * rotationSpeed;
      }
      if (renderer && scene && camera) renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
      containerRef.current!.innerHTML = "";
    };
  }, []);

  // --- Create or update mesh ---
  const createOrUpdateMesh = () => {
    if (!fontRef.current || !sceneRef.current) return;

    // Se il mesh esiste già, aggiorna solo il colore
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(
        invert ? 0x000000 : (colorOptions[colorScheme]?.color ?? "#00ffff"),
      );
      return;
    }

    // Crea nuovo mesh
    const geometry = new TextGeometry(text, {
      font: fontRef.current,
      size: fontSize,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    geometry.computeBoundingBox();
    const centerOffset = geometry.boundingBox
      ? -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
      : 0;
    geometry.translate(centerOffset, 0, 0);

    const material = new THREE.MeshStandardMaterial({
      color: invert
        ? new THREE.Color(0x000000)
        : (colorMap[colorScheme] ?? new THREE.Color(0x00ffff)),
      metalness: 0.3,
      roughness: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);
    meshRef.current = mesh;
  };

  // --- Aggiorna mesh solo se testo o dimensione cambiano ---
  useEffect(() => {
    if (meshRef.current) {
      sceneRef.current?.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
      meshRef.current = undefined;
    }
    createOrUpdateMesh();
  }, [text, fontSize]);

  // --- Aggiorna colore mesh quando cambia colorScheme o invert ---
  useEffect(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(invert ? new THREE.Color(0x000000) : colorMap[colorScheme]);
      mat.needsUpdate = true;
    }
  }, [colorScheme, invert]);
  // --- Aggiorna background invert ---
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setClearColor(invert ? 0xffffff : 0x000000, 1);
    }
  }, [invert]);

  const handleReset = () => {
    setText("ASCII 3D");
    setFontSize(1.5);
    setRotationSpeed(1);
    setInvert(false);
    setCharacters(" .:-+*=%@#");
    setIsAutoRotate(true);
  };

  const stats = [
    {
      label: "CHARS",
      value: characters.length,
      color: colorOptions[colorScheme]?.color ?? "#00ffff",
    },
    { label: "FPS", value: fps, color: "#ff00ff" },
    { label: "SCALE", value: `${fontSize}x`, color: "#00ffff" },
  ];

  return (
    <CanvasContainer theme="unset">
      <div ref={containerRef} className="w-full h-full" />

      <ToggleControlsBtn onClick={() => setShowControls(!showControls)} />

      <InstructionsPanel
        title="ASCII 3D Experiment"
        icon={<span className="text-cyan-400">💠</span>}
        instructions={instructions}
        showControls={showControls}
      />

      <StatsPanel stats={stats} showControls={showControls} />

      <ControlsContainer position="bottom-left" showControls={showControls} display="horizontal">
        <div className="flex flex-col gap-2">
          <span className="text-white/70 text-sm">Text</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            maxLength={10}
            className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 
                focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
                text-center font-mono"
          />
          <RangeSlider
            label="Font Size"
            value={fontSize}
            min={0.5}
            max={3}
            step={0.1}
            onChange={setFontSize}
          />
          <RangeSlider
            label="Rotation Speed"
            value={rotationSpeed}
            min={0.5}
            max={3}
            step={0.1}
            onChange={setRotationSpeed}
          />
        </div>

        <ColorPicker
          display="grid"
          colors={colorOptions}
          selected={colorScheme}
          className="justify-center"
          onChange={setColorScheme}
        />

        <ControlsBtnGroup
          label="Character Set"
          size="sm"
          buttons={characterSets.map((set) => ({
            label: set.name,
            onClick: () => setCharacters(set.chars),
            isActive: characters === set.chars,
          }))}
        />

        <div className="flex gap-2">
          <button
            onClick={() => setInvert(!invert)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all border ${
              invert
                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent"
            }`}
          >
            Invert
          </button>
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all border ${
              isAutoRotate
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent"
            }`}
          >
            Auto Rotate
          </button>
        </div>

        <ResetButton onReset={handleReset} />
      </ControlsContainer>
    </CanvasContainer>
  );
}
