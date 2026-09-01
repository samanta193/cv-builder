
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/builder");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div className="aurora-a pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="aurora-b pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="hero-in relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-[1.5px] shadow-2xl backdrop-blur">
        <div className="rounded-[calc(1.5rem-1.5px)] bg-white p-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-cyan-500">CV</span>Builder
            </Link>

            <h1 className="mt-6 text-3xl font-bold text-slate-950">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Log in to continue building your professional resume.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="sheen w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Sign Up
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

