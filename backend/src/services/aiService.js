import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-001";
const DEFAULT_MAX_TOKENS = parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || "1024", 10);

function extractRetrySeconds(msg) {
  if (!msg || typeof msg !== "string") return null;
  const m = msg.match(/Please retry in (\d+(?:\.\d+)?)s/i);
  if (m && m[1]) return parseFloat(m[1]);
  const m2 = msg.match(/retryDelay["']?:\s*"?(\d+)s/i);
  if (m2 && m2[1]) return parseInt(m2[1], 10);
  return null;
}

export const generateAIText = async (prompt, retries = 5) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`AI attempt ${attempt + 1}/${retries} using model ${DEFAULT_MODEL}...`);

      const model = genAI.getGenerativeModel({
        model: DEFAULT_MODEL,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: DEFAULT_MAX_TOKENS,
        },
      });

      const result = await model.generateContent(prompt);
      console.log("AI Response Received");
      if (result?.response?.text) return result.response.text();
      if (typeof result === "string") return result;
      return JSON.stringify(result);

    } catch (error) {
      console.error(`AI attempt ${attempt + 1} failed:`, error?.message || error);

      const status = error?.status || error?.response?.status;
      const msg = error?.message || error?.response?.data || "";

      // If server suggested a retry delay, respect it
      const serverDelay = extractRetrySeconds(typeof msg === "string" ? msg : JSON.stringify(msg));
      if (serverDelay && attempt < retries - 1) {
        const waitMs = Math.ceil(serverDelay * 1000) + Math.floor(Math.random() * 1000);
        console.log(`Server suggested retry in ${serverDelay}s; waiting ${waitMs/1000}s...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      const isQuota = status === 429 || /quota|Too Many Requests|exceeded/i.test(msg);
      const isOverload = status === 503 || /overload|overloaded/i.test(msg);

      if ((isQuota || isOverload) && attempt < retries - 1) {
        const delay = Math.min(60000, Math.pow(2, attempt) * 1000) + Math.floor(Math.random() * 1000);
        console.log(`Transient error (status=${status}). Retrying in ${delay/1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      const e = new Error(error?.message || "AI generation failed");
      e.status = isQuota ? 429 : status || 500;
      e.original = error;
      throw e;
    }
  }
  throw new Error("AI generation failed after retries");
};