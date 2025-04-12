import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent } from './ui/dialog'

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal')
    
    if (!hasSeenModal) {
      // Show modal after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Set localStorage to remember that user has seen the modal
    localStorage.setItem('hasSeenNewsletterModal', 'true')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 z-10"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="grid md:grid-cols-2">
            {/* Image Section */}
            <div className="hidden md:block bg-[#011a41] flex-1">
              <img 
                src="/assets/images/newsletter-image.jpg" 
                alt="Newsletter" 
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            
            {/* Content Section */}
            <div className="bg-white p-6 md:p-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-600 mb-6">
                  Stay updated with our latest news, investment opportunities, and financial tips.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e93c05]"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e93c05]"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#e93c05] hover:bg-[#011a41] text-white"
                  >
                    Subscribe Now
                  </Button>
                </form>
                
                <p className="text-xs text-gray-500 mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 