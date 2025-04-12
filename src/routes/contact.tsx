import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView, useAnimation } from "framer-motion";
import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  // Refs for scroll animations
  const titleSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const mapSectionRef = useRef(null);

  // InView states
  const titleInView = useInView(titleSectionRef, { once: false, amount: 0.3 });
  const contactInView = useInView(contactSectionRef, {
    once: false,
    amount: 0.3,
  });
  const mapInView = useInView(mapSectionRef, { once: false, amount: 0.3 });

  // Animation controls
  const titleControls = useAnimation();
  const contactControls = useAnimation();
  const mapControls = useAnimation();

  // Animate elements when they come into view
  useEffect(() => {
    if (titleInView) {
      titleControls.start("visible");
    } else {
      titleControls.start("hidden");
    }

    if (contactInView) {
      contactControls.start("visible");
    } else {
      contactControls.start("hidden");
    }

    if (mapInView) {
      mapControls.start("visible");
    } else {
      mapControls.start("hidden");
    }
  }, [titleInView, contactInView, mapInView]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">
              Contact Us
            </h2>
            <ul className="flex items-center justify-center">
              <li className="text-white mx-2">
                <Link to="/" className="text-white hover:text-[#e93c05]">
                  Home
                </Link>
              </li>
              <li className="text-white mx-2">/</li>
              <li className="text-white mx-2">
                <span>Contact</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Info Section */}
      <motion.section
        ref={contactSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={contactControls}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-14">
              <span className="text-[#e93c05] font-semibold">Contact Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
                Get In Touch With Us
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                Have questions about our services? Need assistance with your
                investments? Our team is ready to help you achieve your
                financial goals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {/* Phone */}
              <motion.div
                variants={fadeInUp}
                className="text-center p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5 group-hover:bg-[#e93c05] group-hover:text-white transition-colors">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#011a41]">Phone</h3>
                <p className="text-gray-600">
                  Our support team is available 24/7
                </p>
                <a
                  href="tel:+16085727901"
                  className="inline-block mt-3 text-[#e93c05] hover:underline"
                >
                  +1 608 572 7901
                </a>
              </motion.div>

              {/* Email */}
              <motion.div
                variants={fadeInUp}
                className="text-center p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5 group-hover:bg-[#e93c05] group-hover:text-white transition-colors">
                  <Mail className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#011a41]">Email</h3>
                <p className="text-gray-600">Drop us a line anytime</p>
                <a
                  href="mailto:info@resonantfinance.org"
                  className="inline-block mt-3 text-[#e93c05] hover:underline"
                >
                  info@resonantfinance.org
                </a>
              </motion.div>

              {/* Location */}
              <motion.div
                variants={fadeInUp}
                className="text-center p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5 group-hover:bg-[#e93c05] group-hover:text-white transition-colors">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#011a41]">
                  Location
                </h3>
                <p className="text-gray-600">Visit our office</p>
                <address className="inline-block mt-3 text-[#e93c05] not-italic">
                  192 London Bridge St, London SE1 9SG, UK
                </address>
              </motion.div>

              {/* Working Hours */}
              <motion.div
                variants={fadeInUp}
                className="text-center p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fee4db] text-[#e93c05] mb-5 group-hover:bg-[#e93c05] group-hover:text-white transition-colors">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#011a41]">
                  Open Hours
                </h3>
                <p className="text-gray-600">Monday - Friday</p>
                <p className="inline-block mt-3 text-[#e93c05]">
                  8:00 AM - 6:00 PM
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <motion.div
                variants={fadeInUp}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-6 text-[#011a41]">
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 font-medium"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:border-[#e93c05] text-gray-800 placeholder-gray-400 focus:outline-none rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:border-[#e93c05] text-gray-800 placeholder-gray-400 focus:outline-none rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-medium"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:border-[#e93c05] text-gray-800 placeholder-gray-400 focus:outline-none rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="block text-gray-700 font-medium"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Enter subject"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:border-[#e93c05] text-gray-800 placeholder-gray-400 focus:outline-none rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-gray-700 font-medium"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#e93c05] text-gray-800 placeholder-gray-400 focus:outline-none rounded-md"
                      required
                    ></textarea>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="bg-[#e93c05] hover:bg-[#011a41] text-white px-6 py-3 font-semibold rounded-md relative overflow-hidden group w-full md:w-auto"
                    >
                      <span className="mr-2">Send Message</span>
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </form>
              </motion.div>

              {/* Map */}
              <motion.div
                variants={fadeInUp}
                className="h-full bg-white p-8 rounded-lg shadow-md border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-6 text-[#011a41]">
                  Find Us on the Map
                </h3>
                <div className="rounded-lg overflow-hidden h-[400px] border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5045439814285!2d-0.09044452305465026!3d51.505464112037984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876035159bb4da1%3A0xa61e28267c3563ac!2sLondon%20Bridge%20St%2C%20London%20SE1%209SG%2C%20UK!5e0!3m2!1sen!2sus!4v1662109556941!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4 text-[#011a41]">
                    Our Office
                  </h4>
                  <p className="mb-2 flex items-start">
                    <MapPin className="h-5 w-5 text-[#e93c05] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      192 London Bridge St, London SE1 9SG, United Kingdom
                    </span>
                  </p>
                  <p className="mb-2 flex items-start">
                    <Phone className="h-5 w-5 text-[#e93c05] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">+1 608 572 7901</span>
                  </p>
                  <p className="flex items-start">
                    <Mail className="h-5 w-5 text-[#e93c05] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      info@resonantfinance.org
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
