import React from 'react'
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="mt-10 py-6 flex justify-around items-center gap-3">
      <p className="text-lg font-semibold">AI Resume Builder</p>
      <p className="text-sm text-gray-400">
        All Rights Reserved 2025
      </p>
      {/* Social Icons */}
      <div className="flex gap-5 text-2xl">
        <a href="#" className="hover:text-blue-400"><FaLinkedin /></a>
        <a href="#" className="hover:text-gray-300"><FaGithub /></a>
        <a href="#" className="hover:text-pink-400"><FaInstagram /></a>
      </div>
    </div>
  )
}

export default Footer
