"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { updatePassword } from "@/api/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { passwordRequirements } from "@/lib/password-strength";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validators/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const submitLock = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
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
    let isCurrent = true;

    const checkRecoverySession = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isCurrent) setHasRecoverySession(Boolean(data.session));
      } catch {
        if (isCurrent) {
          setFormError(
            "We couldn't verify this recovery link. Request a new password reset link and try again.",
          );
        }
      } finally {
        if (isCurrent) setIsCheckingSession(false);
      }
    };

    void checkRecoverySession();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (confirmPassword) void trigger("confirmPassword");
  }, [confirmPassword, password, trigger]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setFormError("");

    try {
      await updatePassword(data.password);
      toast.success("Password updated. Log in with your new password.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      setFormError(
        message.includes("fetch") || message.includes("network")
          ? "We couldn't reach the password service. Check your connection and try again."
          : "We couldn't update your password. Your recovery link may have expired; request a new one and try again.",
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
      title="Choose a New Password"
      subtitle="Create a strong password to secure your inspector account."
    >
      {isCheckingSession ? (
        <p className="py-4 text-center text-sm text-parchment" role="status">
          Verifying your recovery link...
        </p>
      ) : hasRecoverySession ? (
        <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wider text-parchment uppercase"
            >
              New Password
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
              Confirm New Password
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating password..." : "Update password"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber/40 bg-amber/10 text-amber">
            <KeyRound aria-hidden="true" className="h-5 w-5" />
          </div>
          <p className="text-sm leading-relaxed text-parchment" role="alert">
            {formError ||
              "This recovery link is invalid or expired. Request a new password reset link to continue."}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-amber hover:underline"
            >
              Request a new recovery link
            </Link>
            <Link
              href="/login"
              className="text-xs text-parchment hover:text-amber"
            >
              Return to log in
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
