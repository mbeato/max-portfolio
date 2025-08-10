'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import Lazy3DComponent from '@/components/ui/Lazy3DComponent'
import StarField from '@/components/ui/StarField'
import { SKILL_CATEGORIES } from '@/lib/constants'
import { fadeInUp, staggerContainer, generateElementId } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'

interface AboutProps {
  id: string
}

export default function About({ id }: AboutProps) {
  const { ref, isIntersecting } = useScrollAnimation()
  const [selectedSkill, setSelectedSkill] = useState<{ skill: string; category: string } | null>(null)

  const handleSkillClick = (skill: string, category: string) => {
    setSelectedSkill({ skill, category })
    setTimeout(() => setSelectedSkill(null), 3000) // Auto-dismiss after 3 seconds
  }

  return (
    <section 
      ref={ref}
      id={id}
      className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Star Field Background */}
      <StarField
        id={generateElementId('about', 'background', 'stars')}
        className="opacity-40 dark:opacity-60"
        starCount={200}
        density="medium"
      />
      
      {/* Background Earth Globe */}
      <div 
        id={generateElementId('about', 'background', 'earth-container')}
        className="absolute -right-32 top-1/2 transform -translate-y-1/2 w-96 h-96 opacity-30 dark:opacity-20 pointer-events-none z-10"
      >
        <Lazy3DComponent
          componentName="EarthModel" 
          id={generateElementId('about', 'background', 'earth-model')} 
        />
      </div>
      
      <div 
        id={generateElementId('about', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
        >
          {/* Section Header */}
          <motion.div
            id={generateElementId('about', 'header', 'section')}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Passionate about creating exceptional digital experiences through innovative 
              technology and thoughtful design
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div 
            id={generateElementId('about', 'content', 'grid')}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            {/* Personal Introduction */}
            <motion.div
              id={generateElementId('about', 'introduction', 'content')}
              variants={fadeInUp}
            >
              <Card 
                id={generateElementId('about', 'introduction', 'card')}
                variant="elevated"
                padding="lg"
                className="h-full"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Purdue Student • Rock Climber • Powerlifter
                </h3>
                <div id={generateElementId('about','introduction','bio')} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    I’m a Purdue University student who builds because it’s fun. I like making things that run fast, look sharp, and actually make someone’s day better. Whether it’s a new framework, a weird API, or some half-baked side project, I’m always curious to see how it works and what I can make with it.
                  </p>
                  <p>
                    Climbing taught me to break big problems into small moves. Route reading feels a lot like debugging: stay calm, test the next hold, and commit when it matters. That mindset carries into my work—iterate, get signal quickly, and keep momentum.
                  </p>
                  <p>
                    Powerlifting keeps me disciplined. Progressive overload is just versioning for strength—small, consistent gains over time. I bring the same approach to shipping features: tight feedback loops, good tooling, and steady improvement.
                  </p>
                  <p>
                    I like working with people who get excited about the little details—clean animations, smart abstractions, the “it just works” moments. If you’re into building things that feel great to use and stretching a stack in new ways, we’ll get along.
                  </p>
                </div>

                {/* Removed photo strip per request */}
              </Card>
            </motion.div>

            {/* Professional Picture */}
            <motion.div
              id={generateElementId('about', 'picture', 'container')}
              variants={fadeInUp}
              className="flex justify-center"
            >
              <Card 
                id={generateElementId('about', 'picture', 'card')}
                variant="elevated"
                padding="sm"
                className="w-full max-w-md"
              >
                {/* Staggered Photo Grid (replace placeholders with your images) */}
                <div 
                  id={generateElementId('about', 'photos', 'grid')}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3"
                >
                  {/* Left: tall portrait (spans two rows on md+) */}
                  <div 
                    id={generateElementId('about','photos','portrait')}
                    className="group relative overflow-hidden rounded-lg md:row-span-2 bg-gray-200 dark:bg-gray-700 aspect-[3/4] md:aspect-auto"
                  >
                    <Image
                      src="/images/Me.jpg"
                      alt="Portrait"
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: 'center 15%' }}
                      priority
                    />
                  </div>

                  {/* Right top: climbing */}
                  <div 
                    id={generateElementId('about','photos','climbing')}
                    className="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 aspect-[16/10]"
                  >
                    <Image
                      src="/images/Climbing.jpg"
                      alt="Climbing session"
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Right bottom: lifting */}
                  <div 
                    id={generateElementId('about','photos','lifting')}
                    className="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 aspect-[16/10]"
                  >
                    <Image
                      src="/images/Lifting.jpg"
                      alt="Powerlifting training"
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Bottom: wide lifestyle (cats) */}
                  <div 
                    id={generateElementId('about','photos','cats')}
                    className="group relative overflow-hidden rounded-lg md:col-span-2 aspect-[16/9] bg-gray-200 dark:bg-gray-700"
                  >
                    <Image
                      src="/images/Cats.jpg"
                      alt="Lifestyle"
                      fill
                      sizes="(max-width: 768px) 90vw, 560px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Optional caption */}
                <div 
                  id={generateElementId('about', 'picture', 'caption')}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Climbing • Lifting • Cats • Purdue
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Skills Section */}
          <motion.div
            id={generateElementId('about', 'skills', 'section')}
            variants={fadeInUp}
            className="relative"
          >
            <div className="flex flex-col items-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Technical Skills
              </h3>
            </div>

            {/* Selected Skill Notification */}
            <AnimatePresence>
              {selectedSkill && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  <div className="text-center">
                    <div className="font-semibold">{selectedSkill.skill}</div>
                    <div className="text-sm opacity-90">
                      {SKILL_CATEGORIES[selectedSkill.category as keyof typeof SKILL_CATEGORIES]?.name}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Skills Grid */}
            <motion.div
              id={generateElementId('about', 'skills', 'grid')}
              className="grid md:grid-cols-3 gap-8"
            >
              {Object.entries(SKILL_CATEGORIES).map(([key, category], categoryIndex) => (
                <motion.div
                  key={key}
                  id={generateElementId('about', 'skill', `category-${key}`)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + categoryIndex * 0.1 }}
                >
                  <Card 
                    id={generateElementId('about', 'skill', `${key}-card`)}
                    variant="outlined"
                    padding="lg"
                    className="h-full hover:shadow-lg transition-shadow"
                  >
                    <div 
                      id={generateElementId('about', 'skill', `${key}-header`)}
                      className="flex items-center mb-6"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h4>
                    </div>
                    
                    <div 
                      id={generateElementId('about', 'skill', `${key}-list`)}
                      className="flex flex-wrap gap-2"
                    >
                      {category.skills.map((skill, skillIndex) => (
                        <motion.button
                          key={`${key}-${skill}`}
                          id={generateElementId('about', 'skill', `${key}-${skill.toLowerCase().replace(/\s+/g, '-')}`)}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isIntersecting ? { opacity: 1, scale: 1 } : {}}
                          transition={{ 
                            delay: 0.2 + categoryIndex * 0.1 + skillIndex * 0.05 
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSkillClick(skill, key)}
                        >
                          {skill}
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}