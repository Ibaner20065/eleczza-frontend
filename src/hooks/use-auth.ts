"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem("eleczza_local_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLocalDev =
      !supabaseUrl ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("xyzcompany");
    return !isLocalDev;
  });

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLocalDev =
      !supabaseUrl ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("xyzcompany");

    if (isLocalDev) {
      return;
    }

    void Promise.resolve()
      .then(async () => {
        const supabase = createClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!active) return;
          setUser(session?.user ?? null);
          setLoading(false);
        });
        unsubscribe = () => subscription.unsubscribe();
        return supabase.auth.getSession();
      })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Unable to restore the current auth session:", error);
          setUser(null);
        } else {
          setUser(data.session?.user ?? null);
        }
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Unable to initialize or restore Supabase auth:", error);
        // Fallback to local cached user if present
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("eleczza_local_user");
          if (cached) {
            try {
              setUser(JSON.parse(cached));
            } catch {}
          }
        }
        setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eleczza_local_user");
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (
      !supabaseUrl ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("xyzcompany")
    ) {
      setUser(null);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider.");
  }
  return context;
}

export function useAuth() {
  const { user, loading, signOut } = useUser();
  const configuredDomain =
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN?.trim() || "@aot.edu.in";
  const allowedDomain = configuredDomain.startsWith("@")
    ? configuredDomain
    : `@${configuredDomain}`;
  const isAllowedDomain =
    user?.email?.toLowerCase().endsWith(allowedDomain.toLowerCase()) ?? false;

  return { user, loading, signOut, isAllowedDomain, allowedDomain };
}
