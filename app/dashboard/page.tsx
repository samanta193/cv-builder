"use client";

import Link from "next/link";
import ResumesSection from "@/app/components/ResumesSection";
import AppNav from "@/app/components/AppNav";
import { useAuthUser } from "@/lib/useAuthUser";

export default function DashboardPage() {
  const { user, loading } = useAuthUser();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] || "";

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppNav />

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">Loading your dashboard...</p>
          </div>
        </section>
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

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="font-semibold text-cyan-500">DASHBOARD</p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your saved CVs and continue editing them.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/builder"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl">
              ✦
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Create a new CV
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start a fresh CV with the AI-powered builder.
            </p>
          </Link>

          <Link
            href="/my-resumes"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl">
              📁
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">My CVs</h2>

            <p className="mt-2 text-sm text-slate-500">
              Edit, download, rename or delete your saved CVs.
            </p>
          </Link>
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-cyan-500">MY CVs</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Recent CVs
              </h2>
            </div>

            <Link
              href="/my-resumes"
              className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              View all →
            </Link>
          </div>

          <ResumesSection limit={3} showViewAll />
        </div>
      </section>
    </main>
  );
}
