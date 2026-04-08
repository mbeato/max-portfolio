'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, Github, Linkedin, CheckCircle, AlertCircle, FileDown } from 'lucide-react'
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
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const getInputShadow = (fieldName: string, hasError: boolean) => {
    if (hasError) return '#DC2626 0px 0px 0px 1px'
    if (focusedField === fieldName) return '#E8523F 0px 0px 0px 1px'
    return 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px'
  }

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
        className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8"
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
            className="mb-16"
          >
            <h2 style={{
              fontSize: 'var(--text-h1)',
              lineHeight: 'var(--text-h1--line-height)',
              letterSpacing: 'var(--text-h1--letter-spacing)',
              fontWeight: 600,
              color: 'var(--color-stone-900)',
              marginBottom: 'var(--spacing-4)',
            }}>
              say hi
            </h2>
            <p style={{
              fontSize: 'var(--text-body-lg)',
              lineHeight: 'var(--text-body-lg--line-height)',
              color: 'var(--color-stone-700)',
              maxWidth: '480px',
              marginBottom: 'var(--spacing-12)',
            }}>
              building something interesting? want to talk through an architecture problem? just curious about tonos, vtx, or apimesh? drop me a line.
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
                <h3 style={{
                  fontSize: 'var(--text-h3)',
                  lineHeight: 'var(--text-h3--line-height)',
                  letterSpacing: 'var(--text-h3--letter-spacing)',
                  fontWeight: 500,
                  color: 'var(--color-stone-900)',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  reach me
                </h3>
                <p style={{
                  fontSize: 'var(--text-body)',
                  lineHeight: 'var(--text-body--line-height)',
                  color: 'var(--color-stone-700)',
                  marginBottom: 'var(--spacing-8)',
                }}>
                  i read every message and respond within a day or two. if it&apos;s urgent, email directly.
                </p>
              </div>


              {/* Contact Details */}
              <div
                id={generateElementId('contact', 'details', 'list')}
                className="space-y-4"
              >
                <div
                  id={generateElementId('contact', 'detail', 'email')}
                  className="flex items-center gap-3 py-2"
                >
                  <Mail className="w-5 h-5 text-stone-500" />
                  <div>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-stone-900 hover:text-coral-peak transition-colors"
                      style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-stone-300)', textUnderlineOffset: '4px' }}
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div
                  id={generateElementId('contact', 'detail', 'location')}
                  className="flex items-center gap-3 py-2"
                >
                  <MapPin className="w-5 h-5 text-stone-500" />
                  <div>
                    <p className="text-stone-700">{SITE_CONFIG.location}</p>
                  </div>
                </div>

                <a
                  href="/resume.pdf"
                  download="Maximus_Beato_Resume.pdf"
                  className="flex items-center gap-3 py-2 text-stone-900 hover:text-coral-peak transition-colors"
                  style={{
                    fontSize: 'var(--text-body)',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textDecorationColor: 'var(--color-stone-300)',
                    textUnderlineOffset: '4px',
                  }}
                >
                  <FileDown className="w-5 h-5 text-stone-500" />
                  download resume
                </a>
              </div>

              {/* Social Links */}
              <div
                id={generateElementId('contact', 'social', 'section')}
              >
                <h4 style={{
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--text-body-sm--line-height)',
                  fontWeight: 500,
                  color: 'var(--color-stone-500)',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  find me
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
                        className="p-3 text-stone-400 hover:text-stone-900 transition-colors"
                        aria-label={social.name}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <IconComponent className="w-5 h-5" />
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
                className="bg-map-white p-8 h-fit"
                style={{ boxShadow: 'var(--shadow-border)', borderRadius: 'var(--radius-comfortable)' }}
              >
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div
                    id={generateElementId('contact', 'form', 'name-email-fields')}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        style={{
                          display: 'block',
                          fontSize: 'var(--text-body-sm)',
                          lineHeight: 'var(--text-body-sm--line-height)',
                          fontWeight: 500,
                          color: 'var(--color-stone-700)',
                          marginBottom: '8px',
                        }}
                      >
                        name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-map-white text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          boxShadow: getInputShadow('name', !!errors.name),
                          borderRadius: 'var(--radius-standard)',
                          padding: '12px 16px',
                          fontSize: 'var(--text-body)',
                          outline: 'none',
                          border: 'none',
                          transition: 'box-shadow var(--duration-fast) var(--ease-contour)',
                        }}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="name"
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
                        style={{
                          display: 'block',
                          fontSize: 'var(--text-body-sm)',
                          lineHeight: 'var(--text-body-sm--line-height)',
                          fontWeight: 500,
                          color: 'var(--color-stone-700)',
                          marginBottom: '8px',
                        }}
                      >
                        email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-map-white text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          boxShadow: getInputShadow('email', !!errors.email),
                          borderRadius: 'var(--radius-standard)',
                          padding: '12px 16px',
                          fontSize: 'var(--text-body)',
                          outline: 'none',
                          border: 'none',
                          transition: 'box-shadow var(--duration-fast) var(--ease-contour)',
                        }}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="email"
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
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 'var(--text-body-sm--line-height)',
                        fontWeight: 500,
                        color: 'var(--color-stone-700)',
                        marginBottom: '8px',
                      }}
                    >
                      subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-map-white text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        boxShadow: getInputShadow('subject', !!errors.subject),
                        borderRadius: 'var(--radius-standard)',
                        padding: '12px 16px',
                        fontSize: 'var(--text-body)',
                        outline: 'none',
                        border: 'none',
                        transition: 'box-shadow var(--duration-fast) var(--ease-contour)',
                      }}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="what's on your mind"
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
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 'var(--text-body-sm--line-height)',
                        fontWeight: 500,
                        color: 'var(--color-stone-700)',
                        marginBottom: '8px',
                      }}
                    >
                      message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full bg-map-white text-stone-900 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        boxShadow: getInputShadow('message', !!errors.message),
                        borderRadius: 'var(--radius-standard)',
                        padding: '12px 16px',
                        fontSize: 'var(--text-body)',
                        outline: 'none',
                        border: 'none',
                        transition: 'box-shadow var(--duration-fast) var(--ease-contour)',
                      }}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="tell me what you're building"
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
                      className="flex items-center gap-2 p-4 bg-success/10 text-success"
                      style={{ borderRadius: 'var(--radius-standard)' }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-medium">sent. i&apos;ll be in touch soon.</p>
                    </motion.div>
                  )}

                  {formState === 'error' && (
                    <motion.div
                      id={generateElementId('contact', 'form', 'error-message')}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 bg-error/10 text-error"
                      style={{ borderRadius: 'var(--radius-standard)' }}
                    >
                      <AlertCircle className="w-5 h-5" />
                      <p className="font-medium">something went wrong. try again or email me directly.</p>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    id={generateElementId('contact', 'form', 'submit-button')}
                    type="submit"
                    disabled={formState === 'loading' || formState === 'success'}
                    className="w-full flex items-center justify-center gap-2 bg-coral-peak hover:bg-coral-deep text-map-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                      padding: '12px 24px',
                      borderRadius: 'var(--radius-standard)',
                    }}
                    whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
                  >
                    {formState === 'success' ? <CheckCircle className="w-5 h-5" /> :
                     formState === 'error' ? <AlertCircle className="w-5 h-5" /> :
                     <Send className="w-5 h-5" />}
                    {formState === 'loading' ? 'sending...' :
                     formState === 'success' ? 'sent' :
                     formState === 'error' ? 'try again' :
                     'send message'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
