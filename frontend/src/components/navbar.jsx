import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Re-using the hover animation for consistency
const cartoonHover = {
  hover: {
    y: -4,
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  // Handle navigation and close the mobile menu
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        className="bg-[#443E46] border-b-8 border-black sticky top-0 z-50"
      >
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div>
            <h2
              className="text-3xl font-extrabold text-[#F6DEB8] cursor-pointer tracking-tighter"
              onClick={() => handleNavigation('/')}
            >
              MEET X
            </h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-bold">
            <motion.button
              onClick={() => handleNavigation('/guest-join')}
              className="text-[#F6DEB8] hover:text-white"
              variants={cartoonHover}
              whileHover="hover"
              whileTap="tap"
            >
              Join as Guest
            </motion.button>
            <motion.button
              onClick={() => handleNavigation('/home')}
              className="text-[#F6DEB8] hover:text-white"
              variants={cartoonHover}
              whileHover="hover"
              whileTap="tap"
            >
              Home
            </motion.button>
            {!loggedIn ? (
              <motion.button
                onClick={() => handleNavigation('/auth')}
                className="px-5 py-2 bg-[#FF5B60] text-[#F6DEB8] rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]"
                variants={cartoonHover}
                whileHover="hover"
                whileTap="tap"
              >
                Log In
              </motion.button>
            ) : (
              <motion.button
                onClick={handleLogout}
                className="px-5 py-2 bg-[#C57284] text-white rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]"
                variants={cartoonHover}
                whileHover="hover"
                whileTap="tap"
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden text-[#F6DEB8] z-20"
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-0 left-0 w-full h-screen bg-[#443E46]/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#57659E] border-b-8 border-black p-8"
              >
                <div className="flex flex-col items-center text-center space-y-6 pt-16">
                  <motion.button
                    onClick={() => handleNavigation('/guest-join')}
                    className="text-2xl font-bold text-[#F6DEB8]"
                    whileTap={{ scale: 0.95 }}
                  >
                    Join as Guest
                  </motion.button>
                  <motion.button
                    onClick={() => handleNavigation('/home')}
                    className="text-2xl font-bold text-[#F6DEB8]"
                    whileTap={{ scale: 0.95 }}
                  >
                    Home
                  </motion.button>
                   <div className="pt-4 w-full">
                    {!loggedIn ? (
                      <motion.button
                        onClick={() => handleNavigation('/auth')}
                        className="w-full max-w-xs px-6 py-4 bg-[#FF5B60] text-[#F6DEB8] text-lg font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]"
                        whileTap={{ scale: 0.95 }}
                      >
                        Log In / Register
                      </motion.button>
                    ) : (
                       <motion.button
                        onClick={handleLogout}
                        className="w-full max-w-xs px-6 py-4 bg-[#C57284] text-white text-lg font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]"
                        whileTap={{ scale: 0.95 }}
                      >
                        Logout
                      </motion.button>
                    )}
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
