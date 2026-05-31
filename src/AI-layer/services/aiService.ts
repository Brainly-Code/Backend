import OpenAI from "openai";
import 'dotenv/config';

// Validate API key BEFORE initializing the client
// Note: Using OpenRouter API (https://openrouter.ai)
if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error("OpenRouter API key is not set in environment variables. Please set DEEPSEEK_API_KEY (or OPENROUTER_API_KEY) in your .env file.");
}

// Check if API key is empty or just whitespace
if (!process.env.DEEPSEEK_API_KEY.trim()) {
  throw new Error("OpenRouter API key is empty. Please provide a valid DEEPSEEK_API_KEY (or OPENROUTER_API_KEY) in your .env file.");
}

const openai = new OpenAI({ 
  apiKey: process.env.DEEPSEEK_API_KEY.trim(), 
  baseURL: "https://openrouter.ai/api/v1" 
});

export async function askTutor(userInput, memoryContext) {
  const systemPrompt = `
  You are an AI programming tutor.
  - Explain clearly but briefly.
  - When users send code, help debug it line by line.
  - If they ask theory, give examples.
  - Use simple terms like teaching a beginner.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        { role: "system", content: systemPrompt },
        ...(memoryContext || []),
        { role: "user", content: userInput },
      ],
    });
    return response.choices[0]?.message?.content ?? "";
  } catch (err) {
    // Re-throw with concise message so controller can log
    const message = (err && (err as any).message) ? (err as any).message : "OpenAI request failed";
    throw new Error(message);
  }
}
