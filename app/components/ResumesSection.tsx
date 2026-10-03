"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResumePreview } from "@/app/builder/templates";
import { generateResumePdf } from "@/lib/pdf";
import {
  deleteResume,
  errorMessage,
  getResume,
  listResumes,
  renameResume,
} from "@/lib/resumes";
import type { ResumeContent, ResumeSummary } from "@/lib/resume-types";

/* ------------------------------------------------------------------ *
 * RESUMES SECTION
 *
 * The saved-CV list used by BOTH /dashboard and /my-resumes, so there
 * is a single implementation of edit / download / rename / delete.
 * `limit` lets the dashboard show only the most recent few.
 * ------------------------------------------------------------------ */

type PdfJob = {
  fileName: string;
  content: ResumeContent;
};

export default function ResumesSection({
  limit,
  showViewAll = false,
}: {
  limit?: number;
  showViewAll?: boolean;
}) {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [renameTarget, setRenameTarget] = useState<ResumeSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<ResumeSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [pdfJob, setPdfJob] = useState<PdfJob | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setResumes(await listResumes());
    } catch (caught) {
      setError(errorMessage(caught, "We couldn't load your CVs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch of the user's saved CVs
    load();
  }, [load]);

  /* Auto-dismiss the success toast. */
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  /* ---------------------------------------------------------------- *
   * DOWNLOAD PDF
   *
   * Fetch the saved CV, render it off-screen with the SAME template
   * components the builder uses, then run the existing PDF pipeline.
   * ---------------------------------------------------------------- */

  const handleDownload = async (resume: ResumeSummary) => {
    setError("");
    setDownloadingId(resume.id);

    try {
      const record = await getResume(resume.id);
      setPdfJob({
        fileName: record.title || "resume",
        content: record.data,
      });
    } catch (caught) {
      setError(errorMessage(caught, "We couldn't prepare that PDF."));
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    if (!pdfJob) return;

    let cancelled = false;

    /* Two frames so the off-screen preview is fully painted. */
    const run = async () => {
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      if (cancelled || !pdfRef.current) return;

      try {
        await generateResumePdf(pdfRef.current, pdfJob.fileName);
      } catch (caught) {
        console.error(caught);
        setError("We couldn't generate the PDF. Please try again.");
      } finally {
        if (!cancelled) {
          setPdfJob(null);
          setDownloadingId(null);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pdfJob]);

  /* ---------------------------------------------------------------- *
   * RENAME
   * ---------------------------------------------------------------- */

  const openRename = (resume: ResumeSummary) => {
    setRenameTarget(resume);
    setRenameValue(resume.title);
    setRenameError("");
  };

  const submitRename = async () => {
    if (!renameTarget) return;

    setRenaming(true);
    setRenameError("");

    try {
      const updated = await renameResume(renameTarget.id, renameValue);

      setResumes((previous) =>
        previous.map((item) =>
          item.id === updated.id
            ? { ...item, title: updated.title, updated_at: updated.updated_at }
            : item
        )
      );

      setRenameTarget(null);
      setNotice("CV renamed successfully.");
    } catch (caught) {
      setRenameError(errorMessage(caught, "We couldn't rename that CV."));
    } finally {
      setRenaming(false);
    }
  };

  /* ---------------------------------------------------------------- *
   * DELETE
   * ---------------------------------------------------------------- */

  const submitDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteResume(deleteTarget.id);

      setResumes((previous) =>
        previous.filter((item) => item.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
      setNotice("CV deleted.");
    } catch (caught) {
      setDeleteError(errorMessage(caught, "We couldn't delete that CV."));
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------------------------------------------------------- *
   * RENDER
   * ---------------------------------------------------------------- */

  const visible =
    typeof limit === "number" ? resumes.slice(0, limit) : resumes;

  return (
    <div>
      {notice && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          <span>{error}</span>

          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-100" />
              <div className="mt-5 h-5 w-2/3 rounded bg-slate-100" />
              <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
              <div className="mt-6 h-11 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && resumes.length === 0 && !error && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
            📄
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-950">
            You haven&apos;t created a CV yet.
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Build your first professional CV in a few minutes.
          </p>

          <Link
            href="/builder"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Create Your First CV
          </Link>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((resume) => (
            <div
              key={resume.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl">
                  📄
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Resume
                </span>
              </div>

              <h2 className="mt-5 truncate text-lg font-bold text-slate-950">
                {resume.title || "Untitled Resume"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Last updated{" "}
                {new Date(resume.updated_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/builder?id=${resume.id}`}
                  className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDownload(resume)}
                  disabled={downloadingId === resume.id}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloadingId === resume.id
                    ? "Preparing..."
                    : "Download PDF"}
                </button>
              </div>

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => openRename(resume)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-cyan-400 hover:bg-cyan-50"
                >
                  Rename
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteTarget(resume);
                    setDeleteError("");
                  }}
                  className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showViewAll && !loading && resumes.length > visible.length && (
        <div className="mt-8 text-center">
          <Link
            href="/my-resumes"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50"
          >
            View all {resumes.length} CVs
          </Link>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-950">Rename CV</h2>

            <p className="mt-2 text-sm text-slate-500">
              Only the name changes. Your CV content stays exactly as it is.
            </p>

            <input
              type="text"
              value={renameValue}
              autoFocus
              onChange={(event) => setRenameValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitRename();
              }}
              placeholder="Software Engineer CV"
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />

            {renameError && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {renameError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitRename}
                disabled={renaming}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {renaming ? "Saving..." : "Save Name"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-950">
              Are you sure you want to delete this CV?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {deleteTarget.title || "Untitled Resume"}
              </span>{" "}
              will be permanently removed. This cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFF-SCREEN RENDER TARGET FOR PDF DOWNLOADS */}
      {pdfJob && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            top: 0,
            left: "-10000px",
            width: "794px",
            pointerEvents: "none",
          }}
        >
          <div ref={pdfRef}>
            <ResumePreview content={pdfJob.content} />
          </div>
        </div>
      )}
    </div>
  );
}
