"use client";

import { useState } from "react";

type Mode = "professional" | "concise" | "ats";

const MODE_LABELS: { mode: Mode; label: string }[] = [
  { mode: "professional", label: "Professional" },
  { mode: "concise", label: "Concise" },
  { mode: "ats", label: "ATS Optimize" },
];

async function callAi(payload: Record<string, unknown>): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: { suggestion?: string; review?: string; analysis?: string; error?: string };
  try {
    data = await response.json();
  } catch {
    throw new Error("Unexpected response from the AI service.");
  }

  if (!response.ok) {
    throw new Error(data.error || "The AI request failed. Please try again.");
  }
  return data.suggestion ?? data.review ?? data.analysis ?? "";
}

/* ------------------------------------------------------------------ */
/* Improve with AI (per-field)                                         */
/* ------------------------------------------------------------------ */

export function AiImprove({
  field,
  text,
  context,
  onAccept,
}: {
  field: "summary" | "experience" | "education" | "project";
  text: string;
  context?: Record<string, string>;
  onAccept: (newText: string) => void;
}) {
  const [loadingMode, setLoadingMode] = useState<Mode | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [usedMode, setUsedMode] = useState<Mode | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tooShort = text.trim().length < 5;

  const improve = async (mode: Mode) => {
    setError(null);
    setSuggestion(null);
    setEditing(false);
    setLoadingMode(mode);
    try {
      const result = await callAi({ action: "improve", mode, field, text, context });
      setSuggestion(result);
      setUsedMode(mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoadingMode(null);
    }
  };

  const reset = () => {
    setSuggestion(null);
    setUsedMode(null);
    setEditing(false);
    setError(null);
  };

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span className="bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
            ✦
          </span>
          Improve with AI
        </span>

        {MODE_LABELS.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            disabled={tooShort || loadingMode !== null}
            onClick={() => improve(mode)}
            title={
              tooShort
                ? "Write your text in your own words first, then let AI polish it."
                : `Rewrite as ${label}`
            }
            className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-gradient-to-b from-white to-cyan-50 px-3.5 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            {loadingMode === mode ? (
              <>
                <span className="ai-dots inline-flex items-center gap-0.5 text-cyan-500">
                  <span />
                  <span />
                  <span />
                </span>
                Improving
              </>
            ) : (
              <>
                <span className="transition-transform duration-200 group-hover:rotate-12">
                  ✦
                </span>
                {label}
              </>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {suggestion !== null && (
        <div className="mt-3 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-300 to-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/10">
          <div className="rounded-[calc(1rem-1.5px)] bg-white p-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-cyan-600">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-sky-500 text-[10px] text-white">
              ✦
            </span>
            AI Suggestion{" "}
            {usedMode &&
              `(${MODE_LABELS.find((m) => m.mode === usedMode)?.label})`}
          </p>

          {editing ? (
            <textarea
              rows={5}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="mt-2 w-full rounded-xl border border-cyan-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          ) : (
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#19324a]">
              {suggestion}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onAccept(suggestion);
                reset();
              }}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-cyan-500/20"
            >
              Accept
            </button>

            <button
              type="button"
              onClick={() => setEditing((previous) => !previous)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-[#19324a] transition hover:bg-slate-50"
            >
              {editing ? "Preview" : "Edit"}
            </button>

            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
            >
              Reject
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            AI only rewrites what you wrote. It will not invent experience,
            skills or numbers. Your original text stays until you accept.
          </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Resume Review                                                    */
/* ------------------------------------------------------------------ */

export function AiReview({ getResumeText }: { getResumeText: () => string }) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await callAi({ action: "review", resume: getResumeText() });
      setReview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-base text-white shadow-md shadow-cyan-500/20">
            ✓
          </span>
          <div>
            <h3 className="font-bold text-slate-950">AI Resume Review</h3>
            <p className="mt-1 text-sm text-slate-500">
              Checks clarity, ATS-readiness, weak wording, repetition and missing
              information.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="ai-dots inline-flex items-center gap-0.5 text-cyan-300">
                <span />
                <span />
                <span />
              </span>
              Reviewing
            </span>
          ) : review ? (
            "Review Again"
          ) : (
            "Run Review"
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {review && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#19324a]">
            {review}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Job Description Matcher                                             */
/* ------------------------------------------------------------------ */

export function JobMatch({ getResumeText }: { getResumeText: () => string }) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await callAi({
        action: "match",
        resume: getResumeText(),
        jobDescription,
      });
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-base text-white shadow-md shadow-cyan-500/20">
          ⇄
        </span>
        <div>
          <h3 className="font-bold text-slate-950">Job Description Matcher</h3>
          <p className="mt-1 text-sm text-slate-500">
            Paste a job description to see where your resume already matches, which
            wording to align, and any honest gaps. It will never suggest inventing
            qualifications.
          </p>
        </div>
      </div>

      <textarea
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      />

      <button
        type="button"
        onClick={run}
        disabled={loading || jobDescription.trim().length < 40}
        className="mt-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="ai-dots inline-flex items-center gap-0.5 text-white">
              <span />
              <span />
              <span />
            </span>
            Matching
          </span>
        ) : (
          "Match Resume to Job"
        )}
      </button>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {analysis && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#19324a]">
            {analysis}
          </pre>
        </div>
      )}
    </div>
  );
}
