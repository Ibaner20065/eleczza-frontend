"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginWithEmail } from "@/api/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const submitLock = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

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

  const onSubmit = async (data: LoginInput) => {
    setFormError("");

    try {
      await loginWithEmail(data);
      toast.success("Welcome back.");

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/dashboard";
      router.replace(destination);
    } catch {
      setFormError("Unable to sign in. Check your details or try again.");
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
      title="Inspector Identification"
      subtitle="Present your credentials to access the 221B Case Archives."
    >
      <form
        onSubmit={onFormSubmit}
        className="space-y-3"
        aria-label="Log in"
        noValidate
      >
        <DomainNotice />

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase"
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
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#8892B0] focus-visible:border-[#F3D88C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C]"
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1 text-xs text-[#FF9B9F]"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="rounded text-xs text-[#F3D88C] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 pr-11 text-sm text-[#F7F2E7] placeholder-[#8892B0] focus-visible:border-[#F3D88C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#D9CEB8] transition-colors hover:text-[#DFB75A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DFB75A]"
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
              className="mt-1 text-xs text-[#FF9B9F]"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="space-y-2 rounded border border-[#C93B41]/30 bg-[#3D0B0E]/40 px-3 py-2 text-sm text-[#FFB3B6]"
          >
            <p>{formError}</p>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in..." : "Log in"}
        </Button>

        <div className="text-center text-xs text-[#D9CEB8]">
          New here?{" "}
          <Link
            href="/signup"
            className="rounded font-semibold text-[#F3D88C] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C]"
          >
            Create account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
