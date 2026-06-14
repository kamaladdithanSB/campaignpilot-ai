import OpenAI from 'openai';
import { LLMProvider } from './LLMProvider';

export class OpenRouterProvider implements LLMProvider {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey && apiKey !== 'your-openrouter-api-key-here') {
      this.client = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
      });
    }
  }

  async generate(prompt: string): Promise<string> {
    if (!this.client) {
      return JSON.stringify({ error: 'OpenRouter API key missing' });
    }

    const completion =
  await this.client.chat.completions.create({
    model: "google/gemini-2.5-flash",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.7,

    max_tokens: 800
  });

    return completion.choices[0]?.message?.content || '';
  }
  
}
