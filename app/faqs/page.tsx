'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) is available for an additional fee. International shipping may take 7-14 business days depending on the destination.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for unopened items in their original packaging. Perfumes that have been used or opened cannot be returned for hygiene reasons. Sale items are final sale and not eligible for returns.',
  },
  {
    question: 'Are your perfumes authentic?',
    answer: 'Absolutely! We source directly from authorized brand distributors and guarantee the authenticity of every product. Each item comes with a verification tag and can be authenticated upon request.',
  },
  {
    question: 'How do I store my perfume?',
    answer: 'Store perfumes in a cool, dry place away from direct sunlight and heat. Keep the bottle tightly closed when not in use. Avoid storing in bathrooms due to humidity. Properly stored perfumes can last 3-5 years.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes! Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order by logging into your account and visiting the Orders section.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer complimentary gift wrapping on all orders. You can add a personalized message at checkout at no extra cost. For premium gift sets, we offer luxury packaging with ribbon and a gift card.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), Mobile Money (MTN, Vodafone, AirtelTigo), and bank transfers. For orders over GHS 2,000, we also offer flexible payment plans through our financing partners.',
  },
  {
    question: 'How do I choose the right fragrance?',
    answer: 'We recommend trying our samples first! Each fragrance page has detailed notes and descriptions. You can also filter by scent family (floral, oriental, woody, fresh) to narrow down your preferences.',
  },
]

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <div className="min-h-screen bg-primary">
      <main className="pt-32 pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kartel-gold/10 mb-6">
              <HelpCircle className="w-8 h-8 text-kartel-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted">
              Find answers to common questions about our products, shipping, and services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-heading font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="px-6 pb-5"
                  >
                    <p className="text-body leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center p-8 glass-card"
          >
            <h3 className="text-heading font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted mb-4">Our team is here to help you with anything you need.</p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  )
}