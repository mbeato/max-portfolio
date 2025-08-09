'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { generateElementId } from '@/lib/utils'

interface FloatingShapeProps {
  position: [number, number, number]
  color: string
  shape: 'box' | 'sphere' | 'octahedron' | 'torus'
  size: number
}

function FloatingShape({ position, color, shape, size }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    
    // Gentle rotation animation
    meshRef.current.rotation.x += 0.005
    meshRef.current.rotation.y += 0.007
    meshRef.current.rotation.z += 0.003
    
    // Subtle floating movement based on time
    const time = state.clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'box':
        return new THREE.BoxGeometry(size, size, size)
      case 'sphere':
        return new THREE.SphereGeometry(size * 0.6, 8, 8) // Reduced resolution from 16x16 to 8x8
      case 'octahedron':
        return new THREE.OctahedronGeometry(size * 0.7)
      case 'torus':
        return new THREE.TorusGeometry(size * 0.5, size * 0.2, 6, 8) // Reduced resolution
      default:
        return new THREE.BoxGeometry(size, size, size)
    }
  }, [shape, size])

  const material = useMemo(() => 
    new THREE.MeshLambertMaterial({ 
      color,
      transparent: true,
      opacity: 0.6
    }), [color]
  )

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[0, 0.2]}
    >
      <mesh
        ref={meshRef}
        position={position}
        geometry={geometry}
        material={material}
      />
    </Float>
  )
}

interface FloatingShapesProps {
  id: string
}

export default function FloatingShapes({ id }: FloatingShapesProps) {
  const shapes = useMemo(() => [
    {
      id: generateElementId('3d', 'shape', 'box-1'),
      position: [-4, 2, -2] as [number, number, number],
      color: '#3b82f6',
      shape: 'box' as const,
      size: 0.8
    },
    {
      id: generateElementId('3d', 'shape', 'sphere-1'),
      position: [4, -1, -3] as [number, number, number],
      color: '#06ffa5',
      shape: 'sphere' as const,
      size: 1.0
    },
    {
      id: generateElementId('3d', 'shape', 'octahedron-1'),
      position: [-3, -3, -1] as [number, number, number],
      color: '#8b5cf6',
      shape: 'octahedron' as const,
      size: 0.9
    },
    {
      id: generateElementId('3d', 'shape', 'torus-1'),
      position: [3, 3, -2] as [number, number, number],
      color: '#f59e0b',
      shape: 'torus' as const,
      size: 0.7
    },
    {
      id: generateElementId('3d', 'shape', 'box-2'),
      position: [0, -4, -4] as [number, number, number],
      color: '#ef4444',
      shape: 'box' as const,
      size: 0.6
    },
    {
      id: generateElementId('3d', 'shape', 'sphere-2'),
      position: [-5, 0, -5] as [number, number, number],
      color: '#10b981',
      shape: 'sphere' as const,
      size: 0.5
    }
  ], [])

  return (
    <div 
      id={id}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        {/* Simplified lighting setup for better performance */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />

        {/* Render all floating shapes */}
        {shapes.map((shape) => (
          <FloatingShape
            key={shape.id}
            position={shape.position}
            color={shape.color}
            shape={shape.shape}
            size={shape.size}
          />
        ))}
      </Canvas>
    </div>
  )
}