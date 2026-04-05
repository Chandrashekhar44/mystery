import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    passwordEnter: z.string().min(6, "Password must be at least 6 characters"),
    passwordReenter: z.string(),
  })
  .refine((data) => data.passwordEnter === data.passwordReenter, {
    message: "Passwords do not match",
    path: ["passwordReenter"],
  });
