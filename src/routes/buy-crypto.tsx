import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ExternalLink, Search, TrendingUp, Shield, CreditCard, DollarSign } from 'lucide-react'

export const Route = createFileRoute('/buy-crypto')({
  component: BuyCrypto,
})

function BuyCrypto() {
  // Refs for scroll animations
  const heroSectionRef = useRef(null)
  const featuredSectionRef = useRef(null)
  const exchangesSectionRef = useRef(null)
  const ctaSectionRef = useRef(null)
  
  // InView states
  const heroInView = useInView(heroSectionRef, { once: true, amount: 0.1 })
  const featuredInView = useInView(featuredSectionRef, { once: true, amount: 0.1 })
  const exchangesInView = useInView(exchangesSectionRef, { once: true, amount: 0.1 })
  const ctaInView = useInView(ctaSectionRef, { once: true, amount: 0.1 })
  
  // Animation controls
  const heroControls = useAnimation()
  const featuredControls = useAnimation()
  const exchangesControls = useAnimation()
  const ctaControls = useAnimation()
  
  // Animate elements when they come into view
  useEffect(() => {
    if (heroInView) heroControls.start('visible')
    if (featuredInView) featuredControls.start('visible')
    if (exchangesInView) exchangesControls.start('visible')
    if (ctaInView) ctaControls.start('visible')
  }, [heroInView, featuredInView, exchangesInView, ctaInView])

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
        staggerChildren: 0.1
      }
    }
  }

  // Exchange data
  const exchanges = [
    {
      name: "Binance",
      image: "/assets/images/exchanges/binance.jpg",
      url: "https://www.binance.com/",
      category: "CEX",
      paymentMethods: ["Credit Card", "Bank Transfer", "Crypto"],
      description: "The world's largest cryptocurrency exchange by trading volume, offering a wide range of cryptocurrencies and features.",
      rating: 4.8,
      featured: true
    },
    {
      name: "Coinbase",
      image: "/assets/images/exchanges/coinbase.jpg",
      url: "https://www.coinbase.com/",
      category: "CEX",
      paymentMethods: ["Credit Card", "Bank Transfer", "PayPal"],
      description: "A secure platform that makes it easy to buy, sell, and store cryptocurrency like Bitcoin, Ethereum, and more.",
      rating: 4.6,
      featured: true
    },
    {
      name: "Kraken",
      image: "/assets/images/exchanges/kraken.jpg",
      url: "https://www.kraken.com/",
      category: "CEX",
      paymentMethods: ["Bank Transfer", "Crypto"],
      description: "A feature-rich trading platform for beginners and professionals alike.",
      rating: 4.5,
      featured: true
    },
    {
      name: "Valr",
      image: "/assets/images/exchanges/valr.png",
      url: "https://www.valr.com/",
      category: "CEX",
      paymentMethods: ["Bank Transfer", "Crypto"],
      description: "A cryptocurrency exchange built for Africa, offering Bitcoin and other digital assets.",
      rating: 4.3
    },
    {
      name: "Localbitcoins",
      image: "/assets/images/exchanges/localbitcoins.jpg",
      url: "https://www.localbitcoins.com/",
      category: "P2P",
      paymentMethods: ["Bank Transfer", "Cash", "Mobile Money"],
      description: "A peer-to-peer Bitcoin marketplace connecting buyers and sellers directly.",
      rating: 4.2
    },
    {
      name: "Coinmama",
      image: "/assets/images/exchanges/coinmama.png",
      url: "https://www.coinmama.com/",
      category: "CEX",
      paymentMethods: ["Credit Card", "Bank Transfer"],
      description: "A financial service that makes it fast, safe and fun to buy digital assets.",
      rating: 4.0
    },
    {
      name: "Bitpay",
      image: "/assets/images/exchanges/bitpay.png",
      url: "https://bitpay.com/",
      category: "Wallet",
      paymentMethods: ["Credit Card", "Bank Transfer"],
      description: "A payment service provider allowing merchants to accept cryptocurrencies as payment.",
      rating: 4.4
    },
    {
      name: "Moonpay",
      image: "/assets/images/exchanges/moonpay.png",
      url: "https://moonpay.com/",
      category: "Fiat Gateway",
      paymentMethods: ["Credit Card", "Bank Transfer", "Apple Pay"],
      description: "A financial technology company that builds payment infrastructure for cryptocurrencies.",
      rating: 4.1
    },
    {
      name: "Cex.io",
      image: "/assets/images/exchanges/cex.io.png",
      url: "https://cex.io/",
      category: "CEX",
      paymentMethods: ["Credit Card", "Bank Transfer", "Crypto"],
      description: "A multifunctional cryptocurrency exchange enabling crypto-to-fiat transactions.",
      rating: 4.3
    },
    {
      name: "Mercado Bitcoin",
      image: "/assets/images/exchanges/mercado.png",
      url: "https://mercadobitcoin.com.br/",
      category: "CEX",
      paymentMethods: ["Bank Transfer", "PIX"],
      description: "The largest cryptocurrency platform in Latin America.",
      rating: 4.2
    },
    {
      name: "Zebpay",
      image: "/assets/images/exchanges/zebpay.png",
      url: "https://zebpay.com/",
      category: "CEX",
      paymentMethods: ["Bank Transfer", "UPI"],
      description: "A cryptocurrency exchange serving customers in over 160 countries.",
      rating: 4.0
    },
    {
      name: "Bitpanda",
      image: "/assets/images/exchanges/bitpanda.png",
      url: "https://bitpanda.com/",
      category: "CEX",
      paymentMethods: ["Credit Card", "Bank Transfer", "SEPA"],
      description: "A European neobroker platform for stocks, ETFs, cryptocurrencies, and precious metals.",
      rating: 4.5
    }
  ]

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")

  // Filter exchanges based on search term and category
  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = exchange.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = category === "all" || exchange.category === category
    
    return matchesSearch && matchesCategory
  })

  // Featured exchanges
  const featuredExchanges = exchanges.filter(exchange => exchange.featured)

  // Rating stars renderer
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-sm">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div 
        ref={heroSectionRef}
        initial="hidden"
        animate={heroControls}
        variants={fadeIn}
        className="relative bg-cover bg-center py-32 md:py-40" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(1,26,65,0.85), rgba(1,26,65,0.85)), url('/assets/images/crypto-bg.jpg')"
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Gateway to <span className="text-[#e93c05]">Digital Assets</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Find the best cryptocurrency exchanges to buy, sell, and trade digital assets. 
              We've curated a list of trusted platforms to help you start your crypto journey.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search exchanges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-full text-gray-800 bg-white border-0 shadow-lg focus:ring-2 focus:ring-[#e93c05] focus:outline-none"
              />
              <Search className="absolute top-4 left-4 h-6 w-6 text-gray-400" />
            </div>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L60,85.3C120,75,240,53,360,48C480,43,600,53,720,64C840,75,960,85,1080,80C1200,75,1320,53,1380,42.7L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.section
        ref={featuredSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={featuredControls}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#011a41]">Trusted Exchanges</h3>
              <p className="text-gray-600">
                We only list verified and secure exchanges with proven track records.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#011a41]">Multiple Payment Options</h3>
              <p className="text-gray-600">
                Buy crypto using credit cards, bank transfers, and other payment methods.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#011a41]">Growing Portfolio</h3>
              <p className="text-gray-600">
                Access a wide range of cryptocurrencies to diversify your investments.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5">
                <DollarSign className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#011a41]">Competitive Rates</h3>
              <p className="text-gray-600">
                Get the best rates and lowest fees when buying or trading digital assets.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Exchanges */}
      <motion.section 
        variants={fadeInUp}
        initial="hidden"
        animate={featuredControls}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeIn}
            className="text-center mb-14"
          >
            <span className="text-[#e93c05] font-semibold">Top Picks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">Featured Exchanges</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              Start with these trusted platforms recommended by our team of experts.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredExchanges.map((exchange, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={exchange.image}
                    alt={exchange.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-[#e93c05] text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-[#011a41]">{exchange.name}</h3>
                    {renderRatingStars(exchange.rating)}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {exchange.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {exchange.category}
                    </span>
                    {exchange.paymentMethods.map((method, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {method}
                      </span>
                    ))}
                  </div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      asChild
                      className="w-full bg-[#e93c05] hover:bg-[#011a41] text-white px-6 py-3 font-semibold rounded-md relative overflow-hidden group"
                    >
                      <a href={exchange.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                        <span className="mr-2">Visit Exchange</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* All Exchanges Section */}
      <motion.section 
        ref={exchangesSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={exchangesControls}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeIn}
            className="text-center mb-14"
          >
            <span className="text-[#e93c05] font-semibold">Explore Options</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">All Cryptocurrency Exchanges</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              Compare different platforms to find the perfect fit for your needs.
            </p>
          </motion.div>
          
          <div className="mb-10">
            <Tabs defaultValue="all" className="w-full" onValueChange={setCategory}>
              <TabsList className="grid grid-cols-5 mb-8 w-full max-w-3xl mx-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="CEX">Centralized</TabsTrigger>
                <TabsTrigger value="P2P">Peer-to-Peer</TabsTrigger>
                <TabsTrigger value="Fiat Gateway">Fiat Gateway</TabsTrigger>
                <TabsTrigger value="Wallet">Wallets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredExchanges.map((exchange, index) => (
                    <motion.div 
                      key={index}
                      variants={fadeInUp}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                            <img
                              src={exchange.image}
                              alt={exchange.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[#011a41]">{exchange.name}</h3>
                            {renderRatingStars(exchange.rating)}
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {exchange.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-gray-600 text-sm mb-4">
                          {exchange.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-medium text-gray-500">Payment Methods:</span>
                          {exchange.paymentMethods.map((method, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {method}
                            </span>
                          ))}
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            asChild
                            variant="outline"
                            className="w-full border-[#e93c05] text-[#e93c05] hover:bg-[#e93c05] hover:text-white font-medium rounded-md"
                          >
                            <a href={exchange.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                              <span className="mr-2">Visit</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {filteredExchanges.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No exchanges found matching your search criteria.</p>
                    <Button 
                      onClick={() => {setSearchTerm(""); setCategory("all");}}
                      className="mt-4 bg-[#e93c05] hover:bg-[#011a41] text-white"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="CEX" className="mt-0">
                {/* Content gets filtered by the onChange handler */}
              </TabsContent>
              
              <TabsContent value="P2P" className="mt-0">
                {/* Content gets filtered by the onChange handler */}
              </TabsContent>
              
              <TabsContent value="Fiat Gateway" className="mt-0">
                {/* Content gets filtered by the onChange handler */}
              </TabsContent>
              
              <TabsContent value="Wallet" className="mt-0">
                {/* Content gets filtered by the onChange handler */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        ref={ctaSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={ctaControls}
        className="py-24 bg-gradient-to-r from-[#011a41] to-[#012a61] text-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Journey to <span className="text-[#e93c05]">Financial Freedom</span></h2>
            <p className="text-lg text-gray-300 mb-8">
              Whether you're a beginner or an experienced trader, we've got the resources to help you succeed in the world of cryptocurrency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  asChild
                  className="bg-[#e93c05] hover:bg-white text-white hover:text-[#e93c05] px-8 py-3 font-bold rounded-md"
                >
                  <Link to="/">
                    Get Started
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  asChild
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#011a41] px-8 py-3 font-bold rounded-md"
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

