import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Backbutton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black transition font-medium"
    >
      <span className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
        <ArrowLeft size={18} />
      </span>
      Back
    </button>
  );
};

export default Backbutton;
