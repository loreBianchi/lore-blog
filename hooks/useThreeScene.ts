'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface UseThreeSceneOptions {
  containerRef: React.RefObject<HTMLDivElement>
  onSceneCreated?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void
  backgroundColor?: number
  enableShadows?: boolean
}

export function useThreeScene({
  containerRef,
  onSceneCreated,
  backgroundColor = 0x000000,
  enableShadows = false
}) {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: backgroundColor === 0x000000
    })
    renderer.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    if (enableShadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    
    rendererRef.current = renderer

    // Clear container and add renderer
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(renderer.domElement)

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Callback for scene setup
    if (onSceneCreated) {
      onSceneCreated(scene, camera, renderer)
    }

    // Animation loop
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(
        containerRef.current.clientWidth, 
        containerRef.current.clientHeight
      )
    }
    
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      
      renderer.dispose()
      controls.dispose()
      
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [containerRef, backgroundColor, enableShadows])

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current
  }
}