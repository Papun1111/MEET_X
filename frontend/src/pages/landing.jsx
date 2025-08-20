import React from "react";
import { Link} from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../components/navbar";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};


const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


const features = [
  {
    title: "Crystal-Clear Video",
    description: "Experience high-definition video calls that make you feel like you're in the same room.",
    icon: "📹",
  },
  {
    title: "Real-Time Collaboration",
    description: "Share your screen, use a virtual whiteboard, and edit documents together seamlessly.",
    icon: "🤝",
  },
  {
    title: "Secure & Private",
    description: "End-to-end encryption ensures your conversations and data remain confidential.",
    icon: "🔒",
  },
];

const howToSteps = [
    {
        step: 1,
        title: "Create an Account",
        description: "Quick and easy registration to get you started in seconds."
    },
    {
        step: 2,
        title: "Start a Room",
        description: "Create a new room and invite your team members with a single click."
    },
    {
        step: 3,
        title: "Begin Collaborating",
        description: "Use our powerful tools to communicate and work together effectively."
    }
]


export default function LandingPage() {
 
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* --- Animated & Responsive Navbar --- */}
      <Navbar></Navbar>
      <main>
        {/* --- Animated Main Hero Section --- */}
        <section className="flex flex-col items-center justify-center px-6 md:px-10 py-20 text-center">
          {/* Container for staggered animations */}
          <motion.div
            className="space-y-6 max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold leading-tight"
            >
              <span className="text-purple-400">Welcome</span> to Meet X
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-lg"
            >
              Connect, collaborate, and communicate seamlessly. Meet X brings your team together, no matter the distance.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/auth"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-base font-medium transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* --- Features Section with Animated Cards --- */}
        <motion.section 
            className="py-20 px-6 md:px-10 bg-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }} // Animate when 20% of the section is in view
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-bold text-center mb-12">
                Features that Empower Your Team
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 text-purple-400">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>

        {/* --- "How It Works" Instructions Section --- */}
        <motion.section 
            className="py-20 px-6 md:px-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-bold text-center mb-12">
                Get Started in 3 Easy Steps
            </motion.h2>
            <div className="flex flex-col lg:flex-row justify-center items-stretch gap-10 max-w-6xl mx-auto">
                {howToSteps.map((step) => (
                    <motion.div key={step.step} variants={itemVariants} className="flex flex-col items-center text-center lg:w-1/3">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full text-2xl font-bold mb-4">
                            {step.step}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>

        {/* --- Final Call to Action Section --- */}
        <motion.section 
            className="bg-gray-900 py-20 px-6 md:px-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
                Ready to Join the Saga?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Boost your team's productivity and collaboration today. It's free to get started.
            </motion.p>
            <motion.div variants={itemVariants}>
                 <Link
                    to="/auth"
                    className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-base font-medium transition-colors"
                >
                    Create Your Account Now
                </Link>
            </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
