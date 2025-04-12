import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Projects } from '@/components/Projects'
import { WhyChooseUs } from '@/components/WhyChooseUs'
import { Counter } from '@/components/Counter'
import { InvestmentPlans } from '@/components/InvestmentPlans'
import { HowItWorks } from '@/components/HowItWorks'
import { CallToAction } from '@/components/CallToAction'
import { Testimonials } from '@/components/Testimonials'
import { BlogSection } from '@/components/BlogSection'
import { Partners } from '@/components/Partners'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <About />
        <Projects />
        <Services />
        <WhyChooseUs />
        <Counter />
        <div className="relative py-16 bg-background">
          <InvestmentPlans />
        </div>
        <HowItWorks />
        <CallToAction />
        <Testimonials />
        <BlogSection />
        <Partners />
      </motion.div>
    </div>
  )
}
