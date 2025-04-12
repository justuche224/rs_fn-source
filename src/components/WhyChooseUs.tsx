import { motion } from 'framer-motion'
import { 
  Target, 
  HeadphonesIcon, 
  Wallet, 
  TrendingUp 
} from 'lucide-react'
import { 
  Card,
  CardContent
} from './ui/card'

export function WhyChooseUs() {
  const reasons = [
    {
      title: "Goal-oriented",
      description: "We created a sustainable investment system and have been continuously developing ever since.",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "24/7 Support",
      description: "All customer care support operatives are online 24hrs a day and willing to assist.",
      icon: <HeadphonesIcon className="w-8 h-8" />
    },
    {
      title: "Wealth Management",
      description: "Leveraging on our global reach and expertise, we deliver market intelligence and wealth management know-how that matters to our clients.",
      icon: <Wallet className="w-8 h-8" />
    },
    {
      title: "Stable Investment",
      description: "Our system protects investors from major impediments like market fluctuations, bearish trades and fraud.",
      icon: <TrendingUp className="w-8 h-8" />
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <span className="text-[#e93c05] font-semibold text-lg">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
            What makes us stand out.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <FeatureCard
                title={reason.title}
                description={reason.description}
                icon={reason.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="text-center h-full border-0 shadow-lg relative overflow-hidden py-8 px-6 bg-sidebar">
      {/* Background shapes */}
      <img 
        src="/assets/images/projects/project-shape1.png" 
        alt="Shape" 
        className="absolute top-0 left-0 w-20 opacity-10"
      />
      <img 
        src="/assets/images/projects/project-shape2.png" 
        alt="Shape" 
        className="absolute bottom-0 right-0 w-20 opacity-10"
      />

      <CardContent className="p-0 flex flex-col items-center">
        <div className="text-[#e93c05] bg-[#fcd1c4] p-4 rounded-full mb-6 relative">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-4 text-[#011a41]">
          {title}
        </h3>
        
        <p className="text-gray-700 mb-6">
          {description}
        </p>
        
        <div className="mt-auto">
          <a 
            href="/about" 
            className="inline-flex items-center text-[#e93c05] font-medium hover:text-[#011a41] transition-colors group"
          >
            Read More
            <svg 
              className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  )
} 