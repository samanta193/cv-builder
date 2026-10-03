"use client";

import Link from "next/link";
import ResumesSection from "@/app/components/ResumesSection";
import AppNav from "@/app/components/AppNav";
import { useAuthUser } from "@/lib/useAuthUser";

export default function MyResumesPage() {
  const { user, loading } = useAuthUser();

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppNav />

        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">Loading your CVs...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNav
        user={user}
        right={
          <Link
            href="/builder"
            className="hidden rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
          >
            + Create New CV
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <p className="font-semibold text-cyan-500">MY CVs</p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Your Resumes
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage your saved CVs. Edit, download, rename or delete
            any of them.
          </p>
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/builder"
            className="inline-flex w-full justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create New CV
          </Link>
        </div>

        <ResumesSection />
      </div>
    </main>
  );
}
