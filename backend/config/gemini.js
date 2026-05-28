import { GoogleGenerativeAI } from "@google/generative-ai";
import process from "process";

let genAI = null;

export const getGeminiClient = () => {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing from .env");

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  return getGeminiClient().getGenerativeModel({ model: modelName });
};
