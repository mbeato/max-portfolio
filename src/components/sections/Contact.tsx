'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, Github, Linkedin, CheckCircle, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { SITE_CONFIG, SOCIAL_LINKS, EMAIL_CONFIG, FORM_VALIDATION } from '@/lib/constants'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { generateElementId } from '@/lib/utils'
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
      case 'Mail': return Mail
      default: return Mail
    }
  }

  return (
    <section
      ref={ref}
      id={id}
      className="py-24 bg-map-white"
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
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="text-xl text-stone-500 max-w-3xl mx-auto">
              Have a project in mind or just want to chat about technology?
              I&apos;d love to hear from you!
            </p>
          </motion.div>

          <div
            id={generateElementId('contact', 'content', 'grid')}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Contact Information */}
            <motion.div
              id={generateElementId('contact', 'info', 'section')}
              variants={fadeInUp}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-6">
                  Get In Touch
                </h3>
                <p className="text-stone-500 mb-8 leading-relaxed">
                  Whether you&apos;re looking to collaborate on a project, need help with development,
                  or just want to connect with a fellow developer, I&apos;m always open to interesting
                  conversations and opportunities.
                </p>
              </div>


              {/* Contact Details */}
              <div
                id={generateElementId('contact', 'details', 'list')}
                className="space-y-4"
              >
                <motion.div
                  id={generateElementId('contact', 'detail', 'email')}
                  className="flex items-center gap-4 p-4 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-stone-100 rounded-lg">
                    <Mail className="w-5 h-5 text-coral-peak" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Email</p>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-coral-peak hover:underline transition-colors"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  id={generateElementId('contact', 'detail', 'location')}
                  className="flex items-center gap-4 p-4 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-stone-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-stone-700" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Location</p>
                    <p className="text-stone-500">{SITE_CONFIG.location}</p>
                  </div>
                </motion.div>

                <motion.div
                  id={generateElementId('contact', 'detail', 'timezone')}
                  className="flex items-center gap-4 p-4 rounded-lg bg-stone-50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-stone-100 rounded-lg">
                    <div className="w-5 h-5 text-stone-700 flex items-center justify-center text-xs font-bold">
                      🕐
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">Timezone</p>
                    <p className="text-stone-500">{SITE_CONFIG.timezone}</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div
                id={generateElementId('contact', 'social', 'section')}
              >
                <h4 className="text-lg font-semibold text-stone-900 mb-4">
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
                        className="p-3 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors group"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <IconComponent className="w-5 h-5 text-stone-500 group-hover:text-stone-900 transition-colors" />
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
              {/* Inline card wrapper — Card component was deleted in Phase 1 cleanup */}
              <div
                id={generateElementId('contact', 'form', 'card')}
                className="bg-map-white rounded-lg p-8 h-fit"
                style={{ boxShadow: 'var(--shadow-border)' }}
              >
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div
                    id={generateElementId('contact', 'form', 'name-email-fields')}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-stone-700 mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-map-white text-stone-900 focus:ring-2 focus:border-transparent transition-colors ${
                          errors.name
                            ? 'border-error focus:ring-error'
                            : 'border-stone-300 focus:ring-coral-peak'
                        }`}
                        placeholder="Your name"
                        disabled={formState === 'loading'}
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-error"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-stone-700 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-map-white text-stone-900 focus:ring-2 focus:border-transparent transition-colors ${
                          errors.email
                            ? 'border-error focus:ring-error'
                            : 'border-stone-300 focus:ring-coral-peak'
                        }`}
                        placeholder="your.email@example.com"
                        disabled={formState === 'loading'}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-error"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div id={generateElementId('contact', 'form', 'subject-field')}>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-map-white text-stone-900 focus:ring-2 focus:border-transparent transition-colors ${
                        errors.subject
                          ? 'border-error focus:ring-error'
                          : 'border-stone-300 focus:ring-coral-peak'
                      }`}
                      placeholder="What would you like to discuss?"
                      disabled={formState === 'loading'}
                    />
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-error"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </div>

                  <div id={generateElementId('contact', 'form', 'message-field')}>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-2 border rounded-lg bg-map-white text-stone-900 focus:ring-2 focus:border-transparent transition-colors resize-none ${
                        errors.message
                          ? 'border-error focus:ring-error'
                          : 'border-stone-300 focus:ring-coral-peak'
                      }`}
                      placeholder="Tell me about your project or just say hello!"
                      disabled={formState === 'loading'}
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-error"
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
                      className="flex items-center gap-2 p-4 bg-success/10 text-success rounded-lg"
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
                      className="flex items-center gap-2 p-4 bg-error/10 text-error rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Failed to send message</p>
                        <p className="text-sm opacity-90">Please try again or contact me directly.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline submit button — Button component was deleted in Phase 1 cleanup */}
                  <motion.button
                    id={generateElementId('contact', 'form', 'submit-button')}
                    type="submit"
                    disabled={formState === 'loading' || formState === 'success'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-map-white font-semibold rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
                    whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
                  >
                    {formState === 'success' ? <CheckCircle className="w-5 h-5" /> :
                     formState === 'error' ? <AlertCircle className="w-5 h-5" /> :
                     <Send className="w-5 h-5" />}
                    {formState === 'loading' ? 'Sending...' :
                     formState === 'success' ? 'Message Sent!' :
                     formState === 'error' ? 'Try Again' :
                     'Send Message'}
                  </motion.button>

                  {/* Demo Mode Notice */}
                  {!EMAIL_CONFIG.serviceId && (
                    <div className="text-center">
                      <p className="text-sm text-stone-500">
                        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        Demo Mode: Form submissions are simulated
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
