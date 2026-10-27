import { createClient } from "@/lib/supabase/client";
import type {
  ForgotPasswordInput,
  LoginInput,
  SignupInput,
} from "@/lib/validators/auth";

function getAuthCallbackUrl(next: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const callbackUrl = new URL("/auth/callback", appUrl);
  callbackUrl.searchParams.set("next", next);
  return callbackUrl.toString();
}

export async function loginWithEmail(credentials: LoginInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isLocalDev =
    !supabaseUrl ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("xyzcompany");

  if (isLocalDev) {
    // Cache credentials and session in localhost
    if (typeof window !== "undefined") {
      const mockUser = {
        id:
          "local-detective-" +
          btoa(credentials.email)
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, 8),
        email: credentials.email,
        aud: "authenticated",
        role: "authenticated",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("eleczza_local_user", JSON.stringify(mockUser));
      localStorage.setItem(
        "eleczza_cached_credentials",
        JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          savedAt: new Date().toISOString(),
        }),
      );
      return {
        user: mockUser as unknown as import("@supabase/supabase-js").User,
        session: null,
      };
    }
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw error;
  }

  if (typeof window !== "undefined" && data.user) {
    localStorage.setItem("eleczza_local_user", JSON.stringify(data.user));
    localStorage.setItem(
      "eleczza_cached_credentials",
      JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        savedAt: new Date().toISOString(),
      }),
    );
  }

  return data;
}

export async function signupWithEmail(data: SignupInput) {
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/login?verified=1"),
      data: {
        full_name: data.name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return authData;
}

export async function resendSignupVerification(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/login?verified=1"),
    },
  });

  if (error) {
    throw error;
  }
}

export async function requestPasswordReset(data: ForgotPasswordInput) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: getAuthCallbackUrl("/reset-password"),
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword(password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw error;
  }

  const { error: signOutError } = await supabase.auth.signOut({
    scope: "local",
  });

  if (signOutError) {
    throw signOutError;
  }
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("eleczza_local_user");
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (
    !supabaseUrl ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("xyzcompany")
  ) {
    return;
  }
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
