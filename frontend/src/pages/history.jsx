import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../contexts/AuthContext'; // Mocked below
import { useNavigate } from 'react-router-dom';
// import HomeIcon from '@mui/icons-material/Home'; // Replaced with inline SVG
import { motion } from 'framer-motion';


// --- Start of Error Fixes ---

// Mock AuthContext to resolve the missing file error in this environment.
// In your actual project, this would import your actual authentication logic.
const AuthContext = React.createContext({
  getHistoryOfUser: async () => {
    // Return mock data so the component renders correctly for styling.
    return [
      { meetingCode: 'fun-times', date: new Date().toISOString() },
      { meetingCode: 'daily-standup', date: new Date(Date.now() - 86400000).toISOString() },
      { meetingCode: 'project-kickoff', date: new Date(Date.now() - 172800000).toISOString() },
    ];
  },
});

// Inline SVG to replace the @mui/icons-material import
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

// --- End of Error Fixes ---


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const cartoonHover = {
    hover: {
      y: -4,
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    tap: {
      scale: 0.95,
    },
};

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // Handle error with toast/snackbar if needed
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-[#57659E] text-[#443E46] font-sans p-6 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-[#F6DEB8] p-6 md:p-10 rounded-2xl border-4 border-black shadow-[10px_10px_0px_#000]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 sm:mb-0">
                Meeting History
            </h2>
            <motion.button
                onClick={() => routeTo("/home")}
                className="flex items-center gap-2 px-5 py-2 bg-[#FF5B60] text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition"
                variants={cartoonHover}
                whileHover="hover"
                whileTap="tap"
            >
                <HomeIcon />
                <span>Back to Home</span>
            </motion.button>
        </motion.div>

        {/* Meeting History List */}
        <div className="space-y-4">
          {meetings.length > 0 ? (
            meetings.map((e, i) => (
              <motion.div
                key={i}
                className="bg-[#908CA4] border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] p-5"
                variants={itemVariants}
              >
                <p className="text-lg text-white mb-1">
                  <span className="font-bold">Code:</span> {e.meetingCode}
                </p>
                <p className="text-md text-white/80">
                  <span className="font-bold">Date:</span> {formatDate(e.date)}
                </p>
              </motion.div>
            ))
          ) : (
            <motion.p variants={itemVariants} className="text-gray-700 font-medium text-lg">
                No meeting history found.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
