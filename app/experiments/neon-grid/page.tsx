// components/experiments/NeonGridExperiment.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function NeonGridExperiment() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [neonIntensity, setNeonIntensity] = useState(2);
  const [colorScheme, setColorScheme] = useState<"purple" | "cyan" | "pink">("purple");

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 25);

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(15, 15, 15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Neon colors
    const colors = {
      purple: {
        primary: 0x9d4edd,
        secondary: 0x7b2cbf,
        glow: 0xc77dff,
      },
      cyan: {
        primary: 0x00b4d8,
        secondary: 0x0077b6,
        glow: 0x90e0ef,
      },
      pink: {
        primary: 0xff006e,
        secondary: 0xff0054,
        glow: 0xff5c8d,
      },
    };

    const currentColors = colors[colorScheme];

    // Create grid of boxes
    const boxes: THREE.Mesh[] = [];
    const grid: THREE.Mesh[][] = [];

    const createGrid = () => {
      // Remove old boxes
      boxes.forEach((box) => scene.remove(box));
      boxes.length = 0;
      grid.length = 0;

      for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        for (let z = 0; z < gridSize; z++) {
          // Create box geometry with rounded edges
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshStandardMaterial({
            color: currentColors.primary,
            emissive: currentColors.glow,
            emissiveIntensity: neonIntensity * 0.3,
            metalness: 0.8,
            roughness: 0.2,
          });

          const box = new THREE.Mesh(geometry, material);
          box.position.set(x - gridSize / 2, 0, z - gridSize / 2);
          box.castShadow = true;
          box.receiveShadow = true;

          // Store original position for animation
          (box as any).originalY = 0;
          (box as any).originalX = x;
          (box as any).originalZ = z;

          scene.add(box);
          boxes.push(box);
          grid[x][z] = box;
        }
      }
    };

    createGrid();

    // Add some particles for glow effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: currentColors.glow,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hoveredBox: THREE.Mesh | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(boxes);

      // Reset previous hovered box
      if (hoveredBox) {
        (hoveredBox.material as THREE.MeshStandardMaterial).emissiveIntensity = neonIntensity * 0.3;
        hoveredBox.scale.set(1, 1, 1);
      }

      if (intersects.length > 0) {
        hoveredBox = intersects[0].object as THREE.Mesh;
        (hoveredBox.material as THREE.MeshStandardMaterial).emissiveIntensity = neonIntensity;
        hoveredBox.scale.set(1.2, 1.2, 1.2);

        // Create ripple effect
        const box = hoveredBox as any;
        const x = box.originalX;
        const z = box.originalZ;

        boxes.forEach((b) => {
          const bx = (b as any).originalX;
          const bz = (b as any).originalZ;
          const distance = Math.sqrt((bx - x) ** 2 + (bz - z) ** 2);

          if (distance < 3) {
            const wave = Math.sin(Date.now() * 0.005 - distance) * 0.5;
            b.position.y = (b as any).originalY + wave;
          }
        });
      }
    };

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isPlaying) return;

      const time = clock.getElapsedTime();

      // Animate boxes
      boxes.forEach((box, i) => {
        const x = (box as any).originalX;
        const z = (box as any).originalZ;

        // Subtle floating animation
        const float = Math.sin(time * 0.5 + x * 0.3 + z * 0.3) * 0.3;
        box.position.y = (box as any).originalY + float;

        // Pulsing emission
        const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
        (box.material as THREE.MeshStandardMaterial).emissiveIntensity =
          neonIntensity * (0.3 + pulse * 0.2);

        // Rotation
        box.rotation.y = time * 0.2;
      });

      // Animate particles
      particlesMesh.rotation.y = time * 0.1;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    function handleResize() {
      if (!canvasRef.current) return;

      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      // Dispose Three.js resources
      boxes.forEach((box) => {
        box.geometry.dispose();
        if (Array.isArray(box.material)) {
          box.material.forEach((m) => m.dispose());
        } else {
          box.material.dispose();
        }
      });

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();

      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, [isPlaying, gridSize, neonIntensity, colorScheme]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-purple-900/20">
        {/* Canvas container */}
        <div ref={canvasRef} className="w-full h-full" />

        {/* Controls Panel */}
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
        bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl p-4
        flex flex-wrap gap-4 items-center justify-center min-w-[300px]"
        >
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
            transition-colors flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <div className="w-2 h-6 bg-white"></div>
                <div className="w-2 h-6 bg-white"></div>
                <span className="ml-1">Pause</span>
              </>
            ) : (
              <>
                <div
                  className="w-0 h-0 border-t-4 border-b-4 border-l-8 
                border-t-transparent border-b-transparent border-l-white ml-1"
                ></div>
                <span className="ml-2">Play</span>
              </>
            )}
          </button>

          {/* Grid Size Slider */}
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm">
              Grid: {gridSize}x{gridSize}
            </span>
            <input
              type="range"
              min="5"
              max="20"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-32 accent-purple-500"
            />
          </div>

          {/* Neon Intensity */}
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm">Glow</span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={neonIntensity}
              onChange={(e) => setNeonIntensity(parseFloat(e.target.value))}
              className="w-24 accent-cyan-500"
            />
          </div>

          {/* Color Scheme */}
          <div className="flex gap-2">
            {(["purple", "cyan", "pink"] as const).map((color) => (
              <button
                key={color}
                onClick={() => setColorScheme(color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  colorScheme === color
                    ? "ring-2 ring-white scale-110"
                    : "opacity-50 hover:opacity-100"
                }`}
                style={{
                  backgroundColor:
                    color === "purple" ? "#9D4EDD" : color === "cyan" ? "#00B4D8" : "#FF006E",
                }}
                aria-label={`${color} color scheme`}
              />
            ))}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setGridSize(10);
              setNeonIntensity(2);
              setColorScheme("purple");
              setIsPlaying(true);
            }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
            transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        {/* Instructions */}
        <div
          className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm 
        rounded-xl p-4 max-w-xs border border-white/10"
        >
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span className="text-cyan-400">⚡</span> Neon Grid Controls
          </h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Click & drag to rotate view</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span>Scroll to zoom in/out</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span>Hover over cubes for ripple effect</span>
            </li>
          </ul>
        </div>

        {/* Stats */}
        <div
          className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm 
        rounded-xl p-4 border border-white/10"
        >
          <div className="text-white/90 text-sm">
            <div className="mb-2">
              <div className="text-white/60 text-xs">CUBES</div>
              <div className="text-xl font-bold text-cyan-400">{gridSize * gridSize}</div>
            </div>
            <div className="text-xs text-white/60">
              FPS: <span className="text-green-400">60</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
