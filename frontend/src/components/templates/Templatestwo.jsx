import React from "react";

export default function TemplateTwo({ data = {} }) {
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
        <ul className="list-disc ml-5 text-xs text-slate-700 space-y-1">
          {lines.map((l, idx) => (
            <li key={idx}>{l.replace(/^[-*•]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p className="text-xs text-slate-700 whitespace-pre-wrap wrap-break-word">{desc}</p>;
  };

  return (
    <div
      className="bg-white text-slate-900 p-8 rounded-lg border border-slate-300 printable"
      style={{
        width: "210mm",
        maxWidth: "100%",
        boxSizing: "border-box",
        minHeight: "calc(297mm - 20mm)",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {fullName || "YOUR NAME"}
        </h1>

        <p className="text-slate-600 text-sm mt-1">
          {data?.role && <span className="font-medium">{data.role}</span>}
        </p>

        <p className="text-slate-600 text-sm mt-1">
          {address && <span>{address} | </span>}
          {email && <span>{email} | </span>}
          {phone && <span>{phone}</span>}
        </p>

        {data.links && data.links.length > 0 && (
          <p className="text-sm text-slate-600 mt-2 flex flex-wrap gap-3">
            {data.links.map((l, i) => l && (
              <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{l}</a>
            ))}
          </p>
        )}
      </div>

      <hr className="border-slate-300 mb-4" />

      {/* Summary */}
      {(data.professionalSummary || aiGeneratedContent) && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Professional Summary
          </h3>
          <p className="text-xs text-slate-700 whitespace-pre-wrap leading-5">
            {data.professionalSummary || aiGeneratedContent}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience?.some((ex) => ex.title) && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Experience
          </h3>

          <div className="space-y-3 text-xs">
            {experience.map(
              (ex, i) =>
                ex.title && (
                  <div key={i}>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900">
                        {ex.company}
                      </span>
                      <span className="text-slate-600">
                        {ex.startDate}
                        {ex.endDate && ` - ${ex.endDate}`}
                      </span>
                    </div>
                    <p className="text-slate-700">{ex.title}</p>
                    {ex.description && renderDescription(ex.description)}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.some((e) => e.degree) && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Education
          </h3>

          <div className="space-y-2 text-xs text-slate-700">
            {education.map(
              (e, i) =>
                e.degree && (
                  <div key={i}>
                    <p className="font-bold text-slate-900">{e.degree}</p>
                    <p className="text-slate-600">
                      {e.institution}
                      {e.year && `, ${e.year}`}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills?.some(Boolean) && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map(
              (s, i) =>
                s && (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {s}
                  </span>
                )
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.some((p) => p.name) && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Projects
          </h3>

          <div className="space-y-2 text-xs">
            {projects.map(
              (p, i) =>
                p.name && (
                  <div key={i}>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    {p.description && renderDescription(p.description)}
                    {p.link && (
                      <a
                        className="text-blue-600 underline"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {p.link}
                      </a>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
