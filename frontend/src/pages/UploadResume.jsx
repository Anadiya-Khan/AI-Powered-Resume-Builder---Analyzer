import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import api from '../api/api';
import toast from 'react-hot-toast';
import Backbutton from '../components/Backbutton';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    // toast.loading(true)
    setError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('resume', file);

      // Call your backend API using axios
      const response = await api.post('/ats/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Axios automatically parses JSON, data is in response.data
      if (response.data.success) {
        setResult(response.data.data);
        toast.success("Your ATS Score")
      } else {
        setError(response.data.message || 'Failed to analyze resume');
        toast.error("Failed to analyze resume")
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to server. Please try again.');
      toast.error("Failed to connect to server. Please try again.")
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score background
  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <Backbutton/>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ATS Resume Analyzer
          </h1>
          <p className="text-gray-600">
            Upload your resume to get an instant ATS score and feedback
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div onSubmit={handleSubmit}>
            {/* File Upload Area */}
            <div className="mb-6">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                  {file && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                      <FileText className="w-5 h-5" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </span>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Score Card */}
            <div className={`${getScoreBg(result.atsScore)} rounded-lg p-6 text-center`}>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Your ATS Score
              </h2>
              <div className={`text-6xl font-bold ${getScoreColor(result.atsScore)}`}>
                {result.atsScore}
                <span className="text-3xl">/100</span>
              </div>
              <p className="text-gray-600 mt-2">{result.percentage}</p>
              <p className="text-sm text-gray-500 mt-2">
                Word Count: {result.wordCount} words
              </p>
            </div>

            {/* Feedback Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Detailed Feedback
              </h3>
              <div className="space-y-2">
                {result.feedback.map((item, index) => {
                  const isPositive = item.startsWith('✓');
                  const isWarning = item.startsWith('⚠');
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        isPositive
                          ? 'bg-green-50'
                          : isWarning
                          ? 'bg-yellow-50'
                          : 'bg-red-50'
                      }`}
                    >
                      {isPositive ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      ) : isWarning ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                      )}
                      <span
                        className={`${
                          isPositive
                            ? 'text-green-700'
                            : isWarning
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }`}
                      >
                        {item.substring(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Quick Tips to Improve
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Add quantifiable achievements (e.g., "Increased sales by 30%")</li>
                <li>• Use action verbs like "managed", "developed", "implemented"</li>
                <li>• Include clear section headers: Experience, Education, Skills</li>
                <li>• Keep your resume between 300-800 words</li>
                <li>• Ensure contact information (email & phone) is visible</li>
              </ul>
            </div>

            {/* Analyze Another Button */}
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setError('');
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;