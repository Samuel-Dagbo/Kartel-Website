'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Get in touch for inquiries',
    value: 'hello@carljones.com',
    link: 'mailto:hello@carljones.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    description: 'Mon-Fri from 9am to 6pm',
    value: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    title: 'Showroom',
    description: 'Visit our flagship store',
    value: '123 Luxury Lane, New York, NY',
    link: null,
  },
  {
    icon: Clock,
    title: 'Hours',
    description: 'Opening hours',
    value: 'Mon-Sat: 10AM - 8PM',
    link: null,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    alert('Message sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-kartel-cream dark:bg-kartel-black">
      {/* Hero Section */}
      <section className="relative h-[50vh] lg:h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 transition-colors duration-300 bg-kartel-cream dark:bg-kartel-black">
          <div className="absolute inset-0 bg-gradient-to-br from-kartel-cream via-kartel-cream to-kartel-cream dark:from-kartel-black dark:via-kartel-black dark:to-kartel-black" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-kartel-gold/[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-kartel-gold/[0.02] blur-[120px] rounded-full" />
        </div>
        
        <div className="container-luxury relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
              Get In Touch
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-heading leading-[1.1] tracking-[-0.02em]">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-xl mx-auto leading-relaxed">
              Have questions about our fragrances? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding transition-colors duration-300 bg-kartel-cream dark:bg-kartel-black">
        <div className="container-luxury">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 rounded-2xl glass-card hover:border-kartel-gold/[0.15] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full bg-kartel-gold/[0.1] flex items-center justify-center mb-4">
                  <info.icon className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-heading mb-1">{info.title}</h3>
                <p className="text-sm text-muted mb-2">{info.description}</p>
                {info.link ? (
                  <a href={info.link} className="text-sm text-kartel-gold/80 hover:text-kartel-gold transition-colors">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sm text-body">{info.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding-sm transition-colors duration-300 bg-kartel-cream dark:bg-kartel-black">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading">
                Send a <span className="text-gradient">Message</span>
              </h2>
              <p className="mt-4 text-body">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-luxury w-full px-5 py-4 border rounded-xl placeholder:text-muted focus:outline-none focus:border-kartel-gold/[0.3] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-luxury w-full px-5 py-4 border rounded-xl placeholder:text-muted focus:outline-none focus:border-kartel-gold/[0.3] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-luxury w-full px-5 py-4 border rounded-xl placeholder:text-muted focus:outline-none focus:border-kartel-gold/[0.3] transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-luxury w-full px-5 py-4 border rounded-xl placeholder:text-muted focus:outline-none focus:border-kartel-gold/[0.3] transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  )
}