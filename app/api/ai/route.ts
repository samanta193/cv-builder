// Google Gemini Interactions API (GA) with the current stable Gemini 3.6 Flash model.
// Docs: https://ai.google.dev/api/interactions-api
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

/* ------------------------------------------------------------------ */
/* Abuse protection                                                    */
/*                                                                     */
/* In-memory sliding-window rate limiter, keyed by client IP. On       */
/* Vercel this is per serverless instance, so it is best-effort        */
/* protection against casual abuse and runaway loops rather than a     */
/* hard global guarantee. For strict global limits, back it with a     */
/* shared store (e.g. Upstash Redis / Vercel KV).                      */
/* ------------------------------------------------------------------ */

const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX_REQUESTS = 10; // per IP per window
const MAX_BODY_BYTES = 80_000; // hard cap on request size

const rateBuckets = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS
  );

  if (recent.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (rateBuckets.size > 5000) {
    for (const [key, timestamps] of rateBuckets) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_WINDOW_MS)) {
        rateBuckets.delete(key);
      }
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Prompts                                                             */
/* ------------------------------------------------------------------ */

const NO_FABRICATION = `STRICT RULES:
- Never invent, add, or exaggerate facts. This includes employers, job titles, dates, durations, locations, numbers, percentages, metrics, team sizes, tools, technologies, skills, certifications, degrees, achievements, or responsibilities that are not explicitly present in the user's input.
- If the input has no numbers or metrics, do not add any. Do not estimate or fabricate quantified impact.
- You may fix grammar, spelling, tone, structure, and wording. You may reorganise content and use strong action verbs, as long as every factual claim already exists in the input.
- Preserve the user's meaning exactly. When the input is vague, keep it vague rather than inventing specifics.
- Write in plain text only. No markdown symbols, no headings, no explanations, no preamble. Return only the rewritten content itself.`;

const MODE_INSTRUCTIONS: Record<string, string> = {
  professional:
    "Rewrite the text into polished, professional resume language. Use confident action verbs and clear, complete phrasing suitable for a formal CV.",
  concise:
    "Rewrite the text to be as concise as possible while keeping every fact. Cut filler words, redundancy, and weak phrasing. Prefer short, punchy bullet-style lines.",
  ats:
    "Rewrite the text to be ATS-friendly: simple sentence structure, standard resume terminology, relevant keywords that already appear in or are directly implied by the input, no abbreviations that an applicant tracking system might miss (spell them out once), no special characters or decorative symbols.",
};

const FIELD_HINTS: Record<string, string> = {
  summary:
    "This is a professional summary for the top of a resume. Keep it to 2-4 sentences, first person implied (no 'I'), no bullet points.",
  experience:
    "This is a work experience description. Format as 2-5 short lines, each starting with '- ' followed by an action verb.",
  education:
    "This is an education description (coursework, honors, achievements). Keep it to 1-3 short lines.",
  project:
    "This is a project description for a resume. Format as 1-4 short lines, each starting with '- ', covering what was built, the person's role, and technologies used, only if that information is present in the input.",
};

const REVIEW_SYSTEM = `You are a senior recruiter and ATS specialist reviewing a resume. Assess it for: clarity, ATS-readiness, weak or vague wording, repetition, and missing information (missing sections, missing dates, missing contact details, thin descriptions).

Respond in plain text (no markdown symbols like * or #) using exactly this structure:

OVERALL: one or two sentences of overall assessment.

STRENGTHS:
- point
- point

ISSUES TO FIX:
- point (be specific: quote the weak phrase or name the exact section)
- point

MISSING OR THIN:
- point

ATS NOTES:
- point

Keep the whole review under 350 words. Base every comment strictly on the resume content provided. Do not suggest the user invent achievements, numbers, or experience; instead suggest they add real details if they have them.`;

const MATCH_SYSTEM = `You compare a resume against a job description and suggest honest improvements. You must never suggest the candidate claim skills, experience, tools, or qualifications they do not already have on the resume. You may suggest: re-ordering or emphasising existing content, using the job description's terminology where the resume already demonstrates the same thing under a different name, and flagging genuine gaps so the candidate knows what the employer wants (clearly labelled as gaps, not as things to add dishonestly).

Respond in plain text (no markdown symbols) using exactly this structure:

MATCH SUMMARY: one or two sentences on overall fit based only on the resume content.

STRONG MATCHES:
- requirement from the job, and where the resume already covers it

TERMINOLOGY TO ALIGN:
- job description term, and the existing resume content it should be used to describe

EMPHASISE MORE:
- existing resume content worth moving up or expanding because the job values it

HONEST GAPS:
- requirement the resume does not show. State plainly that the candidate should only address it if they genuinely have it.

Keep it under 400 words.`;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ImproveBody = {
  action: "improve";
  mode: string;
  field: string;
  text: string;
  context?: Record<string, string>;
};

type ReviewBody = { action: "review"; resume: string };

type MatchBody = { action: "match"; resume: string; jobDescription: string };

