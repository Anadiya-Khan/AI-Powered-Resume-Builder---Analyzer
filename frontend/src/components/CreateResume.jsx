import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateResume = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full mt-10 py-20 px-6 md:px-20 rounded-2xl text-center relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-blue-200 blur-[150px] opacity-40"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-purple-200 blur-[160px] opacity-30"></div>
      </div>

      {/* Heading */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-2xl md:text-4xl font-extrabold text-gray-900"
      >
        Ready to build a better resume?
      </motion.p>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-gray-600 max-w-xl mx-auto mt-4 text-sm md:text-lg"
      >
        Start for free and create a professional resume that stands out.  
        No credit card needed — just your skills and ambition.
      </motion.p>

      {/* Button */}
      <motion.button
        onClick={() => navigate("/select-template")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
        className="mt-8 px-10 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition font-medium text-sm md:text-base tracking-wide"
      >
        GET STARTED
      </motion.button>
    </motion.section>
  );
};

export default CreateResume;
