import { generateAIText } from "../services/aiService.js";
export const generateResume = async (req, res) => {
  try {
    const { fullName, role, skills, experience = [], projects = [], fields } = req.body;

    if (!Array.isArray(fields) || !fields.length) {
      return res.status(400).json({
        success: false,
        message: "Provide a `fields` array: professionalSummary, experience, projects",
      });
    }

    const allowed = new Set(["professionalSummary", "experience", "projects"]);
    const invalid = fields.filter(f => !allowed.has(f));
    if (invalid.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid field(s): ${invalid.join(", ")}. Allowed: professionalSummary, experience, projects`,
      });
    }

    const enhancements = {};

    // Professional Summary
    if (fields.includes("professionalSummary")) {
      const prompt = `You are an expert resume writer. Using ONLY the data provided, write a concise professional summary (2-3 short sentences) tailored to the role: ${role || ""}.
Return ONLY the summary text.

Data:
Full Name: ${fullName || ""}
Role: ${role || ""}
Skills: ${Array.isArray(skills) ? skills.join(", ") : ""}
Experience: ${Array.isArray(experience) ? experience.map(e => e.title + " at " + (e.company || "")).join("; ") : ""}
Projects: ${Array.isArray(projects) ? projects.map(p => p.name).join(", ") : ""}`;

      enhancements.professionalSummary = (await generateAIText(prompt))?.trim() || "";
    }

    // Experience
    if (fields.includes("experience") && experience.length) {
      const experiencePromises = experience.map((item, i) => {
        const prompt = `Rewrite the following job description into 3 concise achievement-based bullet points. Start each bullet with a strong action verb and include quantifiable results when possible. Return ONLY the bullets separated by newlines.

Job Title: ${item.title || ""}
Company: ${item.company || ""}
StartDate: ${item.startDate || ""}
EndDate: ${item.endDate || ""}
Current Description: ${item.description || ""}`;

        return generateAIText(prompt).then(aiText => ({
          index: i,
          title: item.title || "",
          company: item.company || "",
          enhanced: (aiText || "").trim(),
        }));
      });

      enhancements.experience = await Promise.all(experiencePromises);
    }

    // Projects
    if (fields.includes("projects") && projects.length) {
      const projectPromises = projects.map((pr, i) => {
        const prompt = `Rewrite the following project description into a short achievement-focused description (1-2 sentences). Emphasize impact and results. Return ONLY the improved description text.

Project Name: ${pr.name || ""}
Project Description: ${pr.description || ""}
Project Link: ${pr.link || ""}`;

        return generateAIText(prompt).then(aiText => ({
          index: i,
          name: pr.name || "",
          enhanced: (aiText || "").trim(),
        }));
      });

      enhancements.projects = await Promise.all(projectPromises);
    }

    return res.status(200).json({ success: true, enhancements });
  } catch (error) {
    console.error("AI enhancement error:", error);
    return res.status(error?.status || 500).json({ success: false, message: error.message || "AI enhancement failed" });
  }
};
