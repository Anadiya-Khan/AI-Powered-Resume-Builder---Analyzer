import React, { useState, useContext,useEffect } from "react";
import { authContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(authContext);

  const navigate = useNavigate();

  const menuRef = useRef(null);
  
  useEffect(() => {
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);   // close menu
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <nav className="w-full shadow-sm py-4 px-6 md:px-10 flex items-center justify-between bg-slate-300">
      
      <h1 className="text-2xl font-bold text-gray-800" onClick={()=>navigate("/")}>AI Resume Builder</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
          Home
        </Link>

        <ScrollLink
          to="features"
          smooth={true}
          duration={600}
          className="cursor-pointer text-gray-700 hover:text-blue-600 transition"
          onClick={() => navigate("/")}
        >
          Features
        </ScrollLink>

        {user ? (
          <>
            <p className="font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-xl shadow-sm">
              Hi, {user?.name}
            </p>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-xl shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
        <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
        <div className="w-6 h-0.5 bg-gray-800"></div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
         ref={menuRef}
         className="absolute top-16 right-6 bg-white shadow-lg p-5 rounded-xl flex flex-col gap-4 md:hidden z-50 w-48">

          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>

          <ScrollLink
            to="features"
            smooth={true}
            duration={600}
            onClick={() => navigate("/")}
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Features
          </ScrollLink>

          {user ? (
            <>
              <p className="font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-center">
                Hi, {user?.name}
              </p>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-xl shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
