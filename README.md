# CVBuilder — AI-Powered Resume Builder

A Next.js CV/Resume builder with live preview, four professional templates,
PDF download, and a Gemini-powered AI assistant (Improve with AI, AI Resume
Review, and Job Description Matcher).

## Getting started

1. Install dependencies:

   npm install

2. Configure the AI (required for the AI features only — everything else
   works without it). Copy the example env file and add your key:

   cp .env.local.example .env.local

   Then edit `.env.local` and set:

   GEMINI_API_KEY=your-actual-gemini-api-key

   Get a key at https://aistudio.google.com/apikey. The key is used only in
   the server-side API route (`app/api/ai/route.ts`) and is never exposed to
   the browser. Do not prefix it with NEXT_PUBLIC_.

3. Run the dev server:

   npm run dev

   Open http://localhost:3000

## Production

npm run build
npm run start

On Vercel, add `GEMINI_API_KEY` under Project Settings → Environment
Variables (Production), then deploy.

## Project structure

- `app/page.tsx` — landing page
- `app/builder/page.tsx` — resume builder with live preview and PDF download
- `app/builder/AiAssistant.tsx` — AI assistant UI (suggestions, review, matcher)
- `app/api/ai/route.ts` — server-side Gemini Interactions API route
  (rate-limited, key stays on the server)
- `app/components/Motion.tsx` — scroll-reveal and count-up animations
- `app/login`, `app/signup` — auth pages (UI)
