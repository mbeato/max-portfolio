'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import Lazy3DComponent from '@/components/ui/Lazy3DComponent'
import { SKILL_CATEGORIES } from '@/lib/constants'
import { fadeInUp, staggerContainer, generateElementId } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'

interface AboutProps {
  id: string
}

export default function About({ id }: AboutProps) {
  const { ref, isIntersecting } = useScrollAnimation()
  const [selectedSkill, setSelectedSkill] = useState<{ skill: string; category: string } | null>(null)
  const [skillsView, setSkillsView] = useState<'3d' | 'list'>('3d')

  const handleSkillClick = (skill: string, category: string) => {
    setSelectedSkill({ skill, category })
    setTimeout(() => setSelectedSkill(null), 3000) // Auto-dismiss after 3 seconds
  }

  return (
    <section 
      ref={ref}
      id={id}
      className="py-24 bg-white dark:bg-gray-950"
    >
      <div 
        id={generateElementId('about', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
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
                  Building Digital Solutions
                </h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    With a passion for both technology and design, I specialize in creating 
                    full-stack applications that are not just functional, but delightful to use. 
                    My journey in software development spans across modern web technologies, 
                    mobile applications, and creative coding.
                  </p>
                  <p>
                    I believe in writing clean, maintainable code and staying current with 
                    the latest industry trends and best practices. Whether it&apos;s crafting 
                    pixel-perfect user interfaces or architecting robust backend systems, 
                    I approach every project with attention to detail and user-centric thinking.
                  </p>
                  <p>
                    When I&apos;m not coding, you&apos;ll find me exploring new technologies, 
                    contributing to open source projects, or experimenting with creative 
                    coding and digital art.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Stats/Highlights */}
            <motion.div
              id={generateElementId('about', 'stats', 'container')}
              variants={fadeInUp}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { id: 'projects', label: 'Projects Completed', value: '25+' },
                { id: 'technologies', label: 'Technologies Mastered', value: '15+' },
                { id: 'experience', label: 'Years of Experience', value: '3+' },
                { id: 'clients', label: 'Happy Clients', value: '10+' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.id}
                  id={generateElementId('about', 'stat', stat.id)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isIntersecting ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card 
                    id={generateElementId('about', 'stat', `${stat.id}-card`)}
                    variant="glass"
                    padding="md"
                    className="text-center hover:scale-105 transition-transform"
                  >
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
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
              
              {/* View Toggle */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setSkillsView('3d')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    skillsView === '3d' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  3D View
                </button>
                <button
                  onClick={() => setSkillsView('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    skillsView === 'list' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  List View
                </button>
              </div>
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
            
            {/* Skills Display */}
            <AnimatePresence mode="wait">
              {skillsView === '3d' ? (
                <motion.div
                  key="3d-view"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8"
                >
                  <div className="text-center mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      Click on the skill bubbles to explore my expertise
                    </p>
                  </div>
                  <Lazy3DComponent
                    componentName="SkillBubbles" 
                    id={generateElementId('about', 'skills', '3d-bubbles')}
                    onSkillClick={handleSkillClick}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
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
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}