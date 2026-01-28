"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default function ASCIIArtExperiment() {
  const [text, setText] = useState("ASCII 3D");
  const [fontSize, setFontSize] = useState(1.5);
  const [renderScale, setRenderScale] = useState(5);
  const [color, setColor] = useState("#00ff88");
  const [invert, setInvert] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [characters, setCharacters] = useState(" .:-+*=%@#");
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [fps, setFps] = useState(60);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<any>(null);

  const characterSets = [
    { id: "default", name: "Default", chars: " .:-+*=%@#" },
    { id: "simple", name: "Simple", chars: " .:░▒▓█" },
    { id: "dense", name: "Dense", chars: " .':;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$" },
    { id: "binary", name: "Binary", chars: "01" },
    { id: "blocks", name: "Blocks", chars: " ░▒▓█" },
  ];

  const colorSchemes = [
    { id: "neon-green", name: "Neon Green", color: "#00ff88" },
    { id: "cyberpunk", name: "Cyberpunk", color: "#ff00ff" },
    { id: "matrix", name: "Matrix", color: "#00ff00" },
    { id: "retro", name: "Retro", color: "#ff8800" },
    { id: "ice", name: "Ice", color: "#00ffff" },
  ];

  // FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFps = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(updateFps);
    };

    const animationId = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(invert ? 0xffffff : 0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(new THREE.Color(color), 0.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Load font and create 3D text
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      if (!sceneRef.current) return;

      // Remove old mesh if exists
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        if (Array.isArray(meshRef.current.material)) {
          meshRef.current.material.forEach((m) => m.dispose());
        } else {
          (meshRef.current.material as THREE.Material).dispose();
        }
      }
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: fontSize,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      // Center the text geometry
      textGeometry.computeBoundingBox();
      const centerOffset = textGeometry.boundingBox
        ? -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)
        : 0;
      textGeometry.translate(centerOffset, 0, 0);

      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(textGeometry, material);
      sceneRef.current.add(mesh);
      meshRef.current = mesh;
    });

    // Manual OrbitControls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const rotSpeed = 0.005;
    const zoomSpeed = 0.1;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cameraRef.current) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const spherical = {
        radius: Math.sqrt(
          camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
        ),
        theta: Math.atan2(camera.position.x, camera.position.z),
        phi: Math.acos(
          camera.position.y /
            Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2)
        ),
      };

      spherical.theta -= deltaX * rotSpeed;
      spherical.phi -= deltaY * rotSpeed;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;

      const delta = e.deltaY * zoomSpeed;
      const currentDistance = Math.sqrt(
        camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
      );
      const newDistance = Math.max(3, Math.min(50, currentDistance + delta));
      const scale = newDistance / currentDistance;

      camera.position.multiplyScalar(scale);
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    controlsRef.current = {
      cleanup: () => {
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("mouseup", handleMouseUp);
        renderer.domElement.removeEventListener("wheel", handleWheel);
      },
    };

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (controlsRef.current?.cleanup) {
        controlsRef.current.cleanup();
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [invert, color, text, fontSize]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      if (meshRef.current && isAutoRotate) {
        meshRef.current.rotation.x += 0.005 * rotationSpeed;
        meshRef.current.rotation.y += 0.01 * rotationSpeed;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isAutoRotate, rotationSpeed]);

  const handleReset = () => {
    setText("ASCII 3D");
    setFontSize(1.5);
    setRenderScale(5);
    setColor("#00ff88");
    setInvert(false);
    setCharacters(" .:-+*=%@#");
    setRotationSpeed(1);
    setIsAutoRotate(true);
  };

  const instructions = [
    { icon: "🔄", text: "Drag to rotate camera", color: "#00ff88" },
    { icon: "📐", text: "Scroll to zoom in/out", color: "#ff00ff" },
    { icon: "🎨", text: "Adjust settings below", color: "#00ffff" },
  ];

  const stats = [
    { label: "CHARS", value: characters.length, color: "#00ff88" },
    { label: "FPS", value: fps, color: "#ff00ff" },
    { label: "SCALE", value: `${renderScale}x`, color: "#00ffff" },
  ];

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl">
      <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-green-900/20">
        <div ref={containerRef} className="w-full h-full" />

        {/* Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 right-4 z-20 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all text-white/80 hover:text-white text-sm"
        >
          {showControls ? "Hide Controls" : "Show Controls"}
        </button>

        {/* Instructions Panel */}
        <div
          className={`absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 max-w-xs border border-white/10 z-10 transition-all duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span className="text-green-400">💻</span> ASCII Controls
          </h3>
          <ul className="text-white/80 text-sm space-y-1">
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
          className={`absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10 z-10 transition-all duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="space-y-2">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-white/60 text-xs">{stat.label}</div>
                <div className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Panel - Left side */}
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex flex-col gap-3 z-10 transition-all duration-300 max-w-[280px] ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Text Input */}
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
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Size</span>
              <span className="text-green-400 text-sm font-bold">{fontSize.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          {/* Render Scale */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Scale</span>
              <span className="text-cyan-400 text-sm font-bold">{renderScale}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={renderScale}
              onChange={(e) => setRenderScale(parseInt(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Color Scheme */}
          <div className="flex flex-col gap-2">
            <span className="text-white/70 text-sm">Color</span>
            <div className="flex gap-2 flex-wrap">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setColor(scheme.color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === scheme.color
                      ? "ring-2 ring-white scale-110"
                      : "opacity-50 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: scheme.color }}
                  aria-label={scheme.name}
                  title={scheme.name}
                />
              ))}
            </div>
          </div>

          {/* Character Set */}
          <div className="flex flex-col gap-2">
            <span className="text-white/70 text-sm">Character Set</span>
            <div className="flex flex-col gap-1">
              {characterSets.map((set) => (
                <button
                  key={set.id}
                  onClick={() => setCharacters(set.chars)}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-all border ${
                    characters === set.chars
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{set.name}</span>
                    <span className="text-xs opacity-60">{set.chars.length}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Buttons */}
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

          {/* Rotation Speed */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Speed</span>
              <span className="text-blue-400 text-sm font-bold">{rotationSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}