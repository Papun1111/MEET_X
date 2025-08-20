import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Login, 1 = Register
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        setUsername("");
        setPassword("");
        setName("");
        setMessage(result);
        setOpen(true);
        setError("");
        setFormState(0);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const switchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Left Side Image */}
      <motion.div 
        className="hidden md:block w-2/3 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://plus.unsplash.com/premium_photo-1669234308292-e5377faa08ae?q=80&w=1887&auto=format&fit=crop)",
        }}
        variants={leftPanelVariants}
      >
        {/* Overlay with animated gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-transparent to-blue-900/40"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(147,51,234,0.4) 0%, transparent 50%, rgba(59,130,246,0.4) 100%)",
              "linear-gradient(45deg, rgba(59,130,246,0.4) 0%, transparent 50%, rgba(147,51,234,0.4) 100%)",
              "linear-gradient(45deg, rgba(147,51,234,0.4) 0%, transparent 50%, rgba(59,130,246,0.4) 100%)"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated Welcome Text Overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div 
            className="text-center text-white p-8 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20"
            whileHover={{ 
              scale: 1.05,
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255,255,255,0.15)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1 
              className="text-4xl font-bold mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(147,51,234,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Welcome to MEET X
            </motion.h1>
            <motion.p 
              className="text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              Connect, Communicate, Collaborate
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side Form */}
      <motion.div 
        className="w-full md:w-1/3 bg-gray-900/95 backdrop-blur-sm text-white flex flex-col justify-center p-10 relative z-10"
        variants={rightPanelVariants}
      >
        <motion.div 
          className="mb-8 text-center"
          variants={formVariants}
        >
          {/* Animated Icon */}
          <motion.div 
            className="flex justify-center mb-6"
            variants={iconVariants}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg"
              whileHover={{ 
                scale: 1.1,
                rotate: 360,
                boxShadow: "0 0 30px rgba(147,51,234,0.6)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              🔒
            </motion.div>
          </motion.div>

          {/* Tab Buttons */}
          <motion.div 
            className="flex justify-center gap-2 p-1 bg-gray-800/50 rounded-lg backdrop-blur-sm"
            layout
          >
            <motion.button
              onClick={() => setFormState(0)}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                formState === 0
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                backgroundColor: formState === 0 ? "#9333ea" : "transparent",
                color: formState === 0 ? "#ffffff" : "#d1d5db"
              }}
              transition={{ duration: 0.2 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => setFormState(1)}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                formState === 1
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                backgroundColor: formState === 1 ? "#9333ea" : "transparent",
                color: formState === 1 ? "#ffffff" : "#d1d5db"
              }}
              transition={{ duration: 0.2 }}
            >
              Sign Up
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.form 
          className="space-y-6"
          variants={formVariants}
        >
          <AnimatePresence mode="wait">
            {formState === 1 && (
              <motion.div
                key="name-field"
                variants={switchVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.label 
                  className="block text-sm font-medium mb-2 text-gray-300"
                  variants={inputVariants}
                >
                  Full Name
                </motion.label>
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                  whileFocus={{
                    scale: 1.01,
                    boxShadow: "0 0 20px rgba(147,51,234,0.3)"
                  }}
                  variants={inputVariants}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={inputVariants}>
            <motion.label 
              className="block text-sm font-medium mb-2 text-gray-300"
              variants={inputVariants}
            >
              Username
            </motion.label>
            <motion.input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400"
              placeholder="Enter your username"
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 20px rgba(147,51,234,0.3)"
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <motion.label 
              className="block text-sm font-medium mb-2 text-gray-300"
              variants={inputVariants}
            >
              Password
            </motion.label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400"
              placeholder="Enter your password"
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 20px rgba(147,51,234,0.3)"
              }}
            />
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p 
                className="text-red-400 text-sm bg-red-900/20 border border-red-400/30 rounded-lg p-3 backdrop-blur-sm"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                ❌ {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="button"
            onClick={handleAuth}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 relative overflow-hidden ${
              isLoading 
                ? 'bg-purple-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
            variants={buttonHoverVariants}
            whileHover={!isLoading ? "hover" : {}}
            whileTap={!isLoading ? "tap" : {}}
          >
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            <AnimatePresence mode="wait">
              <motion.span
                key={isLoading ? 'loading' : 'normal'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isLoading 
                  ? (formState === 0 ? 'Signing In...' : 'Registering...')
                  : (formState === 0 ? 'Sign In' : 'Sign Up')
                }
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.form>

        {/* Success Toast */}
        <AnimatePresence>
          {open && (
            <motion.div 
              className="mt-6 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg shadow-lg backdrop-blur-sm border border-green-400/30"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              layout
            >
              <motion.div
                className="flex items-center gap-3"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  ✅
                </motion.span>
                {message}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Animation */}
        <motion.div 
          className="mt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.p
            whileHover={{ 
              color: "#a855f7",
              scale: 1.05 
            }}
            transition={{ duration: 0.2 }}
          >
            Secure • Fast • Reliable
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}