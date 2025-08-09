'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, Github, Linkedin, Twitter, CheckCircle, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Lazy3DComponent from '@/components/ui/Lazy3DComponent'
import { SITE_CONFIG, SOCIAL_LINKS, EMAIL_CONFIG, FORM_VALIDATION } from '@/lib/constants'
import { fadeInUp, staggerContainer, generateElementId } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import type { ContactForm, LoadingState } from '@/lib/types'

interface ContactProps {
  id: string
}

export default function Contact({ id }: ContactProps) {
  const { ref, isIntersecting } = useScrollAnimation()
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState<LoadingState>('idle')
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name || formData.name.length < FORM_VALIDATION.name.minLength) {
      newErrors.name = `Name must be at least ${FORM_VALIDATION.name.minLength} characters`
    } else if (formData.name.length > FORM_VALIDATION.name.maxLength) {
      newErrors.name = `Name must be less than ${FORM_VALIDATION.name.maxLength} characters`
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!FORM_VALIDATION.email.pattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Subject validation
    if (!formData.subject || formData.subject.length < FORM_VALIDATION.subject.minLength) {
      newErrors.subject = `Subject must be at least ${FORM_VALIDATION.subject.minLength} characters`
    } else if (formData.subject.length > FORM_VALIDATION.subject.maxLength) {
      newErrors.subject = `Subject must be less than ${FORM_VALIDATION.subject.maxLength} characters`
    }

    // Message validation
    if (!formData.message || formData.message.length < FORM_VALIDATION.message.minLength) {
      newErrors.message = `Message must be at least ${FORM_VALIDATION.message.minLength} characters`
    } else if (formData.message.length > FORM_VALIDATION.message.maxLength) {
      newErrors.message = `Message must be less than ${FORM_VALIDATION.message.maxLength} characters`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setFormState('loading')

    try {
      // If EmailJS is configured, use it. Otherwise, simulate success for demo
      if (EMAIL_CONFIG.serviceId && EMAIL_CONFIG.templateId && EMAIL_CONFIG.publicKey && formRef.current) {
        // Initialize EmailJS (in production, this would be done in _app.tsx)
        emailjs.init(EMAIL_CONFIG.publicKey)
        
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: SITE_CONFIG.name,
          reply_to: formData.email
        }

        await emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.templateId,
          templateParams
        )
      } else {
        // Demo mode - simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      setFormState('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset form state after 5 seconds
      setTimeout(() => setFormState('idle'), 5000)
      
    } catch (error) {
      console.error('Form submission error:', error)
      setFormState('error')
      setTimeout(() => setFormState('idle'), 5000)
    }
  }

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github': return Github
      case 'Linkedin': return Linkedin
      case 'Twitter': return Twitter
      case 'Mail': return Mail
      default: return Mail
    }
  }

  return (
    <section 
      ref={ref}
      id={id}
      className="py-24 bg-white dark:bg-gray-950"
    >
      <div 
        id={generateElementId('contact', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
        >
          {/* Section Header */}
          <motion.div
            id={generateElementId('contact', 'header', 'section')}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Have a project in mind or just want to chat about technology? 
              I&apos;d love to hear from you!
            </p>
          </motion.div>

          <div 
            id={generateElementId('contact', 'content', 'grid')}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Contact Information with 3D Earth */}
            <motion.div
              id={generateElementId('contact', 'info', 'section')}
              variants={fadeInUp}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Get In Touch
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Whether you&apos;re looking to collaborate on a project, need help with development, 
                  or just want to connect with a fellow developer, I&apos;m always open to interesting 
                  conversations and opportunities.
                </p>
              </div>

              {/* 3D Earth Model */}
              <motion.div
                id={generateElementId('contact', '3d', 'earth-section')}
                variants={fadeInUp}
                className="mb-8"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Connect from Anywhere
                </h4>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
                  <Lazy3DComponent
                    componentName="EarthModel" 
                    id={generateElementId('contact', '3d', 'earth-model')} 
                  />
                </div>
              </motion.div>

              {/* Contact Details */}
              <div 
                id={generateElementId('contact', 'details', 'list')}
                className="space-y-4"
              >
                <motion.div
                  id={generateElementId('contact', 'detail', 'email')}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <a 
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  id={generateElementId('contact', 'detail', 'location')}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-gray-400">{SITE_CONFIG.location}</p>
                  </div>
                </motion.div>

                <motion.div
                  id={generateElementId('contact', 'detail', 'timezone')}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <div className="w-5 h-5 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                      🕐
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Timezone</p>
                    <p className="text-gray-600 dark:text-gray-400">{SITE_CONFIG.timezone}</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div 
                id={generateElementId('contact', 'social', 'section')}
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Connect With Me
                </h4>
                <div 
                  id={generateElementId('contact', 'social', 'links')}
                  className="flex gap-4"
                >
                  {SOCIAL_LINKS.map((social, index) => {
                    const IconComponent = getSocialIcon(social.icon)
                    return (
                      <motion.a
                        key={social.id}
                        id={`contact-${social.id}`}
                        href={social.url}
                        target={social.name !== 'Email' ? '_blank' : '_self'}
                        rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        <span className="sr-only">{social.name}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              id={generateElementId('contact', 'form', 'section')}
              variants={fadeInUp}
            >
              <Card 
                id={generateElementId('contact', 'form', 'card')}
                variant="elevated"
                padding="lg"
                className="h-fit"
              >
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div 
                    id={generateElementId('contact', 'form', 'name-email-fields')}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label 
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors ${
                          errors.name 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                        }`}
                        placeholder="Your name"
                        disabled={formState === 'loading'}
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                        }`}
                        placeholder="your.email@example.com"
                        disabled={formState === 'loading'}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div id={generateElementId('contact', 'form', 'subject-field')}>
                    <label 
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors ${
                        errors.subject 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      }`}
                      placeholder="What would you like to discuss?"
                      disabled={formState === 'loading'}
                    />
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </div>

                  <div id={generateElementId('contact', 'form', 'message-field')}>
                    <label 
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none ${
                        errors.message 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      }`}
                      placeholder="Tell me about your project or just say hello!"
                      disabled={formState === 'loading'}
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Form Status Messages */}
                  {formState === 'success' && (
                    <motion.div
                      id={generateElementId('contact', 'form', 'success-message')}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Message sent successfully!</p>
                        <p className="text-sm opacity-90">I&apos;ll get back to you soon.</p>
                      </div>
                    </motion.div>
                  )}

                  {formState === 'error' && (
                    <motion.div
                      id={generateElementId('contact', 'form', 'error-message')}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Failed to send message</p>
                        <p className="text-sm opacity-90">Please try again or contact me directly.</p>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    id={generateElementId('contact', 'form', 'submit-button')}
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={formState === 'loading'}
                    leftIcon={
                      formState === 'success' ? <CheckCircle className="w-5 h-5" /> :
                      formState === 'error' ? <AlertCircle className="w-5 h-5" /> :
                      <Send className="w-5 h-5" />
                    }
                    disabled={formState === 'loading' || formState === 'success'}
                    asMotion
                    motionProps={{
                      whileHover: formState === 'idle' ? { scale: 1.02 } : {},
                      whileTap: formState === 'idle' ? { scale: 0.98 } : {}
                    }}
                  >
                    {formState === 'loading' ? 'Sending...' : 
                     formState === 'success' ? 'Message Sent!' :
                     formState === 'error' ? 'Try Again' :
                     'Send Message'}
                  </Button>

                  {/* Demo Mode Notice */}
                  {!EMAIL_CONFIG.serviceId && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        Demo Mode: Form submissions are simulated
                      </p>
                    </div>
                  )}
                </form>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}