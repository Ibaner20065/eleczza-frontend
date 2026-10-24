import { z } from "zod";

export const deductionSubmissionSchema = z.object({
  caseId: z.string().uuid("Invalid Case File ID."),
  questionId: z.string().uuid("Invalid Clue ID."),
  deduction: z.string().min(1, "A deduction must be provided."),
});

export const requestHintSchema = z.object({
  caseId: z.string().uuid("Invalid Case File ID."),
  questionId: z.string().uuid("Invalid Clue ID."),
  hintIndex: z.number().int().min(0),
});

export type DeductionSubmissionInput = z.infer<
  typeof deductionSubmissionSchema
>;
export type RequestHintInput = z.infer<typeof requestHintSchema>;
