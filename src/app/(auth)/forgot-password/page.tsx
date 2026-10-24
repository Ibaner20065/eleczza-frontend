"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    console.log("Requesting dispatch telegram for:", data);
  };

  return (
    <AuthCard
      title="Lost Credentials"
      subtitle="Dispatch a secure telegram to reset your detective passphrase."
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-[#DFB75A] font-semibold text-[#0B0C10] hover:bg-[#C59B27]"
        >
          {isSubmitting ? "Dispatching Telegram..." : "Send Recovery Dispatch"}
        </Button>

        <div className="text-center text-xs text-[#D9CEB8]">
          Remembered your passphrase?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#DFB75A] hover:underline"
          >
            Return to Bureau
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
