import { useState } from "react";
import { Sparkles } from "lucide-react";
import { aiGenerateContent } from "../api/resume.api";

export default function AIEnhancer({ fieldName, payload, onApply }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const enhance = async () => {
    try {
      setLoading(true);
      // send the whole resume payload to backend AI endpoint
      // include `fields` so backend knows which parts to enhance
      const body = { ...payload, fields: [fieldName] };
      const res = await aiGenerateContent(body);

      const enhancements = res?.data?.enhancements;

      let improvedText = "";
      if (!enhancements) {
        improvedText = "No suggestion found";
      } else if (fieldName === "professionalSummary") {
        improvedText = enhancements.professionalSummary || "No suggestion found";
      } else if (fieldName === "experience") {
        const exp = enhancements.experience || [];
        // If request contained a single experience item, return only its enhanced description
        if (Array.isArray(payload?.experience) && payload.experience.length === 1 && exp[0]) {
          improvedText = exp[0].enhanced || "No suggestion found";
        } else {
          // join enhanced experience entries into readable text
          improvedText = exp
            .map((e) => `- ${e.title} at ${e.company}\n${e.enhanced}`)
            .join("\n\n");
        }
      } else if (fieldName === "projects") {
        const prArr = enhancements.projects || [];
        if (Array.isArray(payload?.projects) && payload.projects.length === 1 && prArr[0]) {
          improvedText = prArr[0].enhanced || "No suggestion found";
        } else {
          improvedText = prArr
            .map((p) => `- ${p.name}\n${p.enhanced}`)
            .join("\n\n");
        }
      } else {
        improvedText = JSON.stringify(enhancements, null, 2);
      }

      setSuggestion(improvedText || "No suggestion found");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {/* Sparkle Button */}
      <button
        onClick={enhance}
        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
      >
        <Sparkles size={16} />
        Enhance
      </button>

      {/* Loading State */}
      {loading && (
        <p className="text-sm text-gray-500 mt-2">AI is thinking...</p>
      )}

      {/* AI Suggestion Card */}
      {suggestion && !loading && (
        <div className="mt-3 p-3 border border-indigo-400 bg-indigo-50 rounded-lg shadow-sm">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {suggestion}
          </p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onApply(suggestion)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md"
            >
              Apply
            </button>

            <button
              onClick={() => setSuggestion("")}
              className="px-3 py-1 bg-gray-300 text-sm rounded-md"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
