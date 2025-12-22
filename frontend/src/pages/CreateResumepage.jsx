import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useLocation, useNavigate } from "react-router-dom"; // for navigation
import { createResume, updateResume, exportResumePdfStream } from "../api/resume.api";
import toast from "react-hot-toast";
import TemplateOne from "../components/templates/Templatesone";
import TemplateTwo from "../components/templates/Templatestwo";
import AIEnhancer from "../components/AiEnhanced";
import Backbutton from "../components/Backbutton";

export default function CreateResumepage() {
  const printRef = useRef();
  const navigate = useNavigate(); // navigate to dashboard

  const location = useLocation()
  const editData = location.state

  const [selectedTemplate, setSelectedTemplate] = useState(location.state?.template || editData?.template || "one")

  const [form, setForm] = useState({
    fullName: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    links: [""],
    professionalSummary: "",
    skills: [""],
    education: [{ degree: "", institution: "", year: "", grade: "" }],
    experience: [
      { title: "", company: "", startDate: "", endDate: "", description: "" },
    ],
    projects: [{ name: "", description: "", link: "" }],
  });

  const [aiContent,setAiContent] = useState("")

  useEffect(()=>{
    if(editData){
      setForm(prev => ({ ...prev, ...editData }))
    }
  },[editData])

  useEffect(()=>{
    if(editData?.template) setSelectedTemplate(editData.template)
  },[editData])

  // ---------------- Handle Inputs ----------------
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSimpleArray = (index, field, value) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    const updated = [...current];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const handleArrayChange = (index, field, key, value) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    const updated = [...current];
    updated[index] = { ...(updated[index] || {}), [key]: value };
    setForm({ ...form, [field]: updated });
  };

  const addRow = (field, emptyObj) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    setForm({ ...form, [field]: [...current, emptyObj] });
  };

  // ---------------- PDF Download ----------------
  const handleDownloadPDF = useReactToPrint({
    content: () => printRef.current,
    contentRef: printRef,
    documentTitle: `${form.fullName || "resume"}`,
    pageStyle: `@page { size: A4; margin: 0 } @media print { html, body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .printable { width: 210mm !important; max-width: 210mm !important; box-sizing: border-box !important; min-height: calc(297mm) !important; padding: 12mm !important; box-shadow: none !important; border: none !important; background: white !important; } /* reduce margins for common elements */ header, .no-print { display: none !important; } }`,
  });

  const onDownload = () => {
    if (!printRef.current) {
      toast.error("Nothing to print");
      return;
    }

    // Ensure printable area has content
    const hasContent = printRef.current.innerHTML && printRef.current.innerHTML.trim() !== "";
    if (!hasContent) {
      toast.error("There is nothing to print");
      return;
    }

    handleDownloadPDF();
  };

  const exportServerPdf = async () => {
    try {
      const payload = { ...form };
      // Request server to stream the generated PDF back as a blob
      const res = await exportResumePdfStream(payload);
      if (res && res.data) {
        // create blob and download
        const blob = new Blob([res.data], { type: 'application/pdf' });
        // Try to get filename from Content-Disposition header
        const cd = res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition']);
        let fileName = `${form.fullName || 'resume'}.pdf`;
        if (cd) {
          const match = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)/i);
          if (match && match[1]) fileName = decodeURIComponent(match[1]);
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success('PDF generated — download started');
      } else {
        toast.error("PDF generation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed");
    }
  };

  // ---------------- Save (localStorage) ----------------
  const saveResume = async() => {
      const data = { ...form, template: selectedTemplate }

     let res;

     if(editData?._id){
      res = await updateResume(editData._id,data)
      toast.success("Resume Updated SuccessFully")
     }else{
      res = await createResume(data)
      toast.success("Resume Created Successfully")
     }

     navigate("/dashboard")
  };

//   const aiGenerate = async () => {
//   try {
//     const data = form;

//     // 1️⃣ CALL THE BACKEND
//     const res = await aiGenerateContent(data);

//     // 2️⃣ CHECK RESPONSE
//     if (!res?.data?.resume) {
//       toast.error("AI could not generate the resume.");
//       return;
//     }

//     // 3️⃣ TAKE AI TEXT FROM BACKEND
//     const aiText = res.data.resume.aiGeneratedContent;

//     // 4️⃣ SHOW IT IN PREVIEW
//     setAiContent(aiText);

