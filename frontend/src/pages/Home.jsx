import React, { useContext, useState } from 'react';
// import withAuth from '../utils/withAuth'; // Mocked below to resolve build error
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext'; // Mocked below to resolve build error
// import { FaHistory, FaPlus, FaShareAlt, FaSignInAlt } from 'react-icons/fa'; // Replaced with inline SVGs
import { motion, AnimatePresence } from 'framer-motion';

// --- Start of Error Fixes ---

// Mock withAuth HOC to resolve the missing file error in this environment.
// In your actual project, you would use your original import.
const withAuth = (Component) => (props) => <Component {...props} />;

// Mock AuthContext to resolve the missing file error.
// In your actual project, you would use your original import.
const AuthContext = React.createContext({
  addToUserHistory: async (code) => {
    // This is a placeholder function. Your real context will have the implementation.
    console.log(`(Mock) Added to history: ${code}`);
  },
});

// Inline SVG components to replace 'react-icons/fa' and resolve the import error.
const FaHistory = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FaPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="text-5xl text-white mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const FaShareAlt = () => <svg xmlns="http://www.w3.org/2000/svg" className="text-5xl text-white mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>;
const FaSignInAlt = () => <svg xmlns="http://www.w3.org/2000/svg" className="text-5xl text-white mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;

// --- End of Error Fixes ---


// Consistent animation for interactive elements
const cartoonHover = {
  hover: {
    y: -6,
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
  tap: {
    scale: 0.95,
  },
};

// Variants for staggering animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
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

  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/auth');
  }

  return (
    <motion.div
      className="min-h-screen bg-[#57659E] text-[#443E46] font-sans overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
        {/* Navbar */}
        <motion.nav 
            className="bg-[#F6DEB8] border-b-8 border-black px-6 py-4 sticky top-0 z-50"
            variants={itemVariants}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <h2 onClick={() => navigate('/')} className="text-3xl font-extrabold text-[#443E46] cursor-pointer tracking-tighter">
                        MEET X
                    </h2>
                </motion.div>

                <div className="flex items-center space-x-4 font-bold">
                    <motion.button
                        variants={cartoonHover}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/history')}
                        className="flex items-center gap-2 text-[#443E46] hover:text-[#FF5B60] transition-colors"
                        title="History"
                    >
                        <FaHistory />
                        <span className="text-sm hidden md:inline">History</span>
                    </motion.button>
                    
                    <motion.button
                        variants={cartoonHover}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleLogout}
                        className="px-5 py-2 text-sm text-white bg-[#C57284] rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]"
                    >
                        Logout
                    </motion.button>
                </div>
            </div>
        </motion.nav>


      {/* Main Section */}
      <motion.main
        className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-24"
        variants={itemVariants}
      >
        <div className="bg-[#F6DEB8] p-8 md:p-12 rounded-2xl border-4 border-black shadow-[10px_10px_0px_#000] max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tighter">
            Instant Video Calls
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-700 mb-8 font-medium">
            Enter a code to join a call, or just make one up to start a new meeting. It's that simple!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.input
              type="text"
              placeholder="Enter Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="px-5 py-3 w-72 bg-white text-[#443E46] border-4 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-[#FF5B60]/50 font-semibold placeholder-gray-500"
              whileFocus={{ scale: 1.05, y: -4, boxShadow: "6px 6px 0px #000" }}
              transition={{type: "spring", stiffness: 300}}
            />

            <AnimatePresence mode="wait">
              <motion.button
                key={isJoining ? 'joining' : 'join'}
                variants={cartoonHover}
                whileHover="hover"
                whileTap="tap"
                onClick={handleJoinVideoCall}
                disabled={!meetingCode.trim() || isJoining}
                className={`px-8 py-3 w-40 rounded-lg font-bold text-lg border-4 border-black relative overflow-hidden transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isJoining
                    ? 'bg-[#908CA4] text-white shadow-[6px_6px_0px_#000]'
                    : 'bg-[#FF5B60] text-white shadow-[6px_6px_0px_#000]'
                }`}
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
          </div>
        </div>
      </motion.main>

      {/* How It Works Section */}
      <motion.section
        className="px-4 py-20 bg-[#908CA4] border-t-8 border-black"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-4xl font-extrabold text-center mb-12 text-[#F6DEB8] tracking-tighter">How It Works</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {/* Card 1 */}
          <motion.div
            className="bg-[#C57284] p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000]"
            variants={itemVariants}
            whileHover={cartoonHover.hover}
          >
            <FaPlus />
            <h3 className="text-2xl font-bold mb-2 text-white">1. Create a Room</h3>
            <p className="text-white/80 font-medium">Instantly generate a unique code for your private video session.</p>
          </motion.div>
          {/* Card 2 */}
          <motion.div
            className="bg-[#FF5B60] p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000]"
            variants={itemVariants}
            whileHover={cartoonHover.hover}
          >
            <FaShareAlt />
            <h3 className="text-2xl font-bold mb-2 text-white">2. Share the Code</h3>
            <p className="text-white/80 font-medium">Securely share the code with friends, family, or colleagues.</p>
          </motion.div>
          {/* Card 3 */}
          <motion.div
            className="bg-[#443E46] p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000]"
            variants={itemVariants}
            whileHover={cartoonHover.hover}
          >
            <FaSignInAlt />
            <h3 className="text-2xl font-bold mb-2 text-white">3. Join the Call</h3>
            <p className="text-white/80 font-medium">Enter the code to instantly and securely join the video call.</p>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default withAuth(HomeComponent);

