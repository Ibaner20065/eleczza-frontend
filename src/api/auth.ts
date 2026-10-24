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
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw error;
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
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
