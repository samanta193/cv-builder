"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";;

type Resume = {
  id: string;
  title: string;
  data: any;
  created_at: string;
  updated_at: string;
};

export default function MyResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading resumes:", error);
        return;
      }

      setResumes(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-cyan-500">CV</span>Builder
          </Link>

          <Link
            href="/builder"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create New Resume
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <p className="font-semibold text-cyan-500">MY RESUMES</p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Your Resumes
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage your saved resumes.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">Loading your resumes...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && resumes.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
              📄
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No resumes yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first professional resume to get started.
            </p>

            <Link
              href="/builder"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Create My Resume
            </Link>
          </div>
        )}

        {/* RESUME LIST */}
        {!loading && resumes.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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
                  {new Date(resume.updated_at).toLocaleDateString()}
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
  href={`/builder?id=${resume.id}`}
  className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
>
  Edit
</Link>
                  <button
                    type="button"
                    className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}