"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/*
  Landing page for the password-reset email link.
  Supabase signs the user in with a recovery session when they arrive
  from the email, so we only need to set the new password here.
*/

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated. Taking you to your dashboard...");
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1200);
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";

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
              Set a new password
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Choose a new password for your account.
            </p>
          </div>

          {!ready ? (
            <p className="mt-8 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
              Open this page from the reset link in your email. If the link
              has expired, request a new one from the{" "}
              <Link href="/login" className="font-semibold text-cyan-600">
                login page
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Type it again"
                  required
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="sheen w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
