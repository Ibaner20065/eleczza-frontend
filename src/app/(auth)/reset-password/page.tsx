"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validators/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    console.log("Setting new passphrase:", data);
  };

  return (
    <AuthCard
      title="Seal New Passphrase"
      subtitle="Establish a new secure passphrase for your inspector dossier."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            New Passphrase
          </label>
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

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            Confirm New Passphrase
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-[#9E2A2B]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-[#DFB75A] font-semibold text-[#0B0C10] hover:bg-[#C59B27]"
        >
          {isSubmitting ? "Sealing Passphrase..." : "Affix New Seal"}
        </Button>

        <div className="text-center text-xs text-[#D9CEB8]">
          <Link
            href="/login"
            className="font-semibold text-[#DFB75A] hover:underline"
          >
            Back to Inspector Identification
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