//     toast.success("AI Resume Generated Successfully!");
//   } catch (error) {
//     console.log(error);
//   }
// };


  return (
   <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
  {/* ================= LEFT SIDE FORM ================= */}
  <div className="p-2 overflow-y-auto bg-white shadow-2xl">
    <Backbutton/>
     
    <div className="max-w-2xl mx-auto">
     
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Create Your Resume
        </h1>
        <p className="text-gray-600">Fill in your details to generate a professional resume</p>
      </div>

      {/* BASIC INFO SECTION */}
      <div className="mb-8 p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
        <div className="grid gap-4">
          <input 
            name="fullName" 
            placeholder="Full Name" 
            className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            value={form.fullName} 
            onChange={handleChange} 
          />
          <input 
            name="role"
            placeholder="Role"
            className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            value={form.role}
            onChange={handleChange}
          />
          <input 
            name="email" 
            type="email"
            placeholder="Email Address" 
            className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            value={form.email} 
            onChange={handleChange} 
          />
          <input 
            name="phone" 
            placeholder="Phone Number" 
            className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            value={form.phone} 
            onChange={handleChange} 
          />
          <input 
            name="address" 
            placeholder="Address" 
            className="border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            value={form.address} 
            onChange={handleChange} 
          />

           <div className="mb-8 p-6 bg-linear-to-br from-indigo-50 to-sky-50 rounded-xl border border-indigo-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            Links
          </h2>
          <div className="space-y-3">
            {form.links.map((l, i) => (
              <input
                key={i}
                placeholder="e.g. https://github.com/username"
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                value={l}
                onChange={(e) => handleSimpleArray(i, "links", e.target.value)}
              />
            ))}
          </div>
          <button
            onClick={() => addRow("links", "")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Add Link
          </button>
        </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          </svg>
          Professional Summary
        </h2>
        <textarea
          name="professionalSummary"
          placeholder="Write a brief professional summary or objective..."
          rows={4}
          className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all outline-none resize-none"
          value={form.professionalSummary}
          onChange={handleChange}
        />
        {/* AI Enhancer: generate professional summary suggestions */}
        <AIEnhancer
          fieldName="professionalSummary"
          payload={form}
          onApply={(text) => setForm((prev) => ({ ...prev, professionalSummary: text }))}
        />
      </div>

      {/* SKILLS SECTION */}
      <div className="mb-8 p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Skills
        </h2>
        <div className="space-y-3">
          {form.skills.map((s, i) => (
            <input 
              key={i} 
              placeholder="e.g. JavaScript, React, Node.js" 
              className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              value={s} 
              onChange={(e) => handleSimpleArray(i, "skills", e.target.value)} 
            />
          ))}
        </div>
        <button 
          onClick={() => addRow("skills", "")} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </button>
      </div>       

      {/* EDUCATION SECTION */}
      <div className="mb-8 p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          Education
        </h2>
        {form.education.map((ed, i) => (
          <div key={i} className="grid gap-3 mb-4 p-4 bg-white rounded-lg border-2 border-green-100 hover:border-green-300 transition-all">
            <input 
              placeholder="Degree (e.g. Bachelor of Science)" 
              className="border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
              value={ed.degree} 
              onChange={(e) => handleArrayChange(i, "education", "degree", e.target.value)} 
            />
            <input 
              placeholder="Institution Name" 
              className="border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
              value={ed.institution} 
              onChange={(e) => handleArrayChange(i, "education", "institution", e.target.value)} 
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="Year (e.g. 2020-2024)" 
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                value={ed.year} 
                onChange={(e) => handleArrayChange(i, "education", "year", e.target.value)} 
              />
              <input 
                placeholder="Grade (e.g. 3.8 GPA)" 
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                value={ed.grade} 
                onChange={(e) => handleArrayChange(i, "education", "grade", e.target.value)} 
              />
            </div>
          </div>
        ))}
        <button 
          onClick={() => addRow("education", { degree: "", institution: "", year: "", grade: "" })}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>

      {/* EXPERIENCE SECTION */}
      <div className="mb-8 p-6 bg-linear-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Work Experience
        </h2>
        {form.experience.map((ex, i) => (
          <div key={i} className="p-4 mb-4 bg-white rounded-lg border-2 border-orange-100 hover:border-orange-300 transition-all">
            <div className="grid gap-3">
              <input 
                placeholder="Job Title" 
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                value={ex.title} 
                onChange={(e) => handleArrayChange(i, "experience", "title", e.target.value)} 
              />
              <input 
                placeholder="Company Name" 
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                value={ex.company} 
                onChange={(e) => handleArrayChange(i, "experience", "company", e.target.value)} 
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                  <input 
                    type="date" 
                    className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    value={ex.startDate} 
                    onChange={(e) => handleArrayChange(i, "experience", "startDate", e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                  <input 
                    type="date" 
                    className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    value={ex.endDate} 
                    onChange={(e) => handleArrayChange(i, "experience", "endDate", e.target.value)} 
                  />
                </div>
              </div>
              <textarea 
                placeholder="Describe your responsibilities and achievements..." 
                rows="6"
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                value={ex.description} 
                onChange={(e) => handleArrayChange(i, "experience", "description", e.target.value)} 
              />
              {/* Per-item AI Enhancer for this experience description */}
              <div className="mt-2">
                <AIEnhancer
                  fieldName="experience"
                  payload={{ fullName: form.fullName, role: form.role, skills: form.skills, experience: [ex] }}
                  onApply={(text) => handleArrayChange(i, "experience", "description", text)}
                />
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={() => addRow("experience", { title: "", company: "", startDate: "", endDate: "", description: "" })}
          className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {/* PROJECTS SECTION */}
      <div className="mb-8 p-6 bg-linear-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Projects
        </h2>
        {form.projects.map((pr, i) => (
          <div key={i} className="grid gap-3 mb-4 p-4 bg-white rounded-lg border-2 border-cyan-100 hover:border-cyan-300 transition-all">
            <input 
              placeholder="Project Name" 
              className="border-2 border-gray-200 p-3 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all outline-none"
              value={pr.name} 
              onChange={(e) => handleArrayChange(i, "projects", "name", e.target.value)} 
            />
            <textarea 
              placeholder="Project Description" 
              rows="3"
              className="border-2 border-gray-200 p-3 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all outline-none resize-none"
              value={pr.description} 
              onChange={(e) => handleArrayChange(i, "projects", "description", e.target.value)} 
            />
            {/* Per-item AI Enhancer for this project description */}
            <div className="mt-2">
              <AIEnhancer
                fieldName="projects"
                payload={{ fullName: form.fullName, role: form.role, skills: form.skills, projects: [pr] }}
                onApply={(text) => handleArrayChange(i, "projects", "description", text)}
              />
            </div>
            <input 
              placeholder="Project Link (optional)" 
              className="border-2 border-gray-200 p-3 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all outline-none"
              value={pr.link} 
              onChange={(e) => handleArrayChange(i, "projects", "link", e.target.value)} 
            />
          </div>
        ))}
        <button 
          onClick={() => addRow("projects", { name: "", description: "", link: "" })}
          className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>

        <div className="mt-8 flex flex-wrap gap-4">

        <button
          onClick={onDownload}
          className="flex-1 min-w-[200px] px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>

        <button
          onClick={exportServerPdf}
          className="flex-1 min-w-[200px] px-6 py-3 bg-linear-to-r from-rose-600 to-pink-600 text-white rounded-lg font-semibold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
          </svg>
          Export PDF
        </button>

        <button
          onClick={saveResume}
          className="flex-1 min-w-[200px] px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Resume
        </button>
      </div>
    </div>      
  </div>

  {/* ================= RIGHT SIDE LIVE PREVIEW ================= */}
  <div className="p-8 bg-white overflow-y-auto sticky top-0 h-screen">
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-gray-100">
      {/* Template selector */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setSelectedTemplate("one")}
          className={`px-3 py-1 rounded ${selectedTemplate === "one" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Template One
        </button>
        <button
          onClick={() => setSelectedTemplate("two")}
          className={`px-3 py-1 rounded ${selectedTemplate === "two" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Template Two
        </button>
      </div>

      {/* Preview (selected template) */}
      <div className="mb-6 flex justify-center">
        <div ref={printRef}>
          {selectedTemplate === "two" ? (
            <TemplateTwo data={{ ...form, aiGeneratedContent: aiContent }} />
          ) : (
            <TemplateOne data={{ ...form, aiGeneratedContent: aiContent }} />
          )}
        </div>
      </div>

      {/* Action Buttons */}
    
    </div>
  </div>
</div>
  )
}