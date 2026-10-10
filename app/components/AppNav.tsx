"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/lib/useAuthUser";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#templates", label: "Templates" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function AppNav({
  user,
  right,
}: {
  user?: User | null;
  right?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const email = user?.email ?? "";

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() || email;

  const handleSignOut = async () => {
    setSigningOut(true);

    await signOut();

    setMenuOpen(false);
    router.replace("/");
    router.refresh();
  };

  return (
   <header className="relative z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">

      {/* =========================================
          TOP-RIGHT DECORATIVE SHAPE
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-20
          hidden
          h-40
          w-72
          rounded-bl-[120px]
          rounded-br-[40px]
          rounded-tl-[40px]
          rounded-tr-[160px]
          bg-gradient-to-br
          from-sky-100
          to-emerald-50
          lg:block
        "
      />

      {/* =========================================
    NAVIGATION
========================================== */}


  <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">

    {/* =======================================
        LOGO
    ======================================== */}

    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5"
    >
      {/* Logo symbol */}
      <div className="relative h-10 w-10">

        {/* Blue circle */}
        <div className="absolute left-0 top-0 h-9 w-9 rounded-full bg-sky-400 transition-transform duration-300 group-hover:scale-105" />

        {/* Green lower shape */}
        <div className="absolute bottom-0 left-1 h-4.5 w-7 rounded-bl-full rounded-br-full bg-emerald-300" />

        {/* Document */}
        <div className="absolute left-[7px] top-[7px] z-10 flex h-6 w-5 flex-col justify-center gap-[3px] rounded-[5px] bg-white px-1">
          <div className="h-[2px] w-full rounded-full bg-sky-400" />
          <div className="h-[2px] w-[70%] rounded-full bg-sky-400" />
          <div className="h-[2px] w-full rounded-full bg-sky-400" />
        </div>

        {/* Sparkle */}
        <div className="absolute -right-0.5 -top-0.5 z-20">
          <div className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-amber-300" />
        </div>
      </div>

      {/* Wordmark */}
      <span className="text-[24px] font-bold tracking-[-0.04em] text-[#19324a]">
        CVBuilder
      </span>
    </Link>


    {/* =======================================
        DESKTOP NAVIGATION
    ======================================== */}

    <nav className="hidden items-center gap-8 md:flex lg:gap-10">

      {LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative
              py-2
              text-[14px]
              font-medium
              transition-colors
              ${
                active
                  ? "text-[#19324a]"
                  : "text-slate-500 hover:text-[#19324a]"
              }
            `}
          >
            {link.label}

            {active && (
              <span className="absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-sky-400" />
            )}
          </Link>
        );
      })}

    </nav>


    {/* =======================================
        RIGHT SIDE
    ======================================== */}

    <div className="flex items-center gap-4 sm:gap-6">

      {right}

      {!user ? (
        <>
          {/* Log in */}
          <Link
            href="/login"
            className="
              hidden
              text-[14px]
              font-medium
              text-[#19324a]
              transition-colors
              hover:text-sky-500
              sm:block
            "
          >
            Log in
          </Link>

          {/* Get Started */}
          <Link
            href="/signup"
            className="
              rounded-full
              bg-sky-400
              px-6
              py-3
              text-[14px]
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(56,189,248,0.20)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-sky-500
              hover:shadow-[0_12px_25px_rgba(56,189,248,0.28)]
            "
          >
            Get Started
          </Link>
        </>
      ) : (

        /* =====================================
           SIGNED-IN ACCOUNT
        ====================================== */

        <div className="relative">

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-2.5
              py-1.5
              text-sm
              font-semibold
              text-[#19324a]
              transition
              hover:border-sky-300
              hover:bg-sky-50
            "
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
              {(displayName || "U").charAt(0).toUpperCase()}
            </span>

            <span className="hidden max-w-[10rem] truncate sm:inline">
              {displayName || "Account"}
            </span>

            <span className="text-xs text-slate-400">
              ▾
            </span>

          </button>


          {menuOpen && (
            <>
              {/* Overlay */}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />

              {/* Dropdown */}
              <div className="absolute right-0 z-20 mt-3 w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(25,50,74,0.14)]">

                <div className="rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold text-[#19324a]">
                    Account
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {email}
                  </p>
                </div>

                <div className="my-1 h-px bg-slate-100" />

                {/* Mobile navigation */}
                <div className="md:hidden">

                  {LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="
                        block
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-sky-50
                        hover:text-sky-500
                      "
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="my-1 h-px bg-slate-100" />

                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-sky-50
                    hover:text-sky-500
                  "
                >
                  Dashboard
                </Link>

                {/* My CVs */}
                <Link
                  href="/my-resumes"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-sky-50
                    hover:text-sky-500
                  "
                >
                  My CVs
                </Link>

                <div className="my-1 h-px bg-slate-100" />

                {/* Logout */}
                                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="
                    w-full
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-semibold
                    text-red-500
                    transition
                    hover:bg-red-50
                    disabled:opacity-60
                  "
                >
                  {signingOut ? "Logging out..." : "Log Out"}
                </button>

              </div>
            </>
          )}

        </div>
      )}

    </div>

  </div>
</header>
  );
}