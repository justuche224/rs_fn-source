import { Link, useLocation } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { ModeToggle } from './mode-toggle'
import TranslateButton from './TranslateButton'

export function Navbar() {
  const location = useLocation()
  const showHeaderLocations = ["/", "/about", "/our-team", "/faqs", "/contact", "/buy-crypto", "/sign-in", "/sign-up", "/reset-password", "/forgot-password"]
  const showHeader = showHeaderLocations.includes(location.pathname)
  if (!showHeader) return null
  return (
    <>
      {/* Header with contact info */}
      <div className="bg-[#011a41] text-white py-2 text-sm hidden lg:block">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex items-center">
                <i className="bx bx-location-plus text-[#e93c05] mr-2"></i>
                <a href="#" className="hover:text-[#e93c05] transition-colors">
                  116 John St, New York, NY 10038
                </a>
              </div>
              <div className="flex items-center">
                <i className="bx bx-mail-send text-[#e93c05] mr-2"></i>
                <a href="mailto:support@resonantfinance.org" className="hover:text-[#e93c05] transition-colors">
                  support@resonantfinance.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-background sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/assets/images/logo.png" alt="ResonantFinance" className="h-10 lg:h-12" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <NavLinks />
              <Button
                className="bg-[#e93c05] hover:bg-[#011a41] text-white rounded-md transition-colors"
                asChild
              >
                <Link to="/sign-up">Create An Account</Link>
              </Button>
              <ModeToggle />
              <TranslateButton />
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[75vw] sm:w-[350px] p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex justify-start">
                      <img src="/assets/images/logo.png" alt="ResonantFinance" className="h-8" />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-6 px-6">
                    <MobileNavLinks />
                    <div className="mt-6">
                      <Button
                        className="bg-[#e93c05] hover:bg-[#011a41] text-white w-full"
                        asChild
                      >
                        <Link to="/sign-up">Create An Account</Link>
                      </Button>
                      <ModeToggle />
                      <TranslateButton />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function NavLinks() {
  return (
    <>
      <Link
        to="/"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors active:text-[#e93c05]"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors"
      >
        About
      </Link>
      <Link
        to="/our-team"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors"
      >
        Our Team
      </Link>
      <Link
        to="/faqs"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors"
      >
        FAQs
      </Link>
      <Link
        to="/contact"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors"
      >
        Contact Us
      </Link>
      <Link
        to="/buy-crypto"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors"
      >
        Buy Crypto
      </Link>
      <Link
        to="/sign-in"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] transition-colors"
      >
        Log in
      </Link>
    </>
  )
}

function MobileNavLinks() {
  return (
    <div className="flex flex-col space-y-4">
      <Link
        to="/"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        About
      </Link>
      <Link
        to="/our-team"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        Our Team
      </Link>
      <Link
        to="/faqs"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        FAQs
      </Link>
      <Link
        to="/contact"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        Contact Us
      </Link>
      <Link
        to="/buy-crypto"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        Buy Crypto
      </Link>
      <Link
        to="/sign-in"
        className="text-[#011a41] dark:text-white font-semibold hover:text-[#e93c05] py-2 border-b border-gray-100 transition-colors"
      >
        Log in
      </Link>
    </div>
  )
} 