# NutriAI — AI Calorie Tracker

Track daily calories, protein, fiber, fat, and carbs with personalized weight-loss recommendations and AI-powered food scanning.

## Features

- **Daily macro tracking** — Calories, protein, fiber, fat, and carbs with progress rings and bars
- **Weight loss recommendations** — Mifflin-St Jeor BMR/TDEE calculation based on height, weight, age, gender, and activity level
- **AI food scanning** — Upload or capture a photo; Claude or Gemini analyzes it and estimates all nutritional values
- **Ingredient tracking** — Search 30+ foods, set grams per ingredient, and log combined meals
- **Manual entry** — Add custom foods with exact nutrition values

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Add at least one AI API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI API Setup

The scan feature supports **Claude (Anthropic)** or **Gemini (Google)**. Add at least one key to `.env.local`:

```
# Option 1: Anthropic Claude — https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-...

# Option 2: Google Gemini — https://aistudio.google.com/apikey
GEMINI_API_KEY=AIza...

# Which provider to use (optional, default: auto)
AI_PROVIDER=auto
```

### Provider selection

| `AI_PROVIDER` | Behavior |
|---|---|
| `auto` (default) | Uses Claude if `ANTHROPIC_API_KEY` is set, otherwise Gemini |
| `anthropic` | Always use Claude |
| `gemini` | Always use Gemini |

Restart the dev server after changing `.env.local`.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Anthropic Claude API + Google Gemini API (vision)
- localStorage for data persistence
