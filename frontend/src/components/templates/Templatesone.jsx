import React from "react";

export default function TemplateOne({ data = {} }) {
  const {
    fullName,
    email,
    phone,
    address,
    skills = [],
    education = [],
    experience = [],
    projects = [],
    aiGeneratedContent,
  } = data;

  const renderDescription = (desc) => {
    if (!desc) return null;
    const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
    const isBullet = lines.length > 0 && lines.every((l) => /^[-*•]\s+/.test(l));

    if (isBullet) {
      return (
        <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
          {lines.map((l, idx) => (
            <li key={idx}>{l.replace(/^[-*•]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p className="text-sm text-slate-700 whitespace-pre-wrap wrap-break-word">{desc}</p>;
  };

  return (
    <div
      className="w-full bg-white p-8 rounded-lg shadow-lg border border-slate-200 text-slate-900 printable"
      style={{
        width: "210mm",
        maxWidth: "100%",
        boxSizing: "border-box",
        minHeight: "calc(297mm - 20mm)",
      }}
    >
      {/* Header */}
      <div className="border-b-2 border-black pb-2 mb-2">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-slate-900">
            {fullName || "Your Name"}
          </h1>
          <p className="text-sm text-slate-700 font-semibold mt-1">
            {data?.role || "Your Professional Title"}
          </p>
        </div>

        {/* Contact (left aligned) */}
        <div className="mt-1 text-sm text-slate-600">
          <div className="flex flex-wrap gap-4">
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {address && <span>{address}</span>}
          </div>

          {data.links && data.links.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-3 text-sm">
              {data.links.map((l, i) => l && (
                <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="text-slate-700">{l}</a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <div className="mb-2 text-left">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-1">Professional Summary</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap text-left">{data.professionalSummary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4 text-left">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="text-xs bg-slate-200 font-bold text-slate-800 px-3 py-2 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-4 text-left">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-1">Experience</h2>

          {experience.map((ex, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900">{ex.title} - <span className="text-sm text-slate-600">{ex.company}</span></p>
                 
                </div>
                <div className="text-sm text-slate-600">{ex.startDate} {ex.endDate && `- ${ex.endDate}`}</div>
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {renderDescription(ex.description)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-4 text-left">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-1">Education</h2>

          {education.map((e, i) => (
            <div key={i} className="mb-3">
              <p className="font-bold text-slate-900">{e.degree} -------- <span className="text-sm text-slate-600">{e.institution}</span></p>  
             
              {(e.year || e.grade) && (
                <p className="text-xs text-slate-900">{e.year} {e.grade && `• ${e.grade}`}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-4 text-left">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-1">Projects</h2>

          {projects.map((p, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold text-slate-900">{p.name}</p>
              <div className="mt-1 text-sm text-slate-700">{renderDescription(p.description)}</div>
              {p.link && (
                <a className="text-slate-700 underline text-sm" href={p.link} target="_blank" rel="noopener noreferrer">Link</a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Enhanced Section */}
      {aiGeneratedContent && (
        <div className="p-4 bg-white border border-slate-200 rounded-lg mt-8">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">AI Enhanced Resume</h2>
          <pre className="whitespace-pre-wrap text-sm text-slate-700">{aiGeneratedContent}</pre>
        </div>
      )}
    </div>
  );
}
