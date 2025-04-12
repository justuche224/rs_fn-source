import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,

} from '@/components/ui/carousel'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ChevronRight, Send } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'

export const Route = createFileRoute('/faqs')({
  component: FAQs,
})

function FAQs() {
  // Refs for scroll animations
  const titleSectionRef = useRef(null)
  const faqSectionRef = useRef(null)
  const contactSectionRef = useRef(null)
  const logoSectionRef = useRef(null)
  
  // Plugin for logo carousel autoplay
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  
  // InView states
  const titleInView = useInView(titleSectionRef, { once: false, amount: 0.3 })
  const faqInView = useInView(faqSectionRef, { once: false, amount: 0.3 })
  const contactInView = useInView(contactSectionRef, { once: false, amount: 0.3 })
  const logoInView = useInView(logoSectionRef, { once: false, amount: 0.3 })
  
  // Animation controls
  const titleControls = useAnimation()
  const faqControls = useAnimation()
  const contactControls = useAnimation()
  const logoControls = useAnimation()
  
  // Animate elements when they come into view
  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible')
    } else {
      titleControls.start('hidden')
    }
    
    if (faqInView) {
      faqControls.start('visible')
    } else {
      faqControls.start('hidden')
    }
    
    if (contactInView) {
      contactControls.start('visible')
    } else {
      contactControls.start('hidden')
    }
    
    if (logoInView) {
      logoControls.start('visible')
    } else {
      logoControls.start('hidden')
    }
  }, [titleInView, faqInView, contactInView, logoInView])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }
  
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  // FAQ items data
  const faqItems = [
    {
      question: "What is Resonant finance?",
      answer: "Founded in the UK, Resonant finance Enables it's clients to invest in the new digital asset economy with complete trust, providing a seamless, secure and easy-to-use bridge between digital and traditional assets."
    },
    {
      question: "Is Resonant finance Registered?",
      answer: "Resonant finance Ltd is a subsidiary of Neuro Holdings which is a company registered and established in the United Kingdom under registration number 18259."
    },
    {
      question: "How can I fund my investment account?",
      answer: "You can fund your investment account by the following simple steps, login to your investment dashboard, proceed to deposit select trading plan and choose preferred payment method, available methods are Bitcoin, Ethereum & Perfect Money"
    },
    {
      question: "What is Finance & Investment?",
      answer: "Finance is the study and discipline of money, currency and capital assets. It is related with, but not synonymous with economics, the study of production, distribution, and consumption of money, assets, goods and services. While investment is the dedication of an asset to attain an increase in value over a period of time. Investment requires a sacrifice of some present asset, such as time, money, or effort. In finance, the purpose of investing is to generate a return from the invested asset"
    },
    {
      question: "Why isn't direct bank deposit available?",
      answer: "Due to high international deposit charges and related taxes, We only accept deposits with Bitcoin, Ethereum and USDT"
    },
    {
      question: "How safe is investment?",
      answer: "The safety of an investment is dependent on it's volatility and also the company that puts it up for stake, investing with an efficient company is zeroes out the risk of loss."
    }
  ]
  
  // Services list data
  const servicesList = [
    "Cash Investment",
    "Personal Insurance", 
    "Education Loan",
    "Financial Planning"
  ]
  
  // Partner logos data
  const partnerLogos = [
    "logo1.png",
    "logo2.png",
    "logo3.png",
    "logo4.png",
    "logo5.png"
  ]

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    policy: '',
    subject: '',
    message: ''
  })
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      policy: '',
      subject: '',
      message: ''
    })
  }

  return (
      <div className="min-h-screen bg-background">
      {/* Page Title Section */}
      <motion.div 
        ref={titleSectionRef}
        initial={{ opacity: 0 }}
        animate={titleControls}
        variants={fadeIn}
        className="relative bg-cover bg-center py-28" 
        style={{ backgroundImage: "url('/assets/images/page-title-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,6,16,0.89)] to-[rgba(1,6,16,0.35)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center mt-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">FAQ</h2>
            <ul className="flex items-center justify-center">
              <li className="text-white mx-2">
                <Link to="/" className="text-white hover:text-[#e93c05]">Home</Link>
              </li>
              <li className="text-white mx-2">/</li>
              <li className="text-white mx-2">
                <span>FAQ</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.section 
        ref={faqSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={faqControls}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FAQ Column */}
            <div className="lg:col-span-8">
              <motion.div 
                variants={fadeIn}
                className="text-left mb-10"
              >
                <span className="text-[#e93c05] font-semibold">Finon FAQ</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">Frequently Asked Questions</h2>
                <p className="mt-4">
                  Here are some questions popularly asked by investors and the most suitable answers.
                </p>
              </motion.div>
              
              <motion.div 
                variants={staggerChildren}
                className="space-y-4"
              >
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <motion.div 
                      key={index}
                      variants={fadeInUp}
                      custom={index}
                    >
                      <AccordionItem value={`item-${index}`} className="border border-gray-200 rounded-md mb-4 overflow-hidden shadow-sm">
                        <AccordionTrigger className="px-5 py-4 text-left font-semibold bg-[#fcf7f5] hover:bg-[#e93c05] hover:text-white data-[state=open]:bg-[#e93c05] data-[state=open]:text-white">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 py-4 text-gray-700">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            </div>
            
            {/* Sidebar Column */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Services List */}
                <motion.div variants={fadeInUp} className="border border-gray-200 rounded-md p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 border-l-3 border-[#e93c05] pl-3">Services List</h3>
                  <ul className="space-y-3">
                    {servicesList.map((service, index) => (
                      <li key={index} className="border-b border-gray-100 pb-2">
                        <a href="#" className="flex justify-between items-center text-[#011f4c] hover:text-[#e93c05] py-2 px-3 bg-[#fef7f3] font-semibold">
                          {service}
                          <ChevronRight className="h-5 w-5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                
                {/* CTA Card */}
                <motion.div
                  variants={fadeInUp}
                  className="relative rounded-md overflow-hidden"
                >
                  <img 
                    src="/assets/images/services/service-details4.jpg" 
                    alt="Ready to get started?" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,26,65,0.9)] to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Ready to get started?</h3>
                    <Button 
                      className="bg-[#e93c05] hover:bg-white text-white hover:text-[#011a41] px-6 py-5 font-semibold rounded-md relative overflow-hidden group"
                    >
                      Sign Up For Account
                      <span className="absolute w-0 h-0 rounded-[5px] bg-white group-hover:w-[225%] group-hover:h-[562.5px] transition-all duration-500 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-100"></span>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Get In Touch Section */}
      <motion.section 
        ref={contactSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={contactControls}
        className="py-24 bg-[#011a41] relative"
      >
        <div className="absolute top-0 left-0 opacity-30">
          <img src="/assets/images/touch-shape1.png" alt="Shape" className="animate-[opacity-pulse_3s_linear_infinite]" />
        </div>
        <div className="absolute bottom-0 right-0 opacity-30">
          <img src="/assets/images/touch-shape2.png" alt="Shape" className="animate-[opacity-pulse-alt_3s_linear_infinite]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact Form */}
            <motion.div 
              variants={fadeInUp}
              className="text-white"
            >
              <div className="mb-8">
                <span className="text-[#e93c05] font-semibold">Get In Touch</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Request A Call Back</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name" 
                      className="w-full h-12 px-4 bg-[#313e55] text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email" 
                      className="w-full h-12 px-4 bg-[#313e55] text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone" 
                      className="w-full h-12 px-4 bg-[#313e55] text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <select 
                      name="policy" 
                      value={formData.policy}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-[#313e55] text-gray-400 focus:outline-none"
                    >
                      <option value="" disabled selected>Choose a policy</option>
                      <option value="terms">Terms of Use</option>
                      <option value="privacy">Privacy Policy</option>
                      <option value="refund">Refund Policy</option>
                      <option value="investment">Investment Policy</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject" 
                    className="w-full h-12 px-4 bg-[#313e55] text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <textarea 
                    name="message" 
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6} 
                    placeholder="Message" 
                    className="w-full px-4 py-3 bg-[#313e55] text-white placeholder-gray-400 focus:outline-none"
                    required
                  ></textarea>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="submit"
                    className="bg-[#e93c05] hover:bg-white text-white hover:text-[#011a41] px-6 py-3 font-semibold rounded-md relative overflow-hidden group w-full md:w-auto"
                  >
                    <span className="mr-2">Send Message</span>
                    <Send className="h-4 w-4" />
                    <span className="absolute w-0 h-0 rounded-[5px] bg-white group-hover:w-[225%] group-hover:h-[562.5px] transition-all duration-500 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-100"></span>
                  </Button>
                </motion.div>
              </form>
            </motion.div>
            
            {/* Contact Image */}
            <motion.div 
              variants={fadeInUp}
              className="hidden lg:block"
            >
              <img 
                src="/assets/images/touch-main.jpg" 
                alt="Contact Us" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Partners/Logo Section */}
      <motion.section 
        ref={logoSectionRef}
        variants={fadeIn}
        initial="hidden"
        animate={logoControls}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {partnerLogos.map((logo, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                  <div className="flex items-center justify-center p-6">
                    <img 
                      src={`/assets/images/logo/${logo}`} 
                      alt={`Partner Logo ${index + 1}`} 
                      className="h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </motion.section>
    </div>
  )
}
