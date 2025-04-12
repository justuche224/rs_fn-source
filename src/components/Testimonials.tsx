import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel'
import Fade from 'embla-carousel-fade'
import Autoplay from 'embla-carousel-autoplay'

export function Testimonials() {
  const testimonials = [
    {
      name: "Richard Osborn",
      location: "Australia",
      image: "testimonials-thumb1.jpg",
      quote: "I made a deposit of $200 to my earningstar account then activated the basic plan after the duration I received my profit Successfully this company is the best so far and this is my third time investing with them."
    },
    {
      name: "Melissa Gwen",
      location: "Scotland",
      image: "testimonials-thumb2.jpg",
      quote: "I'm not a fan of online investment companies but after several attempts of persuasion from my colleague at work, I finally decided to try out this company and to my amazement they did pay me my actual profits."
    },
    {
      name: "Michelle Shawn",
      location: "Canada",
      image: "testimonials-thumb3.jpg",
      quote: "I give it a 3 star because I'm still new to the company but things seems to be going well."
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
          <span className="text-[#e93c05] font-semibold text-lg">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
            What Our Investors Says
          </h2>
        </motion.div>

        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
            Fade()
          ]}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <TestimonialCard
                  name={testimonial.name}
                  location={testimonial.location}
                  image={testimonial.image}
                  quote={testimonial.quote}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-1/2 bg-white border border-[#e93c05] text-[#e93c05] hover:bg-[#e93c05] hover:text-white" />
            <CarouselNext className="right-0 translate-x-1/2 bg-white border border-[#e93c05] text-[#e93c05] hover:bg-[#e93c05] hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  name: string
  location: string
  image: string
  quote: string
}

function TestimonialCard({ name, location, image, quote }: TestimonialCardProps) {
  return (
    <div className="text-center px-4 max-w-3xl mx-auto relative">
      <div className="mb-8 relative">
        <Quote className="absolute -top-4 -left-4 w-16 h-16 text-[#fce4db] rotate-180" />
        <h2 className="text-xl md:text-2xl font-normal italic text-[#011a41] relative z-10">
          {quote}
        </h2>
      </div>
      
      <img 
        src={`/assets/images/${image}`}
        alt={name}
        className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
      />
      
      <h3 className="text-xl font-semibold text-[#e93c05] mb-1">{name}</h3>
      <span className="text-gray-600">{location}</span>
    </div>
  )
} 