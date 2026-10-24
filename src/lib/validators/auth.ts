import { z } from "zod";

const ALLOWED_DOMAIN =
  process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

export const collegeEmailSchema = z
  .string()
  .email("Please provide a valid email address.")
  .refine(
    (email) => email.toLowerCase().endsWith(ALLOWED_DOMAIN.toLowerCase()),
    `Registration is strictly restricted to Academy of Technology students (${ALLOWED_DOMAIN}).`,
  );

export const loginSchema = z.object({
  email: collegeEmailSchema,
  password: z.string().min(6, "Password must contain at least 6 characters."),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Inspector name must be at least 2 characters."),
    email: collegeEmailSchema,
    rollNumber: z
      .string()
      .min(5, "Valid college roll / registration number is required."),
    password: z.string().min(6, "Password must contain at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Deduction mismatch: Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: collegeEmailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must contain at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Deduction mismatch: Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
