"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { resendSignupVerification, signupWithEmail } from "@/api/auth";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";
import { passwordRequirements } from "@/lib/password-strength";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import {
  LightBeamButton,
  type LightBeamButtonStatus,
} from "@/components/theme/brass-button";
import { Button } from "@/components/ui/button";

function getAuthErrorMessage(error: unknown, action: "signup" | "resend") {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already exists")
  ) {
    return "This email already has an account. Log in or reset your password instead.";
  }

  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Too many attempts. Please wait a minute before trying again.";
  }

  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("failed to connect")
  ) {
    return "We couldn't reach the registration service. Check your connection and try again.";
  }

  if (
    message.includes("domain") ||
    (message.includes("email") &&
      (message.includes("not allowed") ||
        message.includes("not authorized") ||
        message.includes("unauthorized")))
  ) {
    return "Please use an email address from your college domain.";
  }

  return action === "signup"
    ? "We couldn't create your account right now. Please try again."
    : "We couldn't resend the verification email. Please try again.";
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [submitStatus, setSubmitStatus] =
    useState<LightBeamButtonStatus>("idle");
  const submitLock = useRef(false);
  const resendLock = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
    defaultValue: "",
  });
  const strength = passwordRequirements.filter(({ test }) =>
    test(password),
  ).length;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timeout = window.setTimeout(
      () => setResendCooldown((remaining) => remaining - 1),
      1000,
    );
    return () => window.clearTimeout(timeout);
  }, [resendCooldown]);

  useEffect(() => {
    if (confirmPassword) void trigger("confirmPassword");
  }, [confirmPassword, password, trigger]);

  const onSubmit = async (data: SignupInput) => {
    setFormError("");
    setSubmitStatus("loading");

    try {
      const { user } = await signupWithEmail(data);

      if (!user) {
        setSubmitStatus("failure");
        setFormError(
          "We couldn't confirm your account request. Please try again.",
        );
        return;
      }

      if (user.identities?.length === 0) {
        setSubmitStatus("failure");
        setFormError(
          "This email already has an account. Log in or reset your password instead.",
        );
        return;
      }

      setSubmitStatus("success");
      setRegisteredEmail(data.email);
    } catch (error) {
      setSubmitStatus("failure");
      setFormError(getAuthErrorMessage(error, "signup"));
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
      await resendSignupVerification(registeredEmail);
      setResendCooldown(60);
      setResendMessage("A new verification link is on its way.");
    } catch (error) {
      const message = getAuthErrorMessage(error, "resend");
      setResendMessage(message);
      if (message.includes("wait a minute")) setResendCooldown(60);
    } finally {
      resendLock.current = false;
      setIsResending(false);
    }
  };

  return (
    <AuthCard
      title="Detective Enlistment"
      subtitle="Register your credentials with Scotland Yard to join an agency."
    >
      {registeredEmail ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber/50 bg-amber/10 text-amber">
            <MailCheck aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-parchment">
              Check your inbox to verify
            </h2>
            <p className="mt-2 text-sm text-parchment">
              We sent a verification link to{" "}
              <span className="font-semibold text-parchment">
                {registeredEmail}
              </span>
              . Follow the link to activate your account.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              disabled={isResending || resendCooldown > 0}
              onClick={onResendVerification}
              className="w-full"
            >
              {isResending
                ? "Sending verification link..."
                : resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : "Resend verification email"}
            </Button>
            {resendMessage && (
              <p
                role="status"
                className="text-xs text-parchment"
                aria-live="polite"
              >
                {resendMessage}
              </p>
            )}
          </div>
          <p className="text-xs text-parchment">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-amber hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
          <DomainNotice />

          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold tracking-wider text-parchment uppercase"
            >
              Name
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Sherlock Holmes"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="mt-1 w-full rounded border border-fog bg-umber px-3 py-2 text-sm text-parchment placeholder-muted-foreground focus:border-amber focus:outline-none"
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="animate-[auth-error-shake_0.28s_ease-in-out] mt-1 text-xs text-wax-foreground"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wider text-parchment uppercase"
            >
              College Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="roll.number@aot.edu.in"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="mt-1 w-full rounded border border-fog bg-umber px-3 py-2 text-sm text-parchment placeholder-muted-foreground focus:border-amber focus:outline-none"
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
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wider text-parchment uppercase"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? password
                      ? "password-error password-strength"
                      : "password-error"
                    : password
                      ? "password-strength"
                      : undefined
                }
                className="w-full rounded border border-fog bg-umber px-3 py-2 pr-11 text-sm text-parchment placeholder-muted-foreground focus:border-amber focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-parchment transition-colors hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Eye aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <div
                id="password-strength"
                className="mt-2"
                role="meter"
                aria-label="Password strength"
                aria-valuemin={0}
                aria-valuemax={passwordRequirements.length}
                aria-valuenow={strength}
              >
                <div className="flex gap-1" aria-hidden="true">
                  {passwordRequirements.map(({ label }, index) => (
                    <span
                      key={label}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        index < strength
                          ? strength >= 4
                            ? "bg-amber"
                            : strength >= 2
                              ? "bg-amber"
                              : "bg-wax-foreground"
                          : "bg-fog"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {strength === passwordRequirements.length
                    ? "Strong password"
                    : `${strength} of ${passwordRequirements.length} requirements met`}
                </p>
              </div>
            )}
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold tracking-wider text-parchment uppercase"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password again"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                className="w-full rounded border border-fog bg-umber px-3 py-2 pr-11 text-sm text-parchment placeholder-muted-foreground focus:border-amber focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-parchment transition-colors hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Eye aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                role="alert"
                className="animate-[auth-error-shake_0.28s_ease-in-out] mt-1 text-xs text-wax-foreground"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {formError && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded border border-wax-foreground/30 bg-wax/40 px-3 py-2 text-sm text-wax-foreground"
            >
              {formError}
            </p>
          )}

          <LightBeamButton
            type="submit"
            status={isSubmitting ? "loading" : submitStatus}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </LightBeamButton>

          <div className="text-center text-xs text-parchment">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-amber hover:underline"
            >
              Log in
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
