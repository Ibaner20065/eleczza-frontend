"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { DomainNotice } from "@/components/auth/domain-notice";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    console.log("Submitting enrollment dossier:", data);
  };

  return (
    <AuthCard
      title="Detective Enlistment"
      subtitle="Register your credentials with Scotland Yard to join an agency."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DomainNotice />

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            Full Name / Operative Alias
          </label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Sherlock Holmes"
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-[#9E2A2B]">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            College Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="roll.number@aot.edu.in"
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#9E2A2B]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            College Roll Number
          </label>
          <input
            {...register("rollNumber")}
            type="text"
            placeholder="12300121000"
            className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
          />
          {errors.rollNumber && (
            <p className="mt-1 text-xs text-[#9E2A2B]">
              {errors.rollNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
            Passphrase
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
            Confirm Passphrase
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
          {isSubmitting ? "Enlisting..." : "Complete Enlistment"}
        </Button>

        <div className="text-center text-xs text-[#D9CEB8]">
          Already hold an official badge?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#DFB75A] hover:underline"
          >
            Identify Here
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
