import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { BarChart3, Users2 } from 'lucide-react'

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="text-[#e93c05] font-semibold text-lg">About Resonant finance</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
                We Help Our Clients Achieve Financial Goals
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className=" mb-8">
              We combine expertise across traditional and alternative asset classes with state-of-the-art investment 
              portfolio construction techniques to help our clients unlock the right opportunities in a fast-evolving 
              investment world.
            </motion.p>

            <motion.div variants={itemVariants} className="mb-8">
              <div className="mb-8 flex">
                <div className="mr-4 mt-1">
                  <div className="p-3 bg-[#fee4db] rounded-lg relative">
                    <BarChart3 className="h-6 w-6 text-[#e93c05]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Goals & Desire</h3>
                  <p className="">
                    Great financial advice starts with an understanding of your personal, 
                    financial and lifestyle goals
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4 mt-1">
                  <div className="p-3 bg-[#fee4db] rounded-lg relative">
                    <Users2 className="h-6 w-6 text-[#e93c05]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Strategic Planning & Implementation</h3>
                  <p className="">
                    Goals without a plan are just a dream – so at Resonant finance our team of 
                    industry experts will work with you to develop your finances.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                asChild
                className="bg-[#e93c05] hover:bg-[#011a41] text-white font-semibold transition-colors"
              >
                <Link to="/about">Read More</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <img 
              src="/assets/images/about/about4.jpg" 
              alt="About Resonant Finance" 
              className="w-full rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 hidden lg:block">
              <img 
                src="/assets/images/about/about-shape6.png" 
                alt="Shape" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute top-10 right-0 w-32 h-32 hidden lg:block">
              <motion.img 
                animate={{ 
                  rotateY: [0, 180, 360],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                src="/assets/images/about/about-shape7.png" 
                alt="Shape" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -top-5 right-20 w-24 h-24 hidden lg:block">
              <motion.img 
                animate={{ 
                  x: [0, -15, 0],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src="/assets/images/about/about-shape8.png" 
                alt="Shape" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 