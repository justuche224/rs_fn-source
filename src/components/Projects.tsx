import { motion } from 'framer-motion'
import { 
  Card,
  CardContent
} from './ui/card'

export function Projects() {
  const projects = [
    {
      title: "Investment Trading",
      category: "Trading",
      image: "projects1.jpg"
    },
    {
      title: "Financial Growth",
      category: "Finance",
      image: "projects2.jpg"
    },
    {
      title: "Fund Management",
      category: "Management",
      image: "projects3.jpg"
    },
    {
      title: "Online Payment",
      category: "Payment",
      image: "projects4.jpg"
    },
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
          <span className="text-[#e93c05] font-semibold text-lg">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
            Investment opportunities available with Resonant finance.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <ProjectCard
                title={project.title}
                category={project.category}
                image={project.image}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  title: string
  category: string
  image: string
}

function ProjectCard({ title, category, image }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden group border-0 shadow-lg py-0">
      <CardContent className="p-0 relative">
        <div className="overflow-hidden">
          <img 
            src={`/assets/images/projects/${image}`}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
          <h3 className="text-xl font-semibold mb-1 group-hover:text-[#e93c05] transition-colors">
            <a href="#" className="hover:underline">{title}</a>
          </h3>
          <a 
            href="#" 
            className="text-[#e93c05] font-medium hover:text-white transition-colors"
          >
            {category}
          </a>
        </div>
      </CardContent>
    </Card>
  )
} 