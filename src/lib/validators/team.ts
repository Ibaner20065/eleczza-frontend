import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, "Agency name must be at least 3 characters.")
    .max(30, "Agency name cannot exceed 30 characters."),
  motto: z.string().max(80, "Motto cannot exceed 80 characters.").optional(),
});

export const joinTeamSchema = z.object({
  passcode: z
    .string()
    .length(6, "Agency passcode must be exactly 6 alphanumeric characters.")
    .regex(
      /^[A-Z0-9]+$/,
      "Passcode must contain uppercase letters and numbers only.",
    ),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
