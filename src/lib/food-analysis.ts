import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIAnalysisResult } from "./types";

export type AIProvider = "anthropic" | "gemini";

const SYSTEM_PROMPT = `You are a nutrition expert AI. Analyze food images and estimate nutritional content accurately.

Return ONLY valid JSON with this exact structure:
{
  "foods": [
    {
      "name": "food item name",
      "estimatedGrams": 150,
      "calories": 200,
      "protein": 25,
      "fiber": 2,
      "fat": 8,
      "carbs": 10,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "total": {
    "calories": 200,
    "protein": 25,
    "fiber": 2,
    "fat": 8,
    "carbs": 10
  },
  "notes": "optional notes about the analysis"
}

Guidelines:
- Identify all visible food items in the image
- Estimate portion sizes in grams based on visual cues
- Use standard USDA nutritional data
- Be conservative with estimates when uncertain
- Set confidence to "low" for unclear items
- Sum totals across all identified foods`;

const USER_PROMPT =
  "Analyze this food image. Identify all food items, estimate portion sizes in grams, and calculate nutritional values (calories, protein, fiber, fat, carbs). Return only JSON.";

type ImageInput = { image: string; mediaType: string };

export function parseAnalysisResponse(text: string): AIAnalysisResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response");
  }
  return JSON.parse(jsonMatch[0]) as AIAnalysisResult;
}

export function resolveProvider(): AIProvider | null {
  const preferred = process.env.AI_PROVIDER?.toLowerCase();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (preferred === "anthropic") {
    return anthropicKey ? "anthropic" : null;
  }
  if (preferred === "gemini") {
    return geminiKey ? "gemini" : null;
  }

  if (anthropicKey) return "anthropic";
  if (geminiKey) return "gemini";
  return null;
}

export function getProviderLabel(provider: AIProvider): string {
  return provider === "anthropic" ? "Claude" : "Gemini";
}

export async function analyzeFoodImage(
  provider: AIProvider,
  input: ImageInput
): Promise<AIAnalysisResult> {
  if (provider === "anthropic") {
    return analyzeWithAnthropic(input);
  }
  return analyzeWithGemini(input);
}

async function analyzeWithAnthropic({
  image,
  mediaType,
}: ImageInput): Promise<AIAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: image,
            },
          },
          { type: "text", text: USER_PROMPT },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No response from Claude");
  }

  return parseAnalysisResponse(textBlock.text);
}

async function analyzeWithGemini({
  image,
  mediaType,
}: ImageInput): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mediaType,
        data: image,
      },
    },
    { text: USER_PROMPT },
  ]);

  const text = result.response.text();
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return parseAnalysisResponse(text);
}
