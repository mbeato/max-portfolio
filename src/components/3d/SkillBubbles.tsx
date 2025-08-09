'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Text, Html } from '@react-three/drei'
import { Vector3 } from 'three'
import * as THREE from 'three'
import { generateElementId } from '@/lib/utils'
import { SKILL_CATEGORIES } from '@/lib/constants'

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
    new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity: hovered ? 0.9 : 0.7,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.5
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
        {/* Skill label */}
        <Html
          transform
          occlude="blending"
          position={[0, 0, size + 0.1]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-lg text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            {skill}
          </div>
        </Html>
        
        {/* Inner text on sphere */}
        <Text
          position={[0, 0, size * 0.8]}
          fontSize={size * 0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={size * 0.01}
        >
          {skill.slice(0, 3)}
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
    <div 
      id={id}
      className="w-full h-96 relative"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop="demand"
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
  )
}

// Component to handle gentle camera rotation
function CameraController() {
  const { camera } = useThree()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Gentle orbital rotation
    camera.position.x = Math.cos(time * 0.1) * 12
    camera.position.z = Math.sin(time * 0.1) * 12
    camera.position.y = Math.sin(time * 0.05) * 2
    
    // Always look at the center
    camera.lookAt(0, 0, 0)
  })
  
  return null
}