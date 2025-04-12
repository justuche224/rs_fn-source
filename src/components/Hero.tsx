import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#7d7ab9] to-[rgba(125,122,185,0.3)]">
      <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
        }),
        Fade()
      ]}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          <CarouselItem>
            <HeroSlide 
              title="Financial Assistance With True Purpose"
              subtitle="Your Financial Status Is In Good Hands"
              description="Come aboard the best investment solutions provider, with proper planning and assistance, financial freedom is attainable. Learn how to boost your savings and income with proper investing."
              buttonText="Contact Us"
              buttonLink="/contact"
              bgImage="banner-bg2"
            />
          </CarouselItem>
          <CarouselItem>
            <HeroSlide 
              title="Resonant finance Gives Business Opportunity"
              subtitle="Your Financial Status Is In Good Hands"
              description="Not all businesses have branches and sell products, but you could leverage on reliable online investments to deliver good profits, as obtainable from a physical business. Best part is that you can do all this from home."
              buttonText="Sign Up"
              buttonLink="/register"
              bgImage="banner-bg3"
            />
          </CarouselItem>
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-[#e93c05] text-white hover:bg-[#011a41]" />
          <CarouselNext className="right-4 bg-[#e93c05] text-white hover:bg-[#011a41]" />
        </div>
      </Carousel>
    </div>
  )
}

interface HeroSlideProps {
  title: string
  subtitle: string
  description: string
  buttonText: string
  buttonLink: string
  bgImage: string
}

function HeroSlide({ title, subtitle, description, buttonText, buttonLink, bgImage }: HeroSlideProps) {
  return (
    <div className={`h-screen min-h-[600px] w-full bg-cover bg-center relative`} style={{ backgroundImage: `url(/assets/images/banner/${bgImage}.jpg)` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative h-full flex items-center z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="block text-white text-lg font-semibold mb-4"
            >
              {subtitle}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white text-lg md:text-xl mb-8 max-w-xl"
            >
              {description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button 
                asChild
                className="bg-[#e93c05] hover:bg-[#011a41] text-white px-8 py-6 rounded-md text-lg font-semibold transition-colors"
              >
                <Link to={buttonLink}>
                  {buttonText}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 