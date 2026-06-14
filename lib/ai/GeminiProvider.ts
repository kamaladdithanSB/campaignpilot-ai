import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider } from "./LLMProvider";

export class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your-gemini-api-key-here") {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
    }
  }

  async generate(prompt: string): Promise<string> {
    if (!this.model) {
      console.warn("Gemini API key missing or invalid. Falling back to mock response.");
      return JSON.stringify({ error: "Gemini API key missing" });
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini generation error:", error);
      throw error;
    }
  }
}
