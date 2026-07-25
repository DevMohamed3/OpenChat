import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const registerBodySchema = z
  .object({
    name: z.string().trim().min(2).max(50),
    username: z.string().trim().min(3).max(30),
    email: z.string().trim().email(),
    password: passwordSchema,
    rememberMe: z.boolean().optional(),
  })
  .strict()

export const loginBodySchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional(),
  })
  .strict()

export const verifyEmailBodySchema = z
  .object({
    code: z.string().trim().min(1),
  })
  .strict()

export const googleLoginBodySchema = z
  .object({
    code: z.string().trim().min(1),
  })
  .strict()

export const forgotPasswordBodySchema = z
  .object({
    email: z.string().trim().email(),
  })
  .strict()

export const resetPasswordBodySchema = z
  .object({
    email: z.string().trim().email(),
    code: z.string().trim().min(6).max(6),
    newPassword: z.string().min(8),
  })
  .strict()
