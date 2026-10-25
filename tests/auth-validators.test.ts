import { describe, expect, it } from "vitest";
import {
  collegeEmailSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validators/auth";

describe("college email validator", () => {
  it("trims and accepts a valid college address", () => {
    expect(collegeEmailSchema.parse("  detective@aot.edu.in ")).toBe(
      "detective@aot.edu.in",
    );
  });

  it("rejects invalid email addresses and other domains", () => {
    expect(collegeEmailSchema.safeParse("not-an-email").success).toBe(false);
    expect(collegeEmailSchema.safeParse("detective@example.com").success).toBe(
      false,
    );
  });
});

describe("authentication form validators", () => {
  const credentials = {
    email: "detective@aot.edu.in",
    password: "Sleuth123!",
  };

  it("requires a password for login", () => {
    expect(
      loginSchema.safeParse({ ...credentials, password: "" }).success,
    ).toBe(false);
    expect(loginSchema.safeParse(credentials).success).toBe(true);
  });

  it("requires matching strong signup passwords", () => {
    expect(
      signupSchema.safeParse({
        name: "Sherlock Holmes",
        ...credentials,
        confirmPassword: "Sleuth123?",
      }).success,
    ).toBe(false);
    expect(
      signupSchema.safeParse({
        name: "Sherlock Holmes",
        ...credentials,
        confirmPassword: credentials.password,
      }).success,
    ).toBe(true);
  });

  it("validates reset and forgot-password input", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: credentials.email }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: credentials.password,
        confirmPassword: credentials.password,
      }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: credentials.password,
        confirmPassword: "Different123!",
      }).success,
    ).toBe(false);
  });
});
