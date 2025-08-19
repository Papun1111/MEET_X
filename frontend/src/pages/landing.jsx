import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react"; // Import motion from framer-motion

// --- Animation Variants ---
// It's good practice to define variants outside the component
// to prevent them from being redefined on every render.

// Container variant for staggering child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children by 0.2s
    },
  },
};

// Child item variant for text elements
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md"
      >
        <div>
          <h2 className="text-2xl font-semibold text-blue-400">Blue Link Saga</h2>
        </div>
        <div className="flex items-center gap-6 text-sm">
          {/* Using motion.button for hover animations */}
          <motion.button
            onClick={() => router("/asdad")}
            className="hover:text-purple-400"
            whileHover={{ scale: 1.1, y: -2 }} // Animate scale and position on hover
            transition={{ type: "spring", stiffness: 300 }}
          >
            Join as Guest
          </motion.button>
          <motion.button
            onClick={() => router("/auth")}
            className="hover:text-purple-400"
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Register
          </motion.button>
          <motion.button
            onClick={() => router("/home")}
            className="hover:text-purple-400"
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Home
          </motion.button>
          <motion.button
            onClick={() => router("/auth")}
            className="px-4 py-1 bg-blue-600 text-white rounded"
            whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }} // Animate background color on hover
            transition={{ duration: 0.2 }}
          >
            Log In
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-10 py-20 gap-10">
        {/* Left Side: Animated with variants */}
        <motion.div
          className="space-y-6 max-w-xl text-center lg:text-left"
          variants={containerVariants}
          initial="hidden" // Initial state
          animate="visible" // Animate to this state
        >
          <motion.h1
            variants={itemVariants} // Inherits animation from parent container
            className="text-4xl lg:text-5xl font-bold leading-tight"
          >
            <span className="text-purple-400">Welcome</span> to Blue Link Saga
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-300 text-lg">
            Connect, collaborate, and communicate seamlessly. Blue Link Saga brings your team together, no matter the distance. Experience crystal-clear video calls and powerful sharing tools.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/auth"
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-base font-medium transition"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side Image: Animated */}
        <motion.div
          className="flex justify-center"
          initial={{ x: 200, opacity: 0 }} // Start off-screen to the right and invisible
          animate={{ x: 0, opacity: 1 }} // Animate to its final position
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src="/videocall.png"
            alt="video call"
            className="max-h-96 rounded-md shadow-lg"
          />
        </motion.div>
      </div>

      {/* NEW: Features Section */}
      <motion.div
        className="px-10 py-20 bg-gray-900"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }} // Animate when the element scrolls into view
        viewport={{ once: true }} // Ensures the animation only runs once
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-400">Blue Link Saga?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">HD Video & Audio</h3>
            <p className="text-gray-400">Experience reliable, high-definition video and crisp audio that makes you feel like you're in the same room.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">Real-time Collaboration</h3>
            <p className="text-gray-400">Share your screen, use a virtual whiteboard, and send files instantly to keep productivity flowing.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">Secure & Private</h3>
            <p className="text-gray-400">With end-to-end encryption, your conversations and data are always protected and confidential.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
