import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from './ui/button'

export function CallToAction() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="bg-[#011a41] rounded-lg px-6 py-16 text-center relative overflow-hidden"
        >
          {/* Background shapes */}
          <img 
            src="/assets/images/book-shape3.png" 
            alt="Shape" 
            className="absolute top-0 left-0 w-32 opacity-10"
          />
          <img 
            src="/assets/images/book-shape4.png" 
            alt="Shape" 
            className="absolute bottom-0 right-0 w-32 opacity-10"
          />
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Are You Ready?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-xl mb-8"
          >
            Speak with an expert <a href="tel:+16085727901" className="hover:text-[#e93c05] transition-colors">+16085727901</a>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              className="bg-[#e93c05] hover:bg-white hover:text-[#011a41] text-white font-semibold px-8 py-6 text-lg transition-colors"
            >
              <Link to="/sign-up">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 