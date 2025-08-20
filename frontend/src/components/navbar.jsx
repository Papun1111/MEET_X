import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

export function Navbar(){
  const router = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsMenuOpen(false); 
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [setLoggedIn]);

  // Handle navigation and close menu
  const handleNavigation = (path) => {
    router(path);
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-900 shadow-lg relative"
      >
        <div className="flex justify-between items-center px-6 py-4">
          {/* Brand/Logo */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-400">MEET X</h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <motion.button
              onClick={() => router("/asdad")}
              className="text-gray-300 hover:text-purple-400"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Join as Guest
            </motion.button>
            <motion.button
              onClick={() => router("/auth")}
              className="text-gray-300 hover:text-purple-400"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Register
            </motion.button>
            <motion.button
              onClick={() => router("/home")}
              className="text-gray-300 hover:text-purple-400"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Home
            </motion.button>
            {!loggedIn ? 
              <motion.button
                onClick={() => router("/auth")}
                className="px-4 py-1 bg-blue-600 text-white rounded"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Log In
              </motion.button> : 
              <motion.button
                onClick={handleLogout}
                className="px-4 py-1 bg-red-600 text-white rounded"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.button>
            }
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-gray-800 border-t border-gray-700 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                <motion.button
                  onClick={() => handleNavigation("/asdad")}
                  className="block w-full text-left text-gray-300 hover:text-purple-400 py-2"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Join as Guest
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation("/auth")}
                  className="block w-full text-left text-gray-300 hover:text-purple-400 py-2"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Register
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation("/home")}
                  className="block w-full text-left text-gray-300 hover:text-purple-400 py-2"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Home
                </motion.button>
                <div className="pt-2 border-t border-gray-700">
                  {!loggedIn ? 
                    <motion.button
                      onClick={() => handleNavigation("/auth")}
                      className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded"
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      Log In
                    </motion.button> : 
                    <motion.button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded"
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.button>
                  }
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}