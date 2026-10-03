"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ *
 * useAuthUser
 *
 * Returns the signed-in user and a loading flag. When `redirect` is
 * true (the default for protected pages) an unauthenticated visitor is
 * sent to /login, and a user who logs out while the page is open is
 * sent there too, so protected data is never left on screen.
 * ------------------------------------------------------------------ */

export function useAuthUser(redirect = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;

      setUser(data.user ?? null);
      setLoading(false);

      if (!data.user && redirect) {
        router.replace("/login");
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;

        setUser(session?.user ?? null);

        if (!session?.user && redirect) {
          router.replace("/login");
        }
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [redirect, router]);

  return { user, loading };
}

/* Ends the session. Callers navigate afterwards; the onAuthStateChange
   listener above also pushes any open protected page back to /login. */
export async function signOut() {
  await supabase.auth.signOut();
}
