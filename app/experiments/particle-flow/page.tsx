// components/experiments/ParticleGalaxyExperiment.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ParticleGalaxyExperiment() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [particleCount, setParticleCount] = useState(5000);
  const [speed, setSpeed] = useState(1);
  const [galaxyType, setGalaxyType] = useState<"spiral" | "elliptical" | "irregular">("spiral");
  const [mouseAttraction, setMouseAttraction] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create galaxy particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    let particles: THREE.Points;
    let positions: Float32Array;
    let colors: Float32Array;
    let velocities: { x: number; y: number; z: number }[] = [];
    let originalPositions: { x: number; y: number; z: number }[] = [];

    const createGalaxy = () => {
      positions = new Float32Array(particleCount * 3);
      colors = new Float32Array(particleCount * 3);
      velocities = [];
      originalPositions = [];

      const centerColor = new THREE.Color(0x4cc9f0);
      const outerColor = new THREE.Color(0x7209b7);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x, y, z;

        switch (galaxyType) {
          case "spiral":
            // Spiral galaxy
            const radius = Math.random() * 25;
            const angle = Math.random() * Math.PI * 2;
            const spiral = Math.sin(radius * 0.5) * 2;

            x = Math.cos(angle + spiral) * radius;
            y = (Math.random() - 0.5) * 2;
            z = Math.sin(angle + spiral) * radius;
            break;

          case "elliptical":
            // Elliptical galaxy
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = Math.cbrt(Math.random()) * 20;

            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta) * 0.5;
            z = r * Math.cos(phi);
            break;

          case "irregular":
            // Irregular galaxy
            x = (Math.random() - 0.5) * 30;
            y = (Math.random() - 0.5) * 30;
            z = (Math.random() - 0.5) * 30;
            break;
        }

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Color gradient from center to outer
        const distance = Math.sqrt(x * x + y * y + z * z);
        const normalizedDistance = distance / 25;
        const color = centerColor.clone().lerp(outerColor, normalizedDistance);

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Initial velocity (rotation around Y axis)
        velocities.push({
          x: -z * 0.01 * speed,
          y: 0,
          z: x * 0.01 * speed,
        });

        originalPositions.push({ x, y, z });
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      if (particles) {
        scene.remove(particles);
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      }

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
    };

    createGalaxy();

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
    };

    // Central black hole
    const blackHoleGeometry = new THREE.SphereGeometry(2, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Accretion disk
    const diskGeometry = new THREE.RingGeometry(3, 8, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b6b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 2;
    scene.add(accretionDisk);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Animate black hole and accretion disk
      blackHole.rotation.y = time * 0.5;
      accretionDisk.rotation.z = time * 0.3;

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Get current position
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Calculate distance to center for gravity effect
        const distance = Math.sqrt(x * x + y * y + z * z);
        const gravityStrength = 0.0001 * speed;

        // Apply gravity towards center
        velocities[i].x -= (x / distance) * gravityStrength;
        velocities[i].z -= (z / distance) * gravityStrength;

        // Mouse attraction
        if (mouseAttraction) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObject(particles);

          if (intersects.length > 0) {
            const target = intersects[0].point;
            const dx = target.x - x;
            const dz = target.z - z;
            const mouseDistance = Math.sqrt(dx * dx + dz * dz);

            if (mouseDistance < 20) {
              const attractionStrength = 0.001 * speed;
              velocities[i].x += (dx / mouseDistance) * attractionStrength;
              velocities[i].z += (dz / mouseDistance) * attractionStrength;
            }
          }
        }

        // Update position with velocity
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        // Apply some randomness
        velocities[i].x += (Math.random() - 0.5) * 0.0002;
        velocities[i].z += (Math.random() - 0.5) * 0.0002;

        // Damping
        velocities[i].x *= 0.999;
        velocities[i].z *= 0.999;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Rotate entire galaxy
      particles.rotation.y = time * 0.1 * speed;

      controls.update();
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

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      blackHoleGeometry.dispose();
      blackHoleMaterial.dispose();
      diskGeometry.dispose();
      diskMaterial.dispose();
      renderer.dispose();

      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, [particleCount, speed, galaxyType, mouseAttraction]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-blue-900/20">
        {/* Canvas container */}
        <div ref={canvasRef} className="w-full h-full" />

        {/* Controls Panel */}
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
        bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl p-4
        flex flex-wrap gap-4 items-center justify-center min-w-[400px]"
        >
          {/* Particle Count */}
          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm">
              Particles: {particleCount.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="1000"
              value={particleCount}
              onChange={(e) => setParticleCount(parseInt(e.target.value))}
              className="w-40 accent-cyan-500"
            />
          </div>

          {/* Speed */}
          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm">Speed: {speed.toFixed(1)}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-32 accent-purple-500"
            />
          </div>

          {/* Galaxy Type */}
          <div className="flex gap-2">
            {(["spiral", "elliptical", "irregular"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setGalaxyType(type)}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                  galaxyType === type
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Mouse Attraction Toggle */}
          <button
            onClick={() => setMouseAttraction(!mouseAttraction)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              mouseAttraction
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${mouseAttraction ? "bg-green-500" : "bg-gray-500"}`}
            />
            <span className="text-sm">Mouse Gravity</span>
          </button>
        </div>

        {/* Instructions */}
        <div
          className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm 
        rounded-xl p-4 max-w-xs border border-white/10"
        >
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span className="text-cyan-400">🌌</span> Galaxy Controls
          </h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span>Drag to rotate camera</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Scroll to zoom in/out</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Hover mouse to attract particles</span>
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
              <div className="text-white/60 text-xs">PARTICLES</div>
              <div className="text-xl font-bold text-cyan-400">
                {particleCount.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-white/60">
              Type: <span className="text-purple-400 capitalize">{galaxyType}</span>
            </div>
            <div className="text-xs text-white/60 mt-1">
              FPS: <span className="text-green-400">60</span>
            </div>
          </div>
        </div>
      </div>
      {/* Physics Info */}
      {/* <div
        className="absolute bottom-24 left-6 bg-black/50 backdrop-blur-sm 
        rounded-xl p-4 max-w-sm border border-white/10"
      >
        <h4 className="text-white font-bold mb-2 text-sm">⚛️ Physics Simulation</h4>
        <p className="text-white/70 text-xs">
          Each particle is influenced by gravitational forces from the central black hole. The
          simulation uses Newtonian physics with velocity vectors updated in real-time.
        </p>
      </div> */}
    </div>
  );
}
