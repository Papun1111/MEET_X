import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaHistory, FaPlus, FaShareAlt, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Corrected import

// Animation Variants (organized for clarity)

// Page-level container for staggering children
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

// Navbar animation
const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 },
  },
};

// Main content panel animation
const mainPanelVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20, duration: 1 },
  },
};

// Variants for the instructional cards section
const cardsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;
    
    setIsJoining(true);
    await addToUserHistory(meetingCode);
    
    // Delay for animation before navigating
    setTimeout(() => {
      navigate(`/${meetingCode}`);
    }, 800);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-gray-200 font-sans overflow-hidden"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements for ambiance */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      {/* Navbar */}
      <motion.nav 
        className="flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-lg shadow-md sticky top-0 z-50"
        variants={navbarVariants}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-all">
            Blue Link Saga
          </Link>
        </motion.div>

        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1, color: "#22d3ee" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
            title="History"
          >
            <FaHistory />
            <span className="text-sm hidden md:inline">History</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(220, 38, 38, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/auth');
            }}
            className="px-4 py-2 text-sm font-semibold bg-red-800/50 border border-red-600/50 text-red-300 hover:bg-red-700 hover:text-white rounded-lg transition-all"
          >
            Logout
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Section */}
      <motion.main
        className="flex flex-col items-center justify-center text-center px-4 py-24 relative z-10"
        variants={mainPanelVariants}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Instant, Secure Video Calls
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-400 mb-8">
          Enter a meeting code to join an existing call or create a new one by generating a unique code. Simple, fast, and reliable.
        </p>

        <motion.div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.input
            type="text"
            placeholder="Enter Meeting Code"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            className="px-5 py-3 w-72 bg-gray-800/60 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 placeholder-gray-500"
            whileFocus={{ scale: 1.05 }}
          />
          
          <AnimatePresence mode="wait">
            <motion.button
              key={isJoining ? "joining" : "join"}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(34, 211, 238, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinVideoCall}
              disabled={!meetingCode.trim() || isJoining}
              className={`px-8 py-3 w-40 rounded-lg font-bold text-lg transition-all duration-300 relative overflow-hidden ${
                isJoining 
                  ? 'bg-green-500 text-white' 
                  : 'bg-cyan-600 text-white hover:bg-cyan-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isJoining && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
              {isJoining ? 'Joining...' : 'Join'}
            </motion.button>
          </AnimatePresence>
        </motion.div>
      </motion.main>

      {/* How It Works Section */}
      <motion.section
        className="px-4 py-20 relative z-10"
        variants={cardsContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Animate when 30% of the section is visible
      >
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {/* Card 1 */}
          <motion.div 
            className="bg-gray-900/50 border border-gray-700/50 p-8 rounded-xl shadow-lg"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)", borderColor: "#22d3ee" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaPlus className="text-4xl text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">1. Create a Room</h3>
            <p className="text-gray-400">Instantly generate a unique and secure meeting code for your private video session.</p>
          </motion.div>
          {/* Card 2 */}
          <motion.div 
            className="bg-gray-900/50 border border-gray-700/50 p-8 rounded-xl shadow-lg"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)", borderColor: "#a855f7" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaShareAlt className="text-4xl text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">2. Share the Code</h3>
            <p className="text-gray-400">Securely share the unique code with friends, family, or colleagues you want to invite.</p>
          </motion.div>
          {/* Card 3 */}
          <motion.div 
            className="bg-gray-900/50 border border-gray-700/50 p-8 rounded-xl shadow-lg"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)", borderColor: "#34d399" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaSignInAlt className="text-4xl text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">3. Join the Call</h3>
            <p className="text-gray-400">Enter the provided code on this page to instantly and securely join the video call.</p>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default withAuth(HomeComponent);
