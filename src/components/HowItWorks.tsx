import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

export function HowItWorks() {
  const steps = [
    {
      title: "Create your account",
      description:
        "First you'll need to setup an account with the company, via the official website.",
    },
    {
      title: "Choose a Plan",
      description:
        "Select a desired plan, make a deposit and start your investment.",
    },
    {
      title: "Rewards & Returns",
      description:
        "Once your investment session is completed, you can withdraw your investment earnings.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <img
              src="/assets/images/works-shape1.png"
              alt="Shape"
              className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 opacity-20"
            />
            <img
              src="/assets/images/works-main.png"
              alt="How It Works"
              className="relative z-10 w-full max-w-md mx-auto"
            />
          </motion.div>

          {/* Content column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
              className="mb-8"
            >
              <span className="text-[#e93c05] font-semibold text-lg">
                How to get started
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#011a41] mt-2 mb-4">
                How It Works
              </h2>
              <p className="">
                It's never too late to start investing, take a bold step and
                embrace investments!
              </p>
            </motion.div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex"
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-[#e93c05]/10 flex items-center justify-center">
                      <Check className="w-6 h-6 text-[#e93c05]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#011a41]">
                      {step.title}
                    </h3>
                    <p className="">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
              className="mt-8"
            >
              <Button
                asChild
                className="bg-[#e93c05] hover:bg-[#011a41] text-white font-semibold transition-colors"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
