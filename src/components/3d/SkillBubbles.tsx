'use client'

import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Text, Html } from '@react-three/drei'
import { Vector3 } from 'three'
import * as THREE from 'three'
import { generateElementId } from '@/lib/utils'
import { SKILL_CATEGORIES } from '@/lib/constants'
import ErrorBoundary3D from './ErrorBoundary3D'

interface SkillBubbleProps {
  skill: string
  position: [number, number, number]
  color: string
  category: string
  size: number
  onClick?: (skill: string) => void
}

function SkillBubble({ skill, position, color, category, size, onClick }: SkillBubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    
    // Gentle floating animation
    const time = state.clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.1
    
    // Gentle rotation
    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.005
    
    // Scale animation on hover
    const targetScale = hovered ? 1.2 : clicked ? 0.9 : 1
    meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const handleClick = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 150)
    if (onClick) onClick(skill)
  }, [skill, onClick])

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(size, 8, 8), [size]) // Reduced resolution
  const material = useMemo(() => 
    new THREE.MeshLambertMaterial({
      color,
      transparent: true,
      opacity: hovered ? 0.9 : 0.7
    }), [color, hovered]
  )

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        position={position}
        geometry={sphereGeometry}
        material={material}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        // Removed shadows for better performance
      >
        {/* Skill label - Only show on hover to improve performance */}
        {hovered && (
          <Html
            transform
            occlude="blending"
            position={[0, 0, size + 0.2]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-lg text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
              {skill}
            </div>
          </Html>
        )}
        
        {/* Inner text on sphere - Simplified for performance */}
        <Text
          position={[0, 0, size * 0.8]}
          fontSize={size * 0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
        >
          {skill.length > 8 ? skill.slice(0, 3).toUpperCase() : skill.slice(0, 4).toUpperCase()}
        </Text>
      </mesh>
    </Float>
  )
}

interface SkillBubblesProps {
  id: string
  onSkillClick?: (skill: string, category: string) => void
}

export default function SkillBubbles({ id, onSkillClick }: SkillBubblesProps) {
  const skillBubbles = useMemo(() => {
    const bubbles: Array<{
      id: string
      skill: string
      position: [number, number, number]
      color: string
      category: string
      size: number
    }> = []

    // Create bubbles for each skill category
    Object.entries(SKILL_CATEGORIES).forEach(([categoryKey, category], categoryIndex) => {
      const baseRadius = 3
      const categoryAngle = (categoryIndex * 2 * Math.PI) / Object.keys(SKILL_CATEGORIES).length
      
      category.skills.slice(0, 6).forEach((skill, skillIndex) => {
        const skillAngle = categoryAngle + (skillIndex - 2.5) * 0.3
        const radius = baseRadius + (skillIndex % 2) * 1.5
        const height = (skillIndex % 3 - 1) * 2
        
        bubbles.push({
          id: generateElementId('skills', '3d', `bubble-${categoryKey}-${skill.toLowerCase().replace(/\s+/g, '-')}`),
          skill,
          position: [
            Math.cos(skillAngle) * radius,
            height,
            Math.sin(skillAngle) * radius
          ] as [number, number, number],
          color: category.color,
          category: categoryKey,
          size: 0.4 + (skill.length < 5 ? 0.1 : 0)
        })
      })
    })

    return bubbles
  }, [])

  const handleSkillClick = useCallback((skill: string) => {
    const bubble = skillBubbles.find(b => b.skill === skill)
    if (bubble && onSkillClick) {
      onSkillClick(skill, bubble.category)
    }
  }, [skillBubbles, onSkillClick])

  return (
    <ErrorBoundary3D>
      <div 
        id={id}
        className="w-full h-96 relative"
      >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={typeof window !== 'undefined' && window.devicePixelRatio > 2 ? [1, 2] : [1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0)
          gl.shadowMap.enabled = false
        }}
      >
        {/* Simplified lighting for performance */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.4} />

        {/* Render all skill bubbles */}
        {skillBubbles.map((bubble) => (
          <SkillBubble
            key={bubble.id}
            skill={bubble.skill}
            position={bubble.position}
            color={bubble.color}
            category={bubble.category}
            size={bubble.size}
            onClick={handleSkillClick}
          />
        ))}

        {/* Camera controller for gentle auto-rotation */}
        <CameraController />
      </Canvas>
      </div>
    </ErrorBoundary3D>
  )
}

// Component to handle gentle camera rotation
function CameraController() {
  const { camera } = useThree()
  const [isHovered, setIsHovered] = useState(false)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Slow down rotation when user is interacting
    const speed = isHovered ? 0.02 : 0.05
    
    // Gentle orbital rotation
    const radius = 12 + Math.sin(time * 0.1) * 1
    camera.position.x = Math.cos(time * speed) * radius
    camera.position.z = Math.sin(time * speed) * radius
    camera.position.y = Math.sin(time * 0.03) * 1.5
    
    // Always look at the center
    camera.lookAt(0, 0, 0)
  })

  // Listen for global mouse events to pause rotation
  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)
    
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('mouseenter', handleMouseEnter)
      canvas.addEventListener('mouseleave', handleMouseLeave)
      
      return () => {
        canvas.removeEventListener('mouseenter', handleMouseEnter)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])
  
  return null
}