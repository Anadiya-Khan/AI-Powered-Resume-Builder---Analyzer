import { generateAIText } from "../services/aiService.js";

// Generate AI enhancements for specific fields only
// Allowed fields: professionalSummary, experience, projects
export const generateResume = async (req, res) => {
  try {
    const {
      fullName,
      role,
      skills,
      experience = [],
      projects = [],
      fields,
    } = req.body;

    // Require fields array to know what to enhance
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a `fields` array with one or more of: professionalSummary, experience, projects",
      });
    }

    const allowed = new Set(["professionalSummary", "experience", "projects"]);
    const invalid = fields.filter((f) => !allowed.has(f));
    if (invalid.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid field(s): ${invalid.join(", ")}. Allowed: professionalSummary, experience, projects`,
      });
    }

    const enhancements = {};

    // Professional Summary
    if (fields.includes("professionalSummary")) {
      const prompt = `You are an expert resume writer. Using ONLY the data provided, write a concise professional summary (3-4 short sentences) tailored to the role: ${role || ""}.
Return ONLY the summary text (no headings or extra commentary). Use achievement-oriented language and avoid inventing facts.

Data:
Full Name: ${fullName || ""}
Role: ${role || ""}
Skills: ${Array.isArray(skills) ? skills.join(", ") : ""}
Experience (titles & companies): ${Array.isArray(experience) ? experience.map(e => e.title + " at " + (e.company || "")).join("; ") : ""}
Projects: ${Array.isArray(projects) ? projects.map(p => p.name).join(", ") : ""}
`;

      const aiText = await generateAIText(prompt);
      enhancements.professionalSummary = (aiText || "").trim();
    }

    // Experience: generate improved descriptions per experience item
    if (fields.includes("experience") && Array.isArray(experience) && experience.length) {
      enhancements.experience = [];
      for (let i = 0; i < experience.length; i++) {
        const item = experience[i] || {};
        const prompt = `Rewrite the following job description into 3 concise achievement-based bullet points. Start each bullet with a strong action verb and include quantifiable results when possible. Return ONLY the bullets separated by newlines, do not add headings or extra commentary.

Job Title: ${item.title || ""}
Company: ${item.company || ""}
StartDate: ${item.startDate || ""}
EndDate: ${item.endDate || ""}
Current Description: ${item.description || ""}
`;

        const aiText = await generateAIText(prompt);
        enhancements.experience.push({
          index: i,
          title: item.title || "",
          company: item.company || "",
          enhanced: (aiText || "").trim(),
        });
      }
    }

    // Projects: generate improved project descriptions
    if (fields.includes("projects") && Array.isArray(projects) && projects.length) {
      enhancements.projects = [];
      for (let i = 0; i < projects.length; i++) {
        const pr = projects[i] || {};
        const prompt = `Rewrite the following project description into a short achievement-focused description (1-2 sentences). Emphasize impact and results. Return ONLY the improved description text.

Project Name: ${pr.name || ""}
Project Description: ${pr.description || ""}
Project Link: ${pr.link || ""}
`;

        const aiText = await generateAIText(prompt);
        enhancements.projects.push({
          index: i,
          name: pr.name || "",
          enhanced: (aiText || "").trim(),
        });
      }
    }

    return res.status(200).json({ success: true, enhancements });
  } catch (error) {
    console.error("AI enhancement error:", error);
    const status = error?.status || 500;
    return res.status(status).json({ success: false, message: error.message || "AI enhancement failed" });
  }
};

