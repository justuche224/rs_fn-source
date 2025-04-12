import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  // Scroll progress tracker

  // Refs for scroll animations
  const aboutSectionRef = useRef(null);
  const howToStartRef = useRef(null);
  const bookSectionRef = useRef(null);
  const teamSectionRef = useRef(null);
  const planSectionRef = useRef(null);

  // InView states
  const aboutInView = useInView(aboutSectionRef, { once: false, amount: 0.3 });
  const howToStartInView = useInView(howToStartRef, {
    once: false,
    amount: 0.3,
  });
  const bookInView = useInView(bookSectionRef, { once: false, amount: 0.3 });
  const teamInView = useInView(teamSectionRef, { once: false, amount: 0.3 });
  const planInView = useInView(planSectionRef, { once: false, amount: 0.3 });

  // Animation controls
  const aboutControls = useAnimation();
  const howToStartControls = useAnimation();
  const bookControls = useAnimation();
  const teamControls = useAnimation();
  const planControls = useAnimation();

  // Animate elements when they come into view
  useEffect(() => {
    if (aboutInView) {
      aboutControls.start("visible");
    } else {
      aboutControls.start("hidden");
    }

    if (howToStartInView) {
      howToStartControls.start("visible");
    } else {
      howToStartControls.start("hidden");
    }

    if (bookInView) {
      bookControls.start("visible");
    } else {
      bookControls.start("hidden");
    }

    if (teamInView) {
      teamControls.start("visible");
    } else {
      teamControls.start("hidden");
    }

    if (planInView) {
      planControls.start("visible");
    } else {
      planControls.start("hidden");
    }
  }, [aboutInView, howToStartInView, bookInView, teamInView, planInView]);

  // Counters for animation effect
  const [counters, setCounters] = useState({
    investments: 0,
    strategies: 0,
    investors: 0,
  });

  // Animate counters on page load
  useEffect(() => {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);

      setCounters({
        investments: Math.floor(104 * progress),
        strategies: Math.floor(200 * progress),
        investors: Math.floor(24000 * progress),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
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
              About
            </h2>
            <ul className="flex items-center justify-center">
              <li className="text-white mx-2">
                <Link to="/" className="text-white hover:text-[#e93c05]">
                  Home
                </Link>
              </li>
              <li className="text-white mx-2">/</li>
              <li className="text-white mx-2">
                <span>About</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.section
        ref={aboutSectionRef}
        className="py-24 relative overflow-hidden"
      >
        {/* Shape elements */}
        <div className="absolute top-24 left-0">
          <img src="/assets/images/about/about-shape1.png" alt="Shape" />
        </div>
        <div className="absolute top-36 left-10">
          <img
            src="/assets/images/about/about-shape2.png"
            alt="Shape"
            className="animate-pulse"
          />
        </div>
        <div className="absolute top-24 left-8">
          <img
            src="/assets/images/about/about-shape3.png"
            alt="Shape"
            className="max-w-[210px] animate-[spin_5s_linear_infinite]"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Image Column */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={aboutControls}
              className="lg:w-5/12 mb-10 lg:mb-0"
            >
              <div className="space-y-8">
                <div className="relative text-right">
                  <img
                    src="/assets/images/about/about1.jpg"
                    alt="About"
                    className="max-w-[375px] ml-auto rounded-tr-[30%] relative z-10"
                  />
                  <img
                    src="/assets/images/about/about-shape4.png"
                    alt="Shape"
                    className="absolute top-0 -right-16 animate-[spin_20s_linear_infinite]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <img
                      src="/assets/images/about/about3.jpg"
                      alt="About"
                      className="rounded-tl-[30%]"
                    />
                  </div>
                  <div>
                    <img src="/assets/images/about/about2.jpg" alt="About" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={aboutControls}
              className="lg:w-7/12 max-w-[750px] pl-10"
            >
              <div className="mb-8">
                <span className="text-[#e93c05] font-semibold">
                  About Resonant finance
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
                  We Help Our Investors To Achieve Their Financial Goals
                </h2>
              </div>

              <div className="mb-9">
                <span className="text-lg font-semibold block mb-2.5">
                  We combine expertise across traditional and alternative asset
                  classes with state-of-the-art investment portfolio
                  construction techniques to help our clients unlock the right
                  opportunities in a fast-evolving investment world.
                </span>
                <p>
                  We assist you in finding out why your finances aren't
                  channelled properly with intensive forensics and budget
                  examination, in order to determine which pattern to apply the
                  solutions.
                </p>
              </div>

              <motion.div
                variants={staggerChildren}
                initial="hidden"
                animate={aboutControls}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
              >
                <motion.div variants={scaleIn} className="relative pl-20">
                  <i className="flaticon-workflow absolute top-2.5 left-4 text-5xl text-[#e93c05] z-10"></i>
                  <div className="absolute top-0 left-0 w-[50px] h-[50px] rounded-full bg-[#fcd1c4] -z-10"></div>
                  <h3 className="text-4xl font-bold mb-1.5">
                    {counters.investments}
                  </h3>
                  <p className="text-[#e93c05] font-semibold">
                    Stable Investments
                  </p>
                </motion.div>

                <motion.div variants={scaleIn} className="relative pl-20">
                  <i className="flaticon-project absolute top-2.5 left-4 text-5xl text-[#e93c05] z-10"></i>
                  <div className="absolute top-0 left-0 w-[50px] h-[50px] rounded-full bg-[#fcd1c4] -z-10"></div>
                  <h3 className="text-4xl font-bold mb-1.5">
                    {counters.strategies}
                  </h3>
                  <p className="text-[#e93c05] font-semibold">
                    Investment Strategies
                  </p>
                </motion.div>

                <motion.div variants={scaleIn} className="relative pl-20">
                  <i className="flaticon-team absolute top-2.5 left-4 text-5xl text-[#e93c05] z-10"></i>
                  <div className="absolute top-0 left-0 w-[50px] h-[50px] rounded-full bg-[#fcd1c4] -z-10"></div>
                  <h3 className="text-4xl font-bold mb-1.5">
                    {counters.investors}
                  </h3>
                  <p className="text-[#e93c05] font-semibold">
                    Happy Investors
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How to Get Started */}
      <motion.section
        ref={howToStartRef}
        className="pt-24 pb-16 bg-[#f9f9f9]"
        style={{
          backgroundImage: "url('/assets/images/works-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={howToStartControls}
            className="text-center mb-10"
          >
            <span className="text-[#e93c05] font-semibold">
              How To Get Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
              Get Your Account In 3 Easy Steps
            </h2>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={howToStartControls}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={scaleIn} className="works-item text-center">
              <i className="flaticon-accounting text-5xl leading-[155px] inline-block w-40 h-40 rounded-full bg-[#fee4db] mb-5 relative z-10">
                <div className="absolute left-0 right-0 mx-auto top-6 w-[110px] h-[110px] bg-[#fee4db] border-8 border-[#e93c05] rounded-full -z-10"></div>
              </i>
              <h3 className="text-2xl font-bold mb-2.5">
                <a href="#" className="text-[#011a41] hover:text-[#e93c05]">
                  Create an account
                </a>
              </h3>
              <p>
                First you'll need to setup an account with the company, via the
                official website.
              </p>
            </motion.div>

            <motion.div variants={scaleIn} className="works-item text-center">
              <i className="flaticon-personal-information text-5xl leading-[155px] inline-block w-40 h-40 rounded-full bg-[#fee4db] mb-5 relative z-10">
                <div className="absolute left-0 right-0 mx-auto top-6 w-[110px] h-[110px] bg-[#fee4db] border-8 border-[#e93c05] rounded-full -z-10"></div>
              </i>
              <h3 className="text-2xl font-bold mb-2.5">
                <a href="#" className="text-[#011a41] hover:text-[#e93c05]">
                  Choose a Plan
                </a>
              </h3>
              <p>
                Select a desired plan, make a deposit and start your investment.
              </p>
            </motion.div>

            <motion.div variants={scaleIn} className="works-item text-center">
              <i className="flaticon-contract text-5xl leading-[155px] inline-block w-40 h-40 rounded-full bg-[#fee4db] mb-5 relative z-10">
                <div className="absolute left-0 right-0 mx-auto top-6 w-[110px] h-[110px] bg-[#fee4db] border-8 border-[#e93c05] rounded-full -z-10"></div>
              </i>
              <h3 className="text-2xl font-bold mb-2.5">
                <a href="#" className="text-[#011a41] hover:text-[#e93c05]">
                  Rewards & Returns
                </a>
              </h3>
              <p>
                Once your trading session is completed, you can withdraw your
                investment earnings.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Book / CTA Section */}
      <motion.section ref={bookSectionRef} className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={bookControls}
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
              Are You Ready?
            </h2>
            <p className="text-2xl text-white mb-4">
              Speak with an expert{" "}
              <a
                href="tel:+16085727901"
                className="text-white hover:text-[#e93c05]"
              >
                +16085727901
              </a>
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-[#e93c05] hover:bg-white text-white hover:text-[#011a41] px-6 py-3 font-semibold rounded-md relative overflow-hidden group"
              >
                <Link to="/">
                  Get Started
                  <span className="absolute w-0 h-0 rounded-[5px] bg-white group-hover:w-[225%] group-hover:h-[562.5px] transition-all duration-500 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-100"></span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section ref={teamSectionRef} className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={teamControls}
            className="text-center mb-10"
          >
            <span className="text-[#e93c05] font-semibold">
              Our Expert Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2">
              Meet Our Team Of Finance Experts
            </h2>
          </motion.div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {[
                { img: "team2.jpg", name: "Digo Mera", position: "CEO" },
                {
                  img: "team3.jpg",
                  name: "Mackob Testa",
                  position: "Consultant",
                },
                {
                  img: "team4.jpg",
                  name: "Charlotte Ford",
                  position: "Finance Expert",
                },
                {
                  img: "team5.jpg",
                  name: "Jac Jacson",
                  position: "Research Expert",
                },
                {
                  img: "team6.jpg",
                  name: "Micheal Smith",
                  position: "Acounts Manager",
                },
              ].map((member, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 pl-4 pr-4"
                >
                  <div className="team-item mb-8 transition-transform hover:-translate-y-2 group">
                    <div className="top relative">
                      <img
                        src={`/assets/images/team/${member.img}`}
                        alt="Team"
                        className="w-full"
                      />
                      <ul className="absolute top-16 left-6">
                        <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          <a
                            href="#"
                            target="_blank"
                            className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateY(360deg)]"
                          >
                            <i className="bx bxl-facebook text-[22px] leading-[45px]">
                              <Facebook />
                            </i>
                          </a>
                        </li>
                        <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          <a
                            href="#"
                            target="_blank"
                            className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateX(360deg)]"
                          >
                            <i className="bx bxl-twitter text-[22px] leading-[45px]">
                              <Twitter />
                            </i>
                          </a>
                        </li>
                        <li className="block mb-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          <a
                            href="#"
                            target="_blank"
                            className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateY(360deg)]"
                          >
                            <i className="bx bxl-instagram text-[22px] leading-[45px]">
                              <Instagram />
                            </i>
                          </a>
                        </li>
                        <li className="block mb-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          <a
                            href="#"
                            target="_blank"
                            className="block w-[45px] h-[45px] grid place-content-center text-center bg-white text-[#e93c05] hover:bg-[#011a41] hover:text-white transition-all duration-300 group-hover:[transform:rotateX(360deg)]"
                          >
                            <i className="bx bxl-linkedin text-[22px] leading-[45px]">
                              <Linkedin />
                            </i>
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
      </motion.section>

      {/* Plan Section */}
      <motion.section
        ref={planSectionRef}
        className="mb-24 relative"
        style={{
          backgroundImage: "url('/assets/images/plan-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute w-[300px] h-full top-0 right-0 bg-sidebar"></div>
        <div className="container-fluid">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={planControls}
            className="plan-content bg-sidebar py-10 px-12 md:px-[50px] md:pr-[205px] max-w-[840px] ml-auto mr-[35px] shadow-md relative top-24 z-10"
          >
            <div className="plan-shape">
              <img
                src="/assets/images/plan-shape1.png"
                alt="Shape"
                className="absolute bottom-0 right-0 animate-[opacity-pulse_3s_linear_infinite]"
              />
              <img
                src="/assets/images/plan-shape2.png"
                alt="Shape"
                className="absolute top-0 right-0 animate-[opacity-pulse-alt_3s_linear_infinite]"
              />
            </div>

            <div className="section-title text-left mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] max-w-[525px]">
                We Are Experienced Financial Experts
              </h2>
            </div>

            <p className="mb-8">
              We combine expertise across traditional and alternative asset
              classes with state-of-the-art investment portfolio construction
              techniques to help our clients unlock the right opportunities in a
              fast-evolving investment world.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
