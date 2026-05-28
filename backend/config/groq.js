import Groq from "groq-sdk";
import process from "process";

let client = null;

export const getGroqClient = () => {
  if (client) return client;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is missing from .env");

  client = new Groq({ apiKey });
  return client;
};
