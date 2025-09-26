import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/navbar"; // Assuming Navbar component exists

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Bouncy animation for individual items entering the screen
const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// Hover animation for interactive elements like cards and buttons
const cartoonHover = {
  hover: {
    y: -8,
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  tap: {
    scale: 0.95,
  }
};

// Feature card data
const features = [
  {
    title: "Crystal-Clear Video",
    description: "Experience high-definition video calls that feel fun and engaging.",
    icon: "📹",
    bgColor: "bg-[#FF5B60]", // Coral
  },
  {
    title: "Real-Time Collaboration",
    description: "Share screens and collaborate with fun tools that bring your team together.",
    icon: "🔗",
    bgColor: "bg-[#908CA4]", // Lavender
  },
  {
    title: "Secure & Private",
    description: "Your conversations are always protected with our top-notch security.",
    icon: "🛡️",
    bgColor: "bg-[#57659E]", // Muted Blue
  },
];

// "How it works" steps data
const howToSteps = [
  {
    step: 1,
    title: "Sign Up",
    description: "Create your account in just a few clicks to get started.",
    icon: "⚡"
  },
  {
    step: 2,
    title: "Start a Call",
    description: "Easily launch a new meeting and invite your friends or team.",
    icon: "🚀"
  },
  {
    step: 3,
    title: "Have Fun!",
    description: "Enjoy a seamless and playful video conferencing experience.",
    icon: "⚙️"
  }
];

export default function LandingPage() {
  return (
    // Main container with the base background color
    <div className="min-h-screen bg-[#57659E] text-[#443E46] overflow-x-hidden font-sans">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <motion.section 
          className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center bg-[#FF5B60] border-b-8 border-black"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-8 max-w-4xl" variants={itemVariants}>
            <h1 className="text-6xl lg:text-8xl font-extrabold text-[#F6DEB8] tracking-tighter">
              Meetings that are <br /> actually fun.
            </h1>
          </motion.div>
          
          <motion.p
            variants={itemVariants}
            className="text-[#F6DEB8] text-xl lg:text-2xl mt-6 max-w-2xl mx-auto font-medium"
          >
            Step into a brighter, more playful video conferencing experience. Meet X is designed to make remote collaboration feel less like work and more like fun.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              className="px-10 py-4 bg-[#443E46] text-[#F6DEB8] text-lg font-bold rounded-2xl border-4 border-black shadow-[8px_8px_0px_#443E46]"
              variants={cartoonHover}
              whileHover="hover"
              whileTap="tap"
            >
              Start Meeting
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-24 px-6 md:px-10 bg-[#F6DEB8] border-b-8 border-black"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-5xl lg:text-6xl font-extrabold text-center mb-16 text-[#443E46] tracking-tighter"
          >
            Everything You Need
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className={`${feature.bgColor} p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] text-left`}
                variants={itemVariants}
                whileHover={cartoonHover.hover}
              >
                <div className="text-5xl mb-5">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-base font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="py-24 px-6 md:px-10 bg-[#908CA4] border-b-8 border-black"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-5xl lg:text-6xl font-extrabold text-center mb-20 text-[#F6DEB8] tracking-tighter"
          >
            As Easy As 1-2-3
          </motion.h2>
          
          <div className="flex flex-col lg:flex-row justify-center items-center gap-12 max-w-6xl mx-auto">
            {howToSteps.map((step) => (
              <motion.div 
                key={step.step} 
                variants={itemVariants} 
                className="flex flex-col items-center text-center max-w-xs"
              >
                <div className="flex items-center justify-center w-24 h-24 bg-[#C57284] rounded-full text-3xl font-bold mb-6 border-4 border-black shadow-[6px_6px_0px_#000]">
                  <span className="text-white">{step.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-[#F6DEB8]">
                  {step.title}
                </h3>
                <p className="text-white text-lg font-medium leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section 
          className="bg-[#443E46] py-24 px-6 md:px-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-5xl lg:text-6xl font-extrabold mb-6 text-[#F6DEB8] tracking-tighter"
          >
            Ready to Get Started?
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-[#908CA4] text-xl lg:text-2xl mb-12 max-w-3xl mx-auto font-medium"
          >
            The future of fun remote collaboration is here. It's free to try!
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <motion.button
              className="px-12 py-5 bg-[#FF5B60] text-[#F6DEB8] text-xl font-black rounded-2xl border-4 border-black shadow-[8px_8px_0px_#FF5B60]"
              variants={cartoonHover}
              whileHover="hover"
              whileTap="tap"
            >
              JOIN THE FUN
            </motion.button>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}