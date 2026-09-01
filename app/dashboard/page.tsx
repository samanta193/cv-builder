"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Resume = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setResumes(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-cyan-500">CV</span>Builder
          </Link>

          <Link
            href="/builder"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Create New Resume
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="font-semibold text-cyan-500">
            MY RESUMES
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Your Resumes
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your saved resumes and continue editing them.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center">
            <p className="text-slate-500">
              Loading your resumes...
            </p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No resumes yet
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first professional resume.
            </p>

            <Link
              href="/builder"
              className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl">
                  📄
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  {resume.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Last updated{" "}
                  {new Date(resume.updated_at).toLocaleDateString()}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/builder?id=${resume.id}`}
                    className="block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Edit Resume
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}