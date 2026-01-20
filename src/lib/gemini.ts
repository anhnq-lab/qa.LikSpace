import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

// Update to use the correct model name if needed
export const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
