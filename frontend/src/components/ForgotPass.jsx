import React, { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email not found");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-5">
      <div className="w-full max-w-md border p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 w-full rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
        onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
