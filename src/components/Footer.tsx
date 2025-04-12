import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { useLocation } from "@tanstack/react-router";

export function Footer() {
  const location = useLocation();
  const showFooterLocations = [
    "/",
    "/about",
    "/our-team",
    "/faqs",
    "/contact",
    "/buy-crypto",
    "/sign-in",
    "/sign-up",
    "/reset-password",
    "/forgot-password",
  ];
  const showFooter = showFooterLocations.includes(location.pathname);
  if (!showFooter) return null;
  return (
    <footer className="bg-[#011a41] bg-[url('/assets/images/footer-bg.png')] bg-cover bg-center">
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Info */}
          <div>
            <div className="mb-6">
              <a href="/" className="inline-block">
                <img
                  src="/assets/images/logo.png"
                  alt="Resonant Finance"
                  className="h-12"
                />
              </a>
            </div>

            <p className="text-white mb-6">
              Resonant finance provides online investment opportunities for
              private individuals and cooporate bodies who wish to grow their
              capital passively.
            </p>

            <ul className="space-y-4">
              <li className="flex text-white">
                <Phone className="w-5 h-5 text-[#e93c05] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold mr-2">Phone:</span>
                  <a
                    href="tel:+16085727901"
                    className="hover:text-[#e93c05] transition-colors"
                  >
                    +16085727901
                  </a>
                </div>
              </li>
              <li className="flex text-white">
                <Mail className="w-5 h-5 text-[#e93c05] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold mr-2">Email:</span>
                  <a
                    href="mailto:support@resonantfinance.org"
                    className="hover:text-[#e93c05] transition-colors"
                  >
                    support@resonantfinance.org
                  </a>
                </div>
              </li>
              <li className="flex text-white">
                <MapPin className="w-5 h-5 text-[#e93c05] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold mr-2">Address:</span>
                  <a
                    href="#"
                    className="hover:text-[#e93c05] transition-colors"
                  >
                    116 John St, New York, NY 10038
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-6 relative pb-3 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-12 before:h-0.5 before:bg-[#e93c05]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/our-team"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/certificate"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Certificate
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-6 relative pb-3 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-12 before:h-0.5 before:bg-[#e93c05]">
              Newsletter
            </h3>
            <p className="text-white mb-6">
              Get latest news and updates straight to your mailbox.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full h-12 px-4 text-gray-700 bg-white border-0 focus:outline-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#e93c05] hover:bg-[#011a41] border border-[#e93c05] hover:border-white text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Column 4: What We Do */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-6 relative pb-3 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-12 before:h-0.5 before:bg-[#e93c05]">
              What We Do
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Financial Advice
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Planning Strategies
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Investment Trending
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Wealth Commitment
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white hover:text-[#e93c05] transition-colors hover:pl-1 block"
                >
                  States Element
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#091629] py-6">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-white">
            Copyright ©2024:{" "}
            <a
              href="/"
              className="text-[#e93c05] font-semibold hover:text-white transition-colors"
            >
              Resonant Finance Limited
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
