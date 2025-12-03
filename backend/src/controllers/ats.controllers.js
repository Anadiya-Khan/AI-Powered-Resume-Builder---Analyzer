import { uploadOnCloudinary } from "../config/cloudinary.js";
import fs from "fs";
import PDFParser from "pdf2json";

// Helper: unlink with retry/backoff to handle Windows EBUSY/EPERM locks
const safeUnlink = async (filePath, opts = {}) => {
  const attempts = opts.attempts ?? 5;
  const delayMs = opts.delayMs ?? 200; // ms

  for (let i = 0; i < attempts; i++) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return;
    } catch (err) {
      // On Windows, EBUSY or EPERM may occur when file is locked briefly.
      if (['EBUSY','EPERM','EACCES'].includes(err.code) && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      // rethrow unknown errors
      throw err;
    }
  }
};

// --------------------
// Function to extract PDF text using pdf2json
// --------------------
const extractTextFromPDF = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Important: pass (null, 1) to enable text extraction mode
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (err) => reject(err));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.parseBuffer(fileBuffer);
  });
};

// --------------------
// ATS Score Calculation
// --------------------
const calculateATSScore = (text) => {
  let score = 0;
  const feedback = [];

  // 1. Contact Info (20 points)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

  if (emailRegex.test(text)) {
    score += 10;
    feedback.push("✓ Email found");
  } else feedback.push("✗ Email missing");

  if (phoneRegex.test(text)) {
    score += 10;
    feedback.push("✓ Phone number found");
  } else feedback.push("✗ Phone number missing");

  // 2. Key Sections (30 points)
  const sections = {
    experience: /experience|work history|employment/i,
    education: /education|degree|university|college/i,
    skills: /skills|technical skills|competencies/i,
  };

  Object.entries(sections).forEach(([section, regex]) => {
    if (regex.test(text)) {
      score += 10;
      feedback.push(`✓ ${section} section found`);
    } else {
      feedback.push(`✗ ${section} section missing`);
    }
  });

  // 3. Professional Keywords (20 points)
  const professionalKeywords = [
    "managed", "developed", "created", "implemented", "achieved",
    "improved", "led", "coordinated", "designed", "analyzed"
  ];

  const keywordsFound = professionalKeywords.filter((keyword) =>
    new RegExp(`\\b${keyword}\\b`, "i").test(text)
  );

  const keywordScore = Math.min(20, keywordsFound.length * 2);
  score += keywordScore;

  feedback.push(`✓ Found ${keywordsFound.length} action verbs (${keywordScore}/20 points)`);

  // 4. Quantifiable Achievements (15 points)
  const numberRegex = /\d+[\%\+\$]/g;
  const quantifiableAchievements = text.match(numberRegex) || [];

  if (quantifiableAchievements.length > 0) {
    const achievementScore = Math.min(15, quantifiableAchievements.length * 5);
    score += achievementScore;
    feedback.push(`✓ Found ${quantifiableAchievements.length} quantifiable achievements (${achievementScore}/15 points)`);
  } else {
    feedback.push("✗ No quantifiable achievements found (0/15 points)");
  }

  // 5. Resume Length (15 points)
  const wordCount = text.split(/\s+/).length;

  if (wordCount >= 300 && wordCount <= 800) {
    score += 15;
    feedback.push(`✓ Optimal length: ${wordCount} words`);
  } else if (wordCount < 300) {
    const lengthScore = Math.floor((wordCount / 300) * 15);
    score += lengthScore;
    feedback.push(`⚠ Too short: ${wordCount} words (${lengthScore}/15)`);
  } else {
    score += 10;
    feedback.push(`⚠ Too long: ${wordCount} words (10/15)`);
  }

  return { score, feedback, wordCount };
};

// --------------------
// Upload + Score Resume
// --------------------
const uploadAndScoreResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ success: false, message: "Only PDF files allowed" });
    }

    // Use in-memory buffer provided by multer.memoryStorage
    const buffer = req.file.buffer;
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return res.status(400).json({ success: false, message: "Invalid file upload" });
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(buffer);

    // Calculate ATS score
    const { score, feedback, wordCount } = calculateATSScore(extractedText);

    // Upload PDF to Cloudinary directly from buffer
    const cloudinaryResponse = await uploadOnCloudinary(buffer);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        atsScore: score,
        maxScore: 100,
        percentage: `${score}%`,
        feedback,
        wordCount,
        extractedText,
        cloudinaryUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      },
    });

  } catch (error) {
    console.error("ATS Error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      try { await safeUnlink(req.file.path); } catch (e) { console.warn('Failed to cleanup file after error:', e.message); }
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { uploadAndScoreResume };
