import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

function safeNextPath(value: string | null) {
  return value === "/reset-password" || value === "/login?verified=1"
    ? value
    : "/login";
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  const nextPath = safeNextPath(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const supabase = await createClient();

  let error: Error | null = null;

  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else if (tokenHash && (type === "signup" || type === "recovery")) {
    const result = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    error = result.error;
  } else {
    error = new Error(
      "The authentication link is missing its verification code.",
    );
  }

  if (error) {
    const errorPath =
      nextPath === "/reset-password"
        ? "/reset-password?error=invalid_link"
        : "/login?error=invalid_link";
    return NextResponse.redirect(new URL(errorPath, request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
