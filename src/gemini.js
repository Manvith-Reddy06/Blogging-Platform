import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Use an environment variable for your API key.
// Do not hardcode it in your source code.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });