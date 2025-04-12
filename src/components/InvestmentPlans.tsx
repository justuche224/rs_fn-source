import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Card,
  CardContent,
  CardFooter
} from './ui/card'
import { Button } from './ui/button'

export function InvestmentPlans() {
  const plans = [
    {
      title: "Basic Plan",
      icon: "piggy-bank.png",
      minDeposit: "$30",
      maxDeposit: "$499",
      duration: "24hrs",
      roi: "10%"
    },
    {
      title: "Bronze Plan",
      icon: "suitcase.png",
      minDeposit: "$500",
      maxDeposit: "$999",
      duration: "48hrs",
      roi: "25%"
    },
    {
      title: "Silver Plan",
      icon: "cloudcoin.png",
      minDeposit: "$1,000",
      maxDeposit: "$9,999",
      duration: "7 days",
      roi: "50%"
    },
    {
      title: "Gold Plan",
      icon: "officebank.png",
      minDeposit: "$10,000",
      maxDeposit: "$1,000,000",
      duration: "3 months",
      roi: "60%"
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#273272] mb-3">
            Our Plans
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Here's a brief breakdown of our flexible investment plans crafted for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <PlanCard
                title={plan.title}
                icon={plan.icon}
                minDeposit={plan.minDeposit}
                maxDeposit={plan.maxDeposit}
                duration={plan.duration}
                roi={plan.roi}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface PlanCardProps {
  title: string
  icon: string
  minDeposit: string
  maxDeposit: string
  duration: string
  roi: string
}

function PlanCard({ title, icon, minDeposit, maxDeposit, duration, roi }: PlanCardProps) {
  return (
    <Card className="shadow-xl border-0 text-center h-full bg-sidebar ">
      <CardContent className="pt-8 px-6 flex flex-col items-center">
        <img 
          src={`/assets/images/${icon}`}
          alt={title}
          className="w-20 h-20 object-contain mb-4"
        />
        
        <h3 className="text-xl font-bold text-[#273272] mb-2">{title}</h3>
        
        <hr className="w-1/2 h-0.5 bg-[#273272] my-2" />
        
        <ul className="space-y-3 mt-4 mb-6">
          <li className="">
            Minimum Deposit: <strong>{minDeposit}</strong>
          </li>
          <li className="">
            Maximum Deposit: <strong>{maxDeposit}</strong>
          </li>
          <li className="">
            Duration: <strong>{duration}</strong>
          </li>
          <li className="">
            ROI: <strong>{roi}</strong>
          </li>
        </ul>
      </CardContent>
      
      <CardFooter className="pb-8 pt-0 px-6 flex justify-center">
        <Button 
          asChild
          className="bg-[#e93c05] hover:bg-[#011a41] text-white font-semibold transition-colors"
        >
          <Link to="/sign-up">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 