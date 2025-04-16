import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, useInView, useAnimation } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export const Route = createFileRoute("/our-team")({
  component: OurTeam,
});

function OurTeam() {
  // Refs for scroll animations
  const titleSectionRef = useRef(null);
  const teamSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);

  // InView states
  const titleInView = useInView(titleSectionRef, { once: false, amount: 0.3 });
  const teamInView = useInView(teamSectionRef, { once: false, amount: 0.3 });
  const ctaInView = useInView(ctaSectionRef, { once: false, amount: 0.3 });

  // Animation controls
  const titleControls = useAnimation();
  const teamControls = useAnimation();
  const ctaControls = useAnimation();

  // Autoplay plugin ref
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  // Animate elements when they come into view
  useEffect(() => {
    if (titleInView) {
      titleControls.start("visible");
    } else {
      titleControls.start("hidden");
    }

    if (teamInView) {
      teamControls.start("visible");
    } else {
      teamControls.start("hidden");
    }

    if (ctaInView) {
      ctaControls.start("visible");
    } else {
      ctaControls.start("hidden");
    }
  }, [titleInView, teamInView, ctaInView]);

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

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Team members data
  const teamMembers = [
    { img: "team2.jpg", name: "Digo Mera", position: "CEO" },
    {
      img: "team7.jpg",
      name: "Annabel West",
      position: "Senior Finance Expert",
    },
    {
      img: "team8.jpg",
      name: "Blanca Estrada",
      position: "Director of  Technical Accounting",
    },
    { img: "team3.jpg", name: "Mackob Testa", position: "Consultant" },
    { img: "team5.jpg", name: "Jac Jacson", position: "Research Expert" },
    { img: "team6.jpg", name: "Micheal Smith", position: "Accounts Manager" },
    {
      img: "team1.jpg",
      name: "Keten Moris",
      position: "Investment Strategist",
    },
  ];

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
              Our Team
            </h2>
            <ul className="flex items-center justify-center">
              <li className="text-white mx-2">
                <Link to="/" className="text-white hover:text-[#e93c05]">
                  Home
                </Link>
              </li>
              <li className="text-white mx-2">/</li>
              <li className="text-white mx-2">
                <span>Our Team</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Team Members Section */}
      <motion.section
        ref={teamSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={teamControls}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center mb-10">
            <span className="text-[#e93c05] font-semibold">
              Our Expert Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
              Meet Our Team Of Finance Experts
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-gray-600">
              Our team of experienced professionals is dedicated to providing
              exceptional financial services and helping our clients achieve
              their financial goals.
            </p>
          </motion.div>

          {/* Desktop team grid */}
          <motion.div
            variants={staggerChildren}
            className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="team-item mb-8 transition-transform hover:-translate-y-2 duration-300 group"
              >
                <div className="top relative overflow-hidden rounded-t-lg">
                  <img
                    src={`/assets/images/team/${member.img}`}
                    alt={member.name}
                    className="w-full h-[500px]"
                  />
                  <ul className="absolute top-16 left-6">
                    <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <a
                        href="#"
                        target="_blank"
                        className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateY(360deg)]"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    </li>
                    <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <a
                        href="#"
                        target="_blank"
                        className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateX(360deg)]"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    </li>
                    <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <a
                        href="#"
                        target="_blank"
                        className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateY(360deg)]"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    </li>
                    <li className="block mb-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <a
                        href="#"
                        target="_blank"
                        className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateX(360deg)]"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="bottom max-w-[285px] mx-auto bg-[#f5f4f4] group-hover:bg-white relative text-center pt-5 pb-6 -mt-4 shadow-md transition-all duration-300">
                  <img
                    src="/assets/images/team/team-shape1.png"
                    alt="Shape"
                    className="absolute top-0 right-0 w-[35px]"
                  />
                  <h3 className="text-2xl font-bold mb-1.5">{member.name}</h3>
                  <span className="block text-[#e93c05] font-semibold text-sm">
                    {member.position}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile carousel with autoplay */}
          <div className="md:hidden mt-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full"
            >
              <CarouselContent>
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="team-item mb-8 transition-transform hover:-translate-y-2 duration-300 group">
                      <div className="top relative overflow-hidden rounded-t-lg">
                        <img
                          src={`/assets/images/team/${member.img}`}
                          alt={member.name}
                          className="w-full"
                        />
                        <ul className="absolute top-16 left-6">
                          <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <a
                              href="#"
                              target="_blank"
                              className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateY(360deg)]"
                            >
                              <Facebook className="w-5 h-5" />
                            </a>
                          </li>
                          <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <a
                              href="#"
                              target="_blank"
                              className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateX(360deg)]"
                            >
                              <Twitter className="w-5 h-5" />
                            </a>
                          </li>
                          <li className="block mb-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <a
                              href="#"
                              target="_blank"
                              className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateY(360deg)]"
                            >
                              <Linkedin className="w-5 h-5" />
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="bottom max-w-[285px] mx-auto bg-[#f5f4f4] group-hover:bg-white relative text-center pt-5 pb-6 -mt-4 shadow-md transition-all duration-300">
                        <img
                          src="/assets/images/team/team-shape1.png"
                          alt="Shape"
                          className="absolute top-0 right-0 w-[35px]"
                        />
                        <h3 className="text-2xl font-bold mb-1.5">
                          {member.name}
                        </h3>
                        <span className="block text-[#e93c05] font-semibold text-sm">
                          {member.position}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-6">
                <CarouselPrevious className="absolute top-[40%] left-0 w-10 h-10 rounded-full text-white bg-[#e93c05] hover:bg-[#011a41]" />
                <CarouselNext className="absolute top-[40%] right-0 w-10 h-10 rounded-full text-white bg-[#e93c05] hover:bg-[#011a41]" />
              </div>
            </Carousel>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaSectionRef}
        variants={fadeInUp}
        initial="hidden"
        animate={ctaControls}
        className="py-24 bg-[#f9f9f9]"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            className="book-content max-w-[1200px] mx-auto py-24 px-12 rounded-[10px] bg-[#011a41] text-center relative z-10"
          >
            <div className="book-shape">
              <img
                src="/assets/images/book-shape1.png"
                alt="Shape"
                className="absolute top-0 left-0 z-[-1] animate-[opacity-pulse_3s_linear_infinite]"
              />
              <img
                src="/assets/images/book-shape2.png"
                alt="Shape"
                className="absolute bottom-0 right-0 z-[-1] animate-[opacity-pulse-alt_3s_linear_infinite]"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2.5">
              Join Our Team
            </h2>
            <p className="text-xl text-white mb-4">
              We're always looking for talented individuals to join our team
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-[#e93c05] hover:bg-white text-white hover:text-[#011a41] px-6 py-3 font-semibold rounded-md relative overflow-hidden group"
              >
                <Link to="/contact">
                  Contact Us
                  <span className="absolute w-0 h-0 rounded-[5px] bg-white group-hover:w-[225%] group-hover:h-[562.5px] transition-all duration-500 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-100"></span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