type RequestBody = ImproveBody | ReviewBody | MatchBody;

type InteractionContentItem = { type?: string; text?: string };

type InteractionStep = {
  type?: string;
  content?: InteractionContentItem[];
};

type InteractionResponse = {
  status?: string;
  steps?: InteractionStep[];
  errors?: { code?: string; message?: string }[];
};

/* ------------------------------------------------------------------ */
/* Gemini call                                                         */
/* ------------------------------------------------------------------ */

async function callGemini(
  apiKey: string,
  systemInstruction: string,
  userContent: string,
  maxOutputTokens: number,
  thinkingLevel: "minimal" | "low" | "medium" | "high"
): Promise<string> {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      input: userContent,
      system_instruction: systemInstruction,
      store: false,
      generation_config: {
        max_output_tokens: maxOutputTokens,
        thinking_level: thinkingLevel,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Gemini API error:", response.status, detail);
    if (response.status === 400 && detail.includes("API_KEY_INVALID")) {
      throw new Error("The AI API key is invalid. Check GEMINI_API_KEY.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "The AI API key was rejected. Check GEMINI_API_KEY and its permissions."
      );
    }
    if (response.status === 404) {
      throw new Error(
        "The AI model was not found. The configured Gemini model may have changed."
      );
    }
    if (response.status === 429) {
      throw new Error("AI rate limit reached. Please try again in a moment.");
    }
    throw new Error("The AI service returned an error. Please try again.");
  }

  const data = (await response.json()) as InteractionResponse;

  if (data.status === "failed" || data.status === "cancelled") {
    console.error("Gemini interaction failed:", JSON.stringify(data.errors));
    throw new Error(
      "The AI could not process this request. Please rephrase and try again."
    );
  }

  // Extract text from model_output steps. Thought summaries and tool steps
  // have different step types and are excluded automatically.
  const text = (data.steps ?? [])
    .filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .filter((item) => item.type === "text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("The AI returned an empty response. Please try again.");
  }
  return text;
}

/* ------------------------------------------------------------------ */
/* Route handler                                                       */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "AI is not configured. Set the GEMINI_API_KEY environment variable on the server.",
      },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many AI requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: RequestBody;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    if (body.action === "improve") {
      const { mode, field, text, context } = body;
      const modeInstruction = MODE_INSTRUCTIONS[mode];
      if (!modeInstruction) {
        return Response.json({ error: "Unknown mode." }, { status: 400 });
      }
      if (typeof text !== "string" || text.trim().length < 5) {
        return Response.json(
          { error: "Please write a little more text before improving it." },
          { status: 400 }
        );
      }
      if (text.length > 6000) {
        return Response.json(
          { error: "Text is too long to improve in one go (6,000 character limit)." },
          { status: 400 }
        );
      }

      const fieldHint = FIELD_HINTS[field] ?? "";
      const contextLines =
        context && Object.keys(context).length > 0
          ? "Context (facts you may rely on, do not add anything beyond them):\n" +
            Object.entries(context)
              .filter(([, value]) => value && value.trim())
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          : "";

      const system = `You are an expert resume writer helping a job seeker rewrite their own words into strong resume language. ${modeInstruction}\n${fieldHint}\n${NO_FABRICATION}`;

      const userContent = `${contextLines ? contextLines + "\n\n" : ""}Rewrite this text:\n\n${text}`;

      const suggestion = await callGemini(apiKey, system, userContent, 2048, "low");
      return Response.json({ suggestion });
    }

    if (body.action === "review") {
      const { resume } = body;
      if (typeof resume !== "string" || resume.trim().length < 40) {
        return Response.json(
          { error: "Fill in more of your resume before running a review." },
          { status: 400 }
        );
      }
      if (resume.length > 20000) {
        return Response.json({ error: "Resume is too long to review." }, { status: 400 });
      }

      const review = await callGemini(
        apiKey,
        REVIEW_SYSTEM,
        `Resume to review:\n\n${resume}`,
        3072,
        "medium"
      );
      return Response.json({ review });
    }

    if (body.action === "match") {
      const { resume, jobDescription } = body;
      if (typeof resume !== "string" || resume.trim().length < 40) {
        return Response.json(
          { error: "Fill in more of your resume before matching it to a job." },
          { status: 400 }
        );
      }
      if (typeof jobDescription !== "string" || jobDescription.trim().length < 40) {
        return Response.json(
          { error: "Paste a fuller job description to match against." },
          { status: 400 }
        );
      }
      if (resume.length > 20000 || jobDescription.length > 15000) {
        return Response.json({ error: "Input is too long." }, { status: 400 });
      }

      const userContent = `RESUME:\n\n${resume}\n\nJOB DESCRIPTION:\n\n${jobDescription}`;
      const analysis = await callGemini(apiKey, MATCH_SYSTEM, userContent, 3072, "medium");
      return Response.json({ analysis });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong. Please try again.";
    return Response.json({ error: message }, { status: 502 });
  }
}
