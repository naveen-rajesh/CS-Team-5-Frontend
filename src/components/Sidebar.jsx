import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUserMd,
  FaNotesMedical,
  FaFileMedical,
  FaSignInAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <motion.div
        animate={{
          width: isOpen ? "16rem" : "4rem",
        }}
        className="fixed top-0 left-0 h-full rounded-r-lg bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white shadow-lg overflow-hidden"
        transition={{
          duration: 0.4,
          type: "linear",
        }}
      >

        <div className="flex items-center pl-4 justify-between p-4">
          {isOpen && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5}}
              className="text-xl font-bold pl-2"
            >
              CS Hospital
            </motion.h1>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} className="ml-1" />
            )}
          </button>
        </div>

        <ul className="space-y-6 mt-6">
          {[
            { icon: <FaHome size={20} />, label: "Home" },
            { icon: <FaNotesMedical size={20}/>, label: "Appointments" },
            { icon: <FaUserMd size={20}/>, label: "Doctors" },
            { icon: <FaFileMedical size={20}/>, label: "Records" },
          ].map((item, index) => (
            <motion.li
              key={index}
              className="flex items-center space-x-4 pl-5 p-2 hover:bg-green-700 rounded-md transition-all cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: index*0.1,
              }}
            >
              {item.icon}
              {isOpen && (
                <motion.button 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index*0.1,
                  }}
                  className="text-lg font-medium">
                    {item.label}
                </motion.button>
              )}
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="absolute bottom-4 left-0 w-full flex items-center space-x-4 pl-5 p-2 hover:bg-green-700 rounded-md transition-all"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FaSignInAlt size={20} />
          {isOpen && 
            <motion.button 
              className="text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
            >
                Sign In
            </motion.button>}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SideBar;