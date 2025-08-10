'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import InteractiveGraphics from '@/components/3d/InteractiveGraphics'
import Button from '@/components/ui/Button'
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'
import { fadeInUp, staggerContainer, generateElementId } from '@/lib/utils'

interface HeroProps {
  id: string
}

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 100) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  return { displayText, isComplete }
}

export default function Hero({ id }: HeroProps) {
  const { displayText, isComplete } = useTypewriter(SITE_CONFIG.name, 100)
  
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#portfolio-about-section')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id={id}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Animated Background Pattern */}
      <div 
        id={generateElementId('hero', 'background', 'pattern')}
        className="absolute inset-0 opacity-30 dark:opacity-20"
      >
        {/* Primary gradient orb */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary gradient orb */}
        <motion.div 
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Accent gradient */}
        <motion.div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Interactive Graphics Layer */}
      <InteractiveGraphics
        id={generateElementId('hero', 'graphics', 'interactive')}
        className="z-10"
      />


      <div 
        id={generateElementId('hero', 'content', 'container')}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Greeting */}
          <motion.div
            id={generateElementId('hero', 'greeting', 'text')}
            variants={fadeInUp}
            className="mb-6"
          >
            <span className="inline-block text-lg text-blue-600 dark:text-blue-400 font-medium">
              Hello, I&apos;m
            </span>
          </motion.div>

          {/* Name with typewriter effect */}
          <motion.h1
            id={generateElementId('hero', 'name', 'heading')}
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="inline-block">
              {displayText}
              <motion.span
                className="inline-block w-1 h-16 md:h-20 ml-2 bg-blue-600 dark:bg-blue-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 1,
                  repeat: isComplete ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              />
            </span>
          </motion.h1>

          {/* Title/Role */}
          <motion.div
            id={generateElementId('hero', 'title', 'container')}
            variants={fadeInUp}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
              Full‑Stack Developer @ Purdue University
            </p>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-500 mt-2">
              Building innovative digital experiences with modern technologies
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            id={generateElementId('hero', 'cta', 'buttons')}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300 group-hover:duration-200 animate-tilt" />
              <Button
                id={generateElementId('hero', 'cta', 'view-work')}
                size="lg"
                onClick={() => {
                  const projectsSection = document.querySelector('#portfolio-projects-section')
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="relative bg-blue-600 hover:bg-blue-700"
              >
                View My Work
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Button
                id={generateElementId('hero', 'cta', 'contact')}
                variant="outline"
                size="lg"
                onClick={() => {
                  const contactSection = document.querySelector('#portfolio-contact-section')
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg"
              >
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            id={generateElementId('hero', 'social', 'links')}
            variants={fadeInUp}
            className="flex justify-center gap-6 mb-16"
          >
            {SOCIAL_LINKS.slice(0, 3).map((social, index) => {
              const IconComponent = social.icon === 'Github' ? Github :
                                 social.icon === 'Linkedin' ? Linkedin : Mail
              
              return (
                <motion.a
                  key={social.id}
                  id={social.id}
                  href={social.url}
                  target={social.name !== 'Email' ? '_blank' : '_self'}
                  rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              )
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            id={generateElementId('hero', 'scroll', 'indicator')}
            variants={fadeInUp}
            className="flex flex-col items-center"
          >
            <button
              id={generateElementId('hero', 'scroll', 'button')}
              onClick={scrollToAbout}
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <span className="text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <ArrowDown className="w-6 h-6" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}