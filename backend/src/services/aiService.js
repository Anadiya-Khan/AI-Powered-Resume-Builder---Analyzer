import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateAIText = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Groq AI Error:", err.message || err);
    throw new Error("AI service unavailable");
  }
};
