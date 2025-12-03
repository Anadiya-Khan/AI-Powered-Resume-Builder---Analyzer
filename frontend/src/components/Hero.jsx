import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const parentStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const child = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full min-h-[80vh] flex flex-col items-center justify-center 
      text-center px-6 md:px-16 relative overflow-hidden"
    >
      {/* Background Gradient Blurs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-0 w-80 h-80 bg-blue-300 blur-[150px] opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 blur-[150px] opacity-30"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200 blur-[180px] opacity-20"></div>
      </div>

      <motion.div variants={parentStagger} className="max-w-3xl">
        
        {/* Title */}
        <motion.h1
          variants={child}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight 
          tracking-tight mb-4"
        >
          Build Your{" "}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Resume
          </span>
          <br />
          in Minutes
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={child}
          className="text-gray-700 mt-3 text-base md:text-lg leading-relaxed"
        >
          Craft a professional, recruiter-ready resume using our smart AI platform. 
          Make a strong first impression and boost your chances of getting hired.
        </motion.p>

        {/* Button */}
        <motion.button
          variants={child}
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 px-8 py-3 
          bg-linear-to-r from-blue-600 to-blue-700 
          text-white font-medium rounded-2xl shadow-lg 
          hover:shadow-2xl transition-all 
          backdrop-blur-sm border border-white/20"
        >
          Create Your Resume →
        </motion.button>

      </motion.div>
    </motion.section>
  );
};

export default Hero;
