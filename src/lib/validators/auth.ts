import { z } from "zod";

const configuredDomain =
  process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN?.trim() || "@aot.edu.in";
const ALLOWED_DOMAIN = configuredDomain.startsWith("@")
  ? configuredDomain
  : `@${configuredDomain}`;

export const collegeEmailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .refine(
    (email) => email.toLowerCase().endsWith(ALLOWED_DOMAIN.toLowerCase()),
    `Use your college email address ending in ${ALLOWED_DOMAIN}.`,
  );

export const loginSchema = z.object({
  email: collegeEmailSchema,
  password: z.string().min(6, "Password must contain at least 6 characters."),
});

export const passwordSchema = z
  .string()
  .min(
    8,
    "Use at least 8 characters, including uppercase, lowercase, a number, and a symbol.",
  )
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    "Use at least 8 characters, including uppercase, lowercase, a number, and a symbol.",
  );

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(60, "Name must be no more than 60 characters."),
    email: collegeEmailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: collegeEmailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
