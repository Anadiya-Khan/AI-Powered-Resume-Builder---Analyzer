import React from "react";
import { FaMagic, FaPalette, FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Features = () => {
  return (
    <motion.section
      id="features"
      className="w-full py-25 px-6 md:px-15 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
        Why Choose Our AI Resume Builder?
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 text-center mt-3 max-w-2xl mx-auto">
        We provide you with the tools to create a standout resume that gets results.
      </p>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14"
        variants={cardParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Card 1 */}
        <motion.div
          className="rounded-2xl hover:bg-blue-200 shadow-sm border p-8 text-center"
          variants={cardChild}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMagic size={22} />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">
            Write Smarter, Not Harder
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Get intelligent suggestions to improve your resume's content and impact.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="rounded-2xl hover:bg-blue-200  shadow-sm border p-8 text-center"
          variants={cardChild}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaPalette size={22} />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">
            Design with Confidence
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Choose from professionally designed templates that match your style.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          className="rounded-2xl hover:bg-blue-200  shadow-sm border p-8 text-center"
          variants={cardChild}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShareAlt size={22} />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">
            Share with Ease
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Export your resume to PDF or share it directly with employers.
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Features;
