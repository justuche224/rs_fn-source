import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, ThumbsUp, Trophy, Users } from 'lucide-react'

export function Counter() {
  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-sidebar rounded-lg shadow-lg py-12 px-8 relative overflow-hidden">
          {/* Background shapes */}
          <img 
            src="/assets/images/counter-shape1.png" 
            alt="Shape" 
            className="absolute top-0 left-0 w-24 opacity-30"
          />
          <img 
            src="/assets/images/counter-shape2.png" 
            alt="Shape" 
            className="absolute bottom-0 right-0 w-24 opacity-30"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CounterItem 
              icon={<Briefcase className="w-10 h-10" />} 
              count={104} 
              text="Stable Investments"
            />
            <CounterItem 
              icon={<ThumbsUp className="w-10 h-10" />} 
              count={24000} 
              text="Happy Investors"
            />
            <CounterItem 
              icon={<Trophy className="w-10 h-10" />} 
              count={5} 
              text="International Awards"
            />
            <CounterItem 
              icon={<Users className="w-10 h-10" />} 
              count={65} 
              text="Team Members"
              hasBorder={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface CounterItemProps {
  icon: React.ReactNode
  count: number
  text: string
  hasBorder?: boolean
}

function CounterItem({ icon, count, text, hasBorder = true }: CounterItemProps) {
  const [currentCount, setCurrentCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000 // ms
      const frameDuration = 1000 / 60 // 60fps
      const totalFrames = Math.round(duration / frameDuration)
      const counterIncrement = count / totalFrames
      
      let frame = 0
      const counter = setInterval(() => {
        frame++
        const currentValue = Math.min(Math.ceil(counterIncrement * frame), count)
        setCurrentCount(currentValue)
        
        if (frame === totalFrames) {
          clearInterval(counter)
        }
      }, frameDuration)
      
      return () => clearInterval(counter)
    }
  }, [isInView, count])

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`text-center ${hasBorder ? 'border-r border-[#e93c05]/20' : ''} md:border-r-0 lg:border-r`}
    >
      <div className="text-[#e93c05] mb-4">
        {icon}
      </div>
      <h3 className="text-4xl font-bold text-[#011a41] mb-2">
        {currentCount}
      </h3>
      <p className="text-gray-700 font-medium">{text}</p>
    </motion.div>
  )
} 