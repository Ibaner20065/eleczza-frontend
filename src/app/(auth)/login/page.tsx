"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    // Phase 1 scaffold - log or wire to api
    console.log("Submitting login credentials:", data);
  };

  return (
    <AuthCard
      title="Inspector Identification"
      subtitle="Present your credentials to access the 221B Case Archives."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DomainNotice />

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            College Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="detective@aot.edu.in"
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#9E2A2B]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
              Secret Passphrase
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#DFB75A] hover:underline"
            >
              Lost Passphrase?
            </Link>
          </div>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-[#9E2A2B]">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-[#DFB75A] font-semibold text-[#0B0C10] hover:bg-[#C59B27]"
        >
          {isSubmitting ? "Verifying Seals..." : "Authenticate"}
        </Button>

        <div className="text-center text-xs text-[#D9CEB8]">
          Not yet sworn into the Agency?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#DFB75A] hover:underline"
          >
            Enlist Here
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
