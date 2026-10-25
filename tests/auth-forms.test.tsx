import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";
import {
  loginWithEmail,
  requestPasswordReset,
  signupWithEmail,
} from "@/api/auth";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh: vi.fn() }),
}));

vi.mock("@/api/auth", () => ({
  loginWithEmail: vi.fn(),
  requestPasswordReset: vi.fn(),
  signupWithEmail: vi.fn(),
  resendSignupVerification: vi.fn(),
}));

describe("authentication forms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides labeled login controls and reports an account-neutral failure", async () => {
    const user = userEvent.setup();
    vi.mocked(loginWithEmail).mockRejectedValue(new Error("user not found"));
    render(<LoginPage />);

    expect(screen.getByRole("form", { name: "Log in" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("College Email"), "valid@aot.edu.in");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText(
        "Unable to sign in. Check your details or try again.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/user not found/i)).not.toBeInTheDocument();
  });

  it("shows the same inbox confirmation for an already registered signup", async () => {
    const user = userEvent.setup();
    vi.mocked(signupWithEmail).mockRejectedValue(
      new Error("User already registered"),
    );
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Name"), "Sherlock Holmes");
    await user.type(
      screen.getByLabelText("College Email"),
      "sherlock@aot.edu.in",
    );
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "Sleuth123!",
    );
    await user.type(screen.getByLabelText("Confirm Password"), "Sleuth123!");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Check your inbox to verify" }),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText(/already registered/i)).not.toBeInTheDocument();
  });

  it("uses an account-neutral password reset confirmation", async () => {
    const user = userEvent.setup();
    vi.mocked(requestPasswordReset).mockResolvedValue(undefined);
    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByLabelText("College Email"),
      "detective@aot.edu.in",
    );
    await user.click(
      screen.getByRole("button", { name: "Send recovery link" }),
    );

    expect(
      await screen.findByText(/if this email exists, a link has been sent/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("detective@aot.edu.in", { exact: true }),
    ).not.toBeInTheDocument();
  });
});
