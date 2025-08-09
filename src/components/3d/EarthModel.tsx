'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Earth component with rotation and realistic appearance
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!earthRef.current || !cloudsRef.current) return
    
    // Earth rotation
    earthRef.current.rotation.y += 0.002
    
    // Clouds rotation (slightly faster)
    cloudsRef.current.rotation.y += 0.003
    
    // Slight wobble effect
    const time = state.clock.getElapsedTime()
    earthRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
    cloudsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
  })

  // Create earth texture using gradients (in a real project, you'd use actual earth textures)
  const earthMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')!
    
    // Create a simple earth-like pattern
    const gradient = context.createLinearGradient(0, 0, 1024, 512)
    gradient.addColorStop(0, '#2E8B57')    // Sea green
    gradient.addColorStop(0.3, '#228B22')  // Forest green
    gradient.addColorStop(0.6, '#8FBC8F')  // Dark sea green
    gradient.addColorStop(1, '#4682B4')    // Steel blue
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 1024, 512)
    
    // Add some brown/tan patches for continents
    context.fillStyle = '#CD853F'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 512
      const radius = Math.random() * 100 + 50
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return new THREE.MeshLambertMaterial({ 
      map: texture,
      transparent: false
    })
  }, [])

  // Create clouds texture
  const cloudsMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')!
    
    // Create cloud pattern
    context.fillStyle = 'rgba(255, 255, 255, 0)'
    context.fillRect(0, 0, 1024, 512)
    
    // Add white clouds
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 512
      const radius = Math.random() * 60 + 20
      const opacity = Math.random() * 0.8 + 0.2
      
      context.fillStyle = `rgba(255, 255, 255, ${opacity})`
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return new THREE.MeshLambertMaterial({ 
      map: texture,
      transparent: true,
      opacity: 0.4
    })
  }, [])

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]} material={earthMaterial} />
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.01, 64, 64]} material={cloudsMaterial} />
    </group>
  )
}

// Atmosphere glow effect
function Atmosphere() {
  const atmosphereRef = useRef<THREE.Mesh>(null)

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x69B7E0) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = color * intensity;
          gl_FragColor = vec4(atmosphere, intensity * 0.8);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    })
  }, [])

  useFrame((state) => {
    if (atmosphereRef.current) {
      // Update time uniform for animation if needed
      (atmosphereRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <Sphere ref={atmosphereRef} args={[2.4, 32, 32]} material={atmosphereMaterial} />
  )
}

// Floating particles around earth
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create particles in a sphere around earth
      const radius = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }
    
    return positions
  }, [])

  useFrame((_) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005
      particlesRef.current.rotation.x += 0.0003
    }
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(particles, 3))
    return geom
  }, [particles])

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

interface EarthModelProps {
  id: string
}

export default function EarthModel({ id }: EarthModelProps) {
  return (
    <div id={id} className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        {/* Simplified lighting for performance */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        {/* Earth and atmosphere */}
        <Earth />
        <Atmosphere />
        <FloatingParticles />

        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>

      {/* Overlay information */}
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 rounded px-3 py-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Earth - Interactive 3D Model</span>
        </div>
      </div>
    </div>
  )
}