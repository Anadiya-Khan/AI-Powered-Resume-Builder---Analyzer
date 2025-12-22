import React, { useEffect, useState } from "react";
import { FilePlus, UploadCloud ,BookPlus,Pencil,Trash} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteResume, getAllResume } from "../api/resume.api";
import toast from "react-hot-toast";
import Backbutton from "../components/Backbutton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [savedResumes, setSavedResumes] = useState([]);

  // Load resumes from localStorage
useEffect(() => {
  const getresumes = async () => {
    try {
      const res = await getAllResume();
      if(res?.data?.resumes){
        setSavedResumes(res?.data?.resumes);
      }
    } catch (err) {
      console.log("Error fetching resumes:", err);
    }
  }
  getresumes();
}, []);

  // Delete resume
  const handleDelete = async (id) => {
  try {
    await deleteResume(id);
    toast.success("Resume Deleted Successfully");
    setSavedResumes(prev =>
      prev.filter(r => r._id !== id)
    );
  } catch (error) {
    // error already toasted in service
  }
};


  // Edit resume
  const handleEdit = (resume) => {
    navigate("/create-resume",{state:resume}); // Pass resume data to edit page.//state is just a data   
  };

  return ( 
    <div className="min-h-screen flex flex-col bg-gray-50">

  <div className="flex-1 p-8 max-w-6xl mx-auto">
    <Backbutton/>

    <h3 className="text-3xl font-bold mb-8 text-gray-800">
      Let's build your standout resume.
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div
        className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl cursor-pointer
                   hover:shadow-xl hover:border-blue-400 transition duration-300"
        onClick={() => navigate("/select-template")}
      >
        <div className="flex items-center gap-4">
          <FilePlus size={40} className="text-blue-500" />
          <div>
            <h4 className="text-xl font-semibold text-gray-900">Create Resume</h4>
            <p className="text-gray-600 text-sm mt-1">
              Start from scratch using our guided form.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Resume Card */}
      <div
        className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl cursor-pointer
                   hover:shadow-xl hover:border-blue-400 transition duration-300"
        onClick={() => navigate("/upload-resume")}
      >
        <div className="flex items-center gap-4">
          <UploadCloud size={40} className="text-green-500" />
          <div>
            <h4 className="text-xl font-semibold text-gray-900">Upload Resume</h4>
            <p className="text-gray-600 text-sm mt-1">
              Upload your PDF and See your ATS Score.
            </p>
          </div>
        </div>
      </div>

    </div>

    {/* Saved Resumes Section */}
<h3 className="text-2xl font-bold mb-6 text-gray-800">
  Your Resumes
</h3>

{savedResumes.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {savedResumes.map((resume) => (
      <div
        key={resume._id}
        className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm 
                  hover:shadow-xl hover:border-blue-400 transition duration-300 flex flex-col"
      >
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-green-100 rounded-xl">
           
              <BookPlus className="h-6 w-6 text-green-600"/>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {resume.fullName || "Untitled Resume"}
            </h4>
            <p className="text-gray-600 text-sm">
              {resume.address || "Your Role Here"}
            </p>
          </div>
        </div>

        {/* Date */}
        <p className="text-gray-400 text-sm mb-5">
          Updated {new Date(resume.updatedAt).toLocaleDateString("en-IN")}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-auto">
          
          {/* Edit */}
          <button
            onClick={() => handleEdit(resume)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            <Pencil className="h-5 w-5"/>
            Edit
          </button>

        

          {/* Delete */}
          <button
            onClick={() => handleDelete(resume._id)}
            className="text-red-500 hover:text-red-700"
          >
           <Trash className="h-5 w-5"/>
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500">No resumes saved yet.</p>
)}

</div>
</div>
  )}

export default Dashboard;
