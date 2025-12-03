import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini API Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIText = async (prompt, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`AI attempt ${i + 1}/${retries}...`);
      
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",        // you can keep 2.5-flash here
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      });

      const result = await model.generateContent(prompt);
      console.log("AI Response Received");
      return result.response.text();

    } catch (error) {
      const isOverload = error.status === 503 || 
                        error.message?.includes("503") || 
                        error.message?.includes("overloaded");

      if (isOverload && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000; // 1s, 2s, 4s...
        console.log(`Model overloaded. Retrying in ${delay/1000}s...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }

      console.error("AI Error (no retry):", error.message);
      throw error;
    }
  }
};