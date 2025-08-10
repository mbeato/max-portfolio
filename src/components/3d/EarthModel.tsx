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

  // Create realistic Earth texture
  const earthMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const context = canvas.getContext('2d')!
    
    // Create ocean base (deep blue)
    context.fillStyle = '#1e3a8a' // Deep blue ocean
    context.fillRect(0, 0, 2048, 1024)
    
    // Add depth variation to oceans
    const oceanGradient = context.createRadialGradient(1024, 512, 0, 1024, 512, 800)
    oceanGradient.addColorStop(0, '#2563eb') // Lighter blue
    oceanGradient.addColorStop(0.7, '#1e3a8a') // Deep blue
    oceanGradient.addColorStop(1, '#1e1b4b')   // Very deep blue
    context.fillStyle = oceanGradient
    context.fillRect(0, 0, 2048, 1024)
    
    // Create more realistic continent shapes
    const continents = [
      // Africa-like continent
      { x: 1024, y: 400, width: 300, height: 400, color: '#22c55e' },
      // Europe-like continent
      { x: 1024, y: 250, width: 200, height: 150, color: '#16a34a' },
      // Asia-like continent
      { x: 1200, y: 300, width: 400, height: 300, color: '#15803d' },
      // North America-like continent
      { x: 600, y: 250, width: 250, height: 350, color: '#166534' },
      // South America-like continent
      { x: 700, y: 500, width: 150, height: 300, color: '#14532d' },
      // Australia-like continent
      { x: 1500, y: 650, width: 200, height: 120, color: '#365314' },
    ]
    
    // Draw continents with more natural shapes
    continents.forEach(continent => {
      context.fillStyle = continent.color
      
      // Create irregular continent shape
      context.beginPath()
      const centerX = continent.x
      const centerY = continent.y
      const radiusX = continent.width / 2
      const radiusY = continent.height / 2
      
      // Create organic, continent-like shape
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const noise = Math.sin(angle * 8) * 0.2 + Math.sin(angle * 3) * 0.3
        const radius = (1 + noise) * (radiusX + radiusY) / 2
        const x = centerX + Math.cos(angle) * radius * (radiusX / ((radiusX + radiusY) / 2))
        const y = centerY + Math.sin(angle) * radius * (radiusY / ((radiusX + radiusY) / 2))
        
        if (angle === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }
      context.closePath()
      context.fill()
      
      // Add some inland details (mountains/forests)
      context.fillStyle = '#166534' // Darker green for terrain variation
      for (let i = 0; i < 15; i++) {
        const detailX = centerX + (Math.random() - 0.5) * radiusX * 1.5
        const detailY = centerY + (Math.random() - 0.5) * radiusY * 1.5
        const detailRadius = Math.random() * 20 + 10
        
        context.beginPath()
        context.arc(detailX, detailY, detailRadius, 0, Math.PI * 2)
        context.fill()
      }
    })
    
    // Add ice caps (polar regions)
    // North pole
    context.fillStyle = '#f8fafc' // White/light blue for ice
    context.beginPath()
    context.ellipse(1024, 50, 800, 100, 0, 0, Math.PI * 2)
    context.fill()
    
    // South pole
    context.beginPath()
    context.ellipse(1024, 974, 600, 80, 0, 0, Math.PI * 2)
    context.fill()
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    
    return new THREE.MeshPhongMaterial({ 
      map: texture,
      shininess: 1,
      transparent: false
    })
  }, [])

  // Create more realistic clouds texture
  const cloudsMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const context = canvas.getContext('2d')!
    
    // Create transparent base
    context.fillStyle = 'rgba(0, 0, 0, 0)'
    context.fillRect(0, 0, 2048, 1024)
    
    // Create cloud formations with varying density
    const cloudFormations = [
      // Tropical band clouds
      { y: 300, width: 2048, height: 100, density: 0.6 },
      { y: 600, width: 2048, height: 80, density: 0.5 },
      // Polar clouds
      { y: 50, width: 2048, height: 120, density: 0.8 },
      { y: 900, width: 2048, height: 100, density: 0.7 },
      // Random weather systems
      { x: 400, y: 200, width: 300, height: 200, density: 0.7 },
      { x: 1200, y: 400, width: 400, height: 150, density: 0.6 },
      { x: 1600, y: 700, width: 250, height: 180, density: 0.5 },
    ]
    
    cloudFormations.forEach(formation => {
      const cloudCount = Math.floor((formation.width || 400) * (formation.height || 200) / 5000)
      
      for (let i = 0; i < cloudCount; i++) {
        const x = (formation.x || 0) + Math.random() * (formation.width || 2048)
        const y = formation.y + Math.random() * formation.height
        const radius = Math.random() * 80 + 30
        const opacity = formation.density * (Math.random() * 0.6 + 0.4)
        
        // Create fluffy cloud shape
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`
        context.beginPath()
        
        // Main cloud body
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
        
        // Add smaller puffs around main body
        for (let j = 0; j < 4; j++) {
          const puffX = x + (Math.random() - 0.5) * radius * 1.5
          const puffY = y + (Math.random() - 0.5) * radius * 1.5
          const puffRadius = radius * (Math.random() * 0.5 + 0.3)
          const puffOpacity = opacity * (Math.random() * 0.7 + 0.3)
          
          context.fillStyle = `rgba(255, 255, 255, ${puffOpacity})`
          context.beginPath()
          context.arc(puffX, puffY, puffRadius, 0, Math.PI * 2)
          context.fill()
        }
      }
    })
    
    // Add some wispy high-altitude clouds
    context.fillStyle = 'rgba(255, 255, 255, 0.2)'
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 1024
      const width = Math.random() * 200 + 100
      const height = Math.random() * 20 + 10
      
      context.beginPath()
      context.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2)
      context.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    
    return new THREE.MeshLambertMaterial({ 
      map: texture,
      transparent: true,
      opacity: 0.6,
      alphaTest: 0.1
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
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        frameloop="always"
      >
        {/* Realistic lighting setup */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2}
          color="#ffffff"
          castShadow
        />
        {/* Subtle fill light from opposite side */}
        <directionalLight 
          position={[-5, -5, -2]} 
          intensity={0.3}
          color="#4a90e2"
        />

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

    </div>
  )
}