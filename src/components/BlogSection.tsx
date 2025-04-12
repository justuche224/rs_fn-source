import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'
import { 
  Card,
  CardContent
} from './ui/card'

export function BlogSection() {
  const blogs = [
    {
      title: "Global equity income Q&A: Richard Saldanha on the outlook for dividends and growth",
      date: "27 June, 2022",
      image: "blog1.jpg",
      description: "The lead manager of our Global Equity Income strategy discusses risks and opportunities for income-seeking investors in a turbulent time for markets."
    },
    {
      title: "The AIQ Podcast: Taking stock of nature risk",
      date: "28 July, 2022",
      image: "blog2.jpg",
      description: "The idea that human actions are bringing natural systems close to breakdown, threatening livelihoods and financial stability, is making asset managers think harder about nature risk and the environmental dependencies in investee companies."
    },
    {
      title: "UK Equity Income: Five questions with Chris Murphy",
      date: "1 August, 2022",
      image: "blog3.jpg",
      description: "The manager of our UK Equity Income strategy explains why investors need to change their mindsets about what to pay for growth and cautions against buying yield for its own sake."
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
          <span className="text-[#e93c05] font-semibold text-lg">Latest News</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
            Latest News From Blog
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <BlogCard
                title={blog.title}
                date={blog.date}
                image={blog.image}
                description={blog.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface BlogCardProps {
  title: string
  date: string
  image: string
  description: string
}

function BlogCard({ title, date, image, description }: BlogCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg h-full transition-all duration-300 hover:-translate-y-2 bg-sidebar">
        <div className="overflow-hidden bg-sidebar p-3">
        <img 
          src={`/assets/images/blog/${image}`}
          alt={title}
          className="w-full h-52 object-cover rounded transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center text-sm mb-4">
          <div className="flex items-center mr-4">
            <User className="w-4 h-4 mr-1" />
            by
            <a href="#" className="ml-1 hover:text-[#e93c05]">Admin</a>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {date}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-[#011a41] hover:text-[#e93c05] transition-colors">
          <a href="#">{title}</a>
        </h3>
        
        <p className=" mb-4 line-clamp-3">
          {description}
        </p>
        
        <a 
          href="#" 
          className="inline-block text-[#e93c05] font-medium hover:underline"
        >
          Read More
        </a>
      </CardContent>
    </Card>
  )
} 