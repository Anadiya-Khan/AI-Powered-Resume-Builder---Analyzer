import React, { useState, useEffect, useContext } from "react";
import { login } from "../assets/assets";
import { authContext } from "../context/Context";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{8,}$/;

  const {setUser} = useContext(authContext);

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [cpassword, setCpassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/users/login", { email, password });
      // console.log(res)
      setUser(res.data.data.user); 
      setIsLogin(true)
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      // console.log(res.data.data.accessToken)
      localStorage.setItem("token", res.data.data.accessToken);
      navigate("/dashboard");
      const success = res.data?.data?.message 
      toast.success(success) 
    } catch (error) {
      console.log("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed!")
    }
  };

 const handleRegister = async (e) => {
  e.preventDefault();

  // 1) Match check
  if (password !== cpassword) {
    toast.error("Passwords do not match");
    return;
  }

  // 2) Password strength validation
  if (!passwordRegex.test(password)) {
    toast.error(
      "Password must be 8+ chars and include a letter, number & special character."
    );
    return;
  }

  try {
    const res = await api.post("/users/register", {
      name: fullName,
      email,
      password
    });

    setUser(res.data.data.user);

    const success = res.data?.data?.message;
    toast.success(success);
    setIsLogin(true)
    setFullName("");
    setEmail("");
    setPassword("");
    setCpassword("");

  } catch (error) {
    console.log("Register Error:", error);
    const err = error.response?.data?.message || "Error occurred";
    toast.error(err);
  }
};


  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row">

      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 bg-linear-to-b from-blue-100 to-blue-50 flex-col justify-center items-center p-10">
        <img src={login} alt="resume" className="rounded-xl mb-6 w-64" />
        <h1 className="text-2xl font-semibold text-center">Craft Your Future, Instantly.</h1>
        <p className="text-gray-600 w-3/4 text-center mt-2">
          Let AI help you build a resume that stands out.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">

        {/* Close Button */}
        <button
          onClick={()=>navigate("/")}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <div className="w-full max-w-md">

          {/* ------------------ LOGIN FORM ------------------ */}
          {isLogin ? (
            <>
              <h1 className="text-2xl font-semibold mb-6 text-center md:text-left">
                Welcome Back
              </h1>

              <label>Email Address</label>
              <input
                type="email"
                className="border w-full p-2 rounded mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>
              <input
                type="password"
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="w-full bg-blue-500 text-white p-2 rounded mb-2"
                onClick={(e)=>handleLogin(e)}
              >
                Log In
              </button>

              <p className="text-sm mt-4 text-center">
                 <button className="text-sm text-center underline hover:scale-105 duration-150" 
              onClick={()=>navigate("/forgot-password")}>
                Forgot Password</button><br/>
                Don’t have an account?
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  {" "}Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              {/* ------------------ REGISTER FORM ------------------ */}
              <h1 className="text-2xl font-semibold mb-6 text-center md:text-left">
                Create Your Account
              </h1>

              <label>Full Name</label>
              <input
                className="border w-full p-2 rounded mb-3"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label>Email Address</label>
              <input
                type="email"
                className="border w-full p-2 rounded mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>
              <input
                type="password"
                className="border w-full p-2 rounded mb-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                className="border w-full p-2 rounded mb-4"
                placeholder="Confirm your password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
              />

              <button
                className="w-full bg-green-500 text-white p-2 rounded"
                onClick={handleRegister}
              >
                Create Account
              </button>

              <p className="text-sm mt-4 text-center">
                Already have an account?
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setIsLogin(true)}
                >
                  {" "}Log in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
