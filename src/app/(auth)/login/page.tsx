"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginWithEmail, resendSignupVerification } from "@/api/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import {
  LightBeamButton,
  type LightBeamButtonStatus,
} from "@/components/theme/brass-button";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";

function errorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { code: "", message: "" };
  }

  return {
    code:
      "code" in error && typeof error.code === "string"
        ? error.code.toLowerCase()
        : "",
    message: error.message.toLowerCase(),
  };
}

function isRateLimitError(error: unknown) {
  const { code, message } = errorDetails(error);
  return (
    code.includes("rate_limit") ||
    code.includes("too_many") ||
    code.includes("over_request") ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("security purposes")
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [submitStatus, setSubmitStatus] =
    useState<LightBeamButtonStatus>("idle");
  const submitLock = useRef(false);
  const resendLock = useRef(false);

  const [rememberCredentials, setRememberCredentials] = useState(true);
  const [hasCachedCredentials, setHasCachedCredentials] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Restore cached credentials on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("eleczza_cached_credentials");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.email) {
          setValue("email", parsed.email, { shouldValidate: true });
        }
        if (parsed?.password) {
          setValue("password", parsed.password);
        }
        queueMicrotask(() => {
          setHasCachedCredentials(true);
        });
      }
    } catch (e) {
      console.warn("Unable to read cached credentials:", e);
    }
  }, [setValue]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      toast.success("Email verified. You can now log in.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("error") === "invalid_link") {
      toast.error(
        "This verification link is invalid or expired. Request a new link and try again.",
      );
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timeout = window.setTimeout(
      () => setResendCooldown((remaining) => remaining - 1),
      1000,
    );
    return () => window.clearTimeout(timeout);
  }, [resendCooldown]);

  const onSubmit = async (data: LoginInput) => {
    setFormError("");
    setUnverifiedEmail("");
    setSubmitStatus("loading");

    try {
      await loginWithEmail(data);

      // Cache credentials in localhost as requested
      if (rememberCredentials) {
        try {
          localStorage.setItem(
            "eleczza_cached_credentials",
            JSON.stringify({
              email: data.email,
              password: data.password,
              savedAt: new Date().toISOString(),
            }),
          );
          setHasCachedCredentials(true);
        } catch (e) {
          console.warn("Could not cache credentials:", e);
        }
      } else {
        localStorage.removeItem("eleczza_cached_credentials");
        setHasCachedCredentials(false);
      }

      setSubmitStatus("success");
      toast.success("Welcome back.");

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/transition";
      router.replace(destination);
    } catch (error) {
      const { code, message } = errorDetails(error);
      if (
        code === "email_not_confirmed" ||
        message.includes("email not confirmed")
      ) {
        setUnverifiedEmail(data.email);
        setFormError(
          "Please verify your email before logging in. You can request a new verification link below.",
        );
      } else if (isRateLimitError(error)) {
        setFormError("Too many attempts. Please wait a moment and try again.");
      } else if (
        message.includes("fetch") ||
        message.includes("network") ||
        message.includes("failed to connect")
      ) {
        setFormError(
          "We couldn't reach the login service. Check your connection and try again.",
        );
      } else {
        setFormError("Invalid email or password.");
      }
      setSubmitStatus("failure");
    }
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (submitLock.current) {
      event.preventDefault();
      return;
    }
    submitLock.current = true;

    try {
      await handleSubmit(onSubmit)(event);
    } finally {
      submitLock.current = false;
    }
  };

  const onResendVerification = async () => {
    if (resendLock.current || resendCooldown > 0) return;
    resendLock.current = true;
    setIsResending(true);
    setResendMessage("");

    try {
      await resendSignupVerification(unverifiedEmail);
      setResendCooldown(60);
      setResendMessage("A verification link is on its way.");
    } catch (error) {
      setResendMessage(
        isRateLimitError(error)
          ? "Too many attempts. Please wait a minute before trying again."
          : "We couldn't resend the verification email. Please try again.",
      );
      if (isRateLimitError(error)) setResendCooldown(60);
    } finally {
      resendLock.current = false;
      setIsResending(false);
    }
  };

  return (
    <AuthCard
      title="Inspector Identification"
      subtitle="Present your credentials to access the 221B Case Archives."
    >
      <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
        <DomainNotice />

        <div>
          <label
            htmlFor="email"
            className="block font-archival text-[10px] font-bold tracking-[0.18em] text-parchment/80 uppercase"
          >
            College Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="detective@aot.edu.in"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-1.5 w-full rounded-sm border border-[#3a2e24] bg-[#120c08] px-3.5 py-2.5 font-serif text-sm text-parchment placeholder:text-parchment/35 focus:border-amber focus:ring-1 focus:ring-amber/40 focus:outline-none transition-colors"
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="animate-[auth-error-shake_0.28s_ease-in-out] mt-1 text-xs text-wax-foreground"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block font-archival text-[10px] font-bold tracking-[0.18em] text-parchment/80 uppercase"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-serif text-xs text-amber/80 hover:text-amber hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full rounded-sm border border-[#3a2e24] bg-[#120c08] px-3.5 py-2.5 pr-11 font-serif text-sm text-parchment placeholder:text-parchment/35 focus:border-amber focus:ring-1 focus:ring-amber/40 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-parchment/60 transition-colors hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="animate-[auth-error-shake_0.28s_ease-in-out] mt-1 text-xs text-wax-foreground"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Cache credentials in localhost */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberCredentials}
              onChange={(e) => setRememberCredentials(e.target.checked)}
              className="h-3.5 w-3.5 rounded-sm border border-[#3a2e24] bg-[#120c08] accent-amber focus:ring-1 focus:ring-amber"
            />
            <span className="font-serif text-xs text-parchment/75">
              Remember credentials on this terminal
            </span>
          </label>
          {hasCachedCredentials && (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("eleczza_cached_credentials");
                setValue("email", "");
                setValue("password", "");
                setHasCachedCredentials(false);
                toast.info("Cached credentials purged.");
              }}
              className="font-mono text-[9px] uppercase tracking-wider text-parchment/40 transition-colors hover:text-wax-foreground"
            >
              Clear Cache
            </button>
          )}
        </div>

        {formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="space-y-2 rounded-sm border border-wax-foreground/30 bg-wax/40 px-3 py-2 text-sm text-wax-foreground"
          >
            <p>{formError}</p>
            {unverifiedEmail && (
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isResending || resendCooldown > 0}
                  onClick={onResendVerification}
                >
                  {isResending
                    ? "Sending..."
                    : resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : "Resend verification email"}
                </Button>
                {resendMessage && (
                  <p role="status" className="text-xs text-parchment">
                    {resendMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <LightBeamButton
          type="submit"
          status={isSubmitting ? "loading" : submitStatus}
        >
          {isSubmitting ? "Signing in..." : "Log in"}
        </LightBeamButton>

        <div className="text-center font-serif text-xs text-parchment/75">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-amber hover:underline"
          >
            Create account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
