/* ------------------------------------------------------------------ *
 * RESUME DATA ACCESS
 *
 * Every read/write of the `resumes` table goes through here. Row Level
 * Security on Supabase is what actually enforces ownership; the
 * `user_id` filters below are a second layer so a bug can never show
 * one user another user's CV.
 * ------------------------------------------------------------------ */

import { supabase } from "@/lib/supabase";
import {
  ResumeContent,
  ResumeRecord,
  ResumeSummary,
  normalizeResumeContent,
  resolveResumeTitle,
} from "@/lib/resume-types";

export class ResumeError extends Error {}

/* Turns raw Supabase/network errors into something a user can read. */
function friendly(error: unknown, fallback: string): ResumeError {
  console.error(error);

  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : "";

  if (/fetch|network|Failed to fetch/i.test(message)) {
    return new ResumeError(
      "We couldn't reach the server. Please check your connection and try again."
    );
  }

  if (/row-level security|permission|policy/i.test(message)) {
    return new ResumeError(
      "You don't have access to this CV. Please log in again."
    );
  }

  if (/relation .* does not exist|schema cache/i.test(message)) {
    return new ResumeError(
      "The CV storage isn't set up yet. Please run the database migration."
    );
  }

  return new ResumeError(fallback);
}

/* Returns the signed-in user, or null. */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new ResumeError("Your session has expired. Please log in again.");
  }
  return user;
}

/* ------------------------------------------------------------------ *
 * LIST
 * ------------------------------------------------------------------ */

export async function listResumes(): Promise<ResumeSummary[]> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw friendly(error, "We couldn't load your CVs. Please try again.");

  return (data ?? []) as ResumeSummary[];
}

/* ------------------------------------------------------------------ *
 * GET ONE
 * ------------------------------------------------------------------ */

export async function getResume(id: string): Promise<ResumeRecord> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw friendly(error, "We couldn't open that CV. Please try again.");

  if (!data) {
    throw new ResumeError("That CV no longer exists, or it isn't yours.");
  }

  return {
    ...(data as ResumeRecord),
    data: normalizeResumeContent((data as { data: unknown }).data),
  };
}

/* ------------------------------------------------------------------ *
 * CREATE
 * ------------------------------------------------------------------ */

export async function createResume(
  title: string,
  content: ResumeContent
): Promise<ResumeRecord> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: resolveResumeTitle(title, content.form),
      data: content,
    })
    .select()
    .single();

  if (error) throw friendly(error, "We couldn't save your CV. Please try again.");

  return data as ResumeRecord;
}

/* ------------------------------------------------------------------ *
 * UPDATE (content + title of an existing record)
 * ------------------------------------------------------------------ */

export async function updateResume(
  id: string,
  title: string,
  content: ResumeContent
): Promise<ResumeRecord> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("resumes")
    .update({
      title: resolveResumeTitle(title, content.form),
      data: content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) throw friendly(error, "We couldn't save your changes. Please try again.");

  if (!data) {
    throw new ResumeError(
      "We couldn't find that CV to update. It may have been deleted."
    );
  }

  return data as ResumeRecord;
}

/* ------------------------------------------------------------------ *
 * SAVE (insert when new, update when existing - never duplicates)
 * ------------------------------------------------------------------ */

export async function saveResume(
  id: string | null,
  title: string,
  content: ResumeContent
): Promise<ResumeRecord> {
  return id
    ? updateResume(id, title, content)
    : createResume(title, content);
}

/* ------------------------------------------------------------------ *
 * RENAME (title only - content untouched)
 * ------------------------------------------------------------------ */

export async function renameResume(
  id: string,
  title: string
): Promise<ResumeSummary> {
  const user = await requireUser();

  const trimmed = title.trim();
  if (!trimmed) {
    throw new ResumeError("Please enter a name for this CV.");
  }

  const { data, error } = await supabase
    .from("resumes")
    .update({ title: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, title, created_at, updated_at")
    .maybeSingle();

  if (error) throw friendly(error, "We couldn't rename that CV. Please try again.");

  if (!data) {
    throw new ResumeError("We couldn't find that CV. It may have been deleted.");
  }

  return data as ResumeSummary;
}

/* ------------------------------------------------------------------ *
 * DELETE
 * ------------------------------------------------------------------ */

export async function deleteResume(id: string): Promise<void> {
  const user = await requireUser();

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw friendly(error, "We couldn't delete that CV. Please try again.");
}

/* Message helper for UI code. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ResumeError) return error.message;
  console.error(error);
  return fallback;
}
