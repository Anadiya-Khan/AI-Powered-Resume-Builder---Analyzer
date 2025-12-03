import React from "react";
import { testimonialsData } from "../assets/assets.js";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

// Parent animation for stagger
const parentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Child animation for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Fade-in for heading
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Testimonials = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-15 w-full py-20 px-6 md:px-20 bg-white"
    >
      {/* Heading */}
      <motion.h3
        variants={fadeUp}
        className="text-3xl md:text-4xl font-extrabold text-center text-gray-900"
      >
        Loved by Job Seekers Worldwide
      </motion.h3>

      {/* Subtext */}
      <motion.p
        variants={fadeUp}
        className="text-gray-600 text-center mt-3 max-w-2xl mx-auto"
      >
        Don’t just take our word for it. Here’s what our users have to say.
      </motion.p>

      {/* Cards with stagger animation */}
      <motion.div
        variants={parentVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14"
      >
        {testimonialsData.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="border rounded-2xl p-8 shadow-sm hover:shadow-md hover:bg-blue-100 transition bg-white text-center"
          >
            {/* Profile Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border"
            />

            {/* Name */}
            <h4 className="font-semibold text-lg text-gray-900">
              {item.name}
            </h4>
            <p className="text-gray-500 text-sm mb-3">{item.role}</p>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-3">
              {Array(item.stars)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" size={16} />
                ))}
            </div>

            {/* Text */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Testimonials;
