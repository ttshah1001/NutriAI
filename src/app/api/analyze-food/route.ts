import { NextRequest, NextResponse } from "next/server";
import {
  analyzeFoodImage,
  getProviderLabel,
  resolveProvider,
} from "@/lib/food-analysis";

export async function POST(request: NextRequest) {
  try {
    const provider = resolveProvider();
    if (!provider) {
      return NextResponse.json(
        {
          error:
            "No AI API key configured. Add ANTHROPIC_API_KEY or GEMINI_API_KEY to .env.local.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { image, mediaType } = body as {
      image: string;
      mediaType: string;
    };

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const result = await analyzeFoodImage(provider, { image, mediaType });

    return NextResponse.json({
      ...result,
      provider: getProviderLabel(provider),
    });
  } catch (error) {
    console.error("Food analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
