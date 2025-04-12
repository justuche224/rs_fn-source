import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { 
  Card,
  CardContent
} from './ui/card'

export function Services() {
  const services = [
    {
      title: "Investment Planning",
      description: "Proper planning paves way for success, having a finance plan essential.",
      image: "services1.jpg"
    },
    {
      title: "Financial Consultancy",
      description: "A proper guide to investing helps an investor to make better investment choices.",
      image: "services2.jpg"
    },
    {
      title: "Online Banking & Loans",
      description: "Get decent loans and overdrafts, terms and conditions apply.",
      image: "services3.jpg"
    },
    {
      title: "Travel Insurance",
      description: "Already existing investors can travel round the world with an insurance.",
      image: "services4.jpg"
    },
    {
      title: "Business Advisor",
      description: "Get a personal business coach and learn investment at ur pace.",
      image: "services5.jpg"
    },
    {
      title: "Education Support",
      description: "Investment education is a critical step and must be taken.",
      image: "services6.jpg"
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
          <span className="text-[#e93c05] font-semibold text-lg">Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
            Exceptional Resonant finance Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                image={service.image}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  title: string
  description: string
  image: string
}

function ServiceCard({ title, description, image }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-sidebar">
      <div className="overflow-hidden">
        <img 
          src={`/assets/images/services/${image}`}
          alt={title}
          className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-[#011a41] hover:text-[#e93c05] transition-colors">
          <a href="#">{title}</a>
        </h3>
        <p className="mb-4">{description}</p>
        <div className="flex items-center text-[#e93c05] font-medium hover:text-[#011a41] transition-colors group">
          <ArrowRight className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
          <a href="#" className="group-hover:underline">Read More</a>
        </div>
      </CardContent>
    </Card>
  )
} 