"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/api/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import {
  LightBeamButton,
  type LightBeamButtonStatus,
} from "@/components/theme/brass-button";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/auth";

function isRateLimitError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("security purposes") ||
    message.includes("over_request_rate_limit")
  );
}

export default function ForgotPasswordPage() {
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitStatus, setSubmitStatus] =
    useState<LightBeamButtonStatus>("idle");
  const submitLock = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setFormError("");
    setSubmitStatus("loading");

    try {
      await requestPasswordReset(data);
      setSubmitStatus("success");
      setConfirmationShown(true);
    } catch (error) {
      setSubmitStatus("failure");
      setFormError(
        isRateLimitError(error)
          ? "Too many attempts. Please wait a moment before trying again."
          : error instanceof Error &&
              (error.message.toLowerCase().includes("fetch") ||
                error.message.toLowerCase().includes("network"))
            ? "We couldn't reach the recovery service. Check your connection and try again."
            : "We couldn't process that request right now. Please try again.",
      );
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

  return (
    <AuthCard
      title="Reset Your Password"
      subtitle="We’ll send a secure recovery link to your college email."
    >
      {confirmationShown ? (
        <div className="space-y-5 text-center" role="status" aria-live="polite">
          <p className="text-sm leading-relaxed text-parchment">
            If this email exists, a link has been sent. Check your inbox for
            instructions to reset your password.
          </p>
          <Link
            href="/login"
            className="inline-flex text-sm font-semibold text-amber hover:underline"
          >
            Return to log in
          </Link>
        </div>
      ) : (
        <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
          <DomainNotice />

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
              placeholder="detective@aot.edu.in"
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
            {isSubmitting ? "Sending recovery link..." : "Send recovery link"}
          </LightBeamButton>

          <div className="text-center text-xs text-parchment">
            Remember your password?{" "}
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
