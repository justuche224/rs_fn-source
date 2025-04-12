import { motion } from 'framer-motion'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'

export function Partners() {
  const partners = [
    { id: 1, logo: "logo1.png" },
    { id: 2, logo: "logo2.png" },
    { id: 3, logo: "logo3.png" },
    { id: 4, logo: "logo4.png" },
    { id: 5, logo: "logo5.png" }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
              Fade()
            ]}
            opts={{
              loop: true,
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {partners.map((partner) => (
                <CarouselItem key={partner.id} className="md:basis-1/3 lg:basis-1/5">
                  <div className="h-32 flex items-center justify-center p-4">
                    <motion.img 
                      src={`/assets/images/logo/${partner.logo}`}
                      alt={`Partner ${partner.id}`}
                      className="max-h-16 w-auto mx-auto transition-transform duration-300 filter grayscale hover:grayscale-0 hover:-translate-x-2"
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
} 