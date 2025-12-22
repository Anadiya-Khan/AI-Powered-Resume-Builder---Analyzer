import React, { useEffect, useState } from "react";
import api from "../api/api";

const ATSResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchATSResult = async () => {
      const resumeUrl = sessionStorage.getItem("uploadedResumeUrl");
      // console.log(resumeUrl)
      if (!resumeUrl) {
        alert("No uploaded resume found!");
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/ats/score", { resumeUrl }); // send Cloudinary URL to backend
        // console.log(res)
        setResult(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch ATS score.");
      } finally {
        setLoading(false);
      }
    };

    fetchATSResult();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Analyzing your resume...</div>;

  if (!result)
    return (
      <div className="text-center mt-10 text-gray-500">
        ATS result will appear here after analysis.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">ATS Resume Analysis</h1>

      <div className="mb-6 text-center">
        <span className="text-xl font-semibold">Overall Score: </span>
        <span className="text-blue-600 font-bold text-2xl">{result.atsScore}%</span>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Feedback:</h2>
        <ul className="list-disc list-inside space-y-1">
          {result.feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-6">
        <a
          href={result.cloudinaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Download Resume
        </a>
      </div>
    </div>
  );
};

export default ATSResult;
