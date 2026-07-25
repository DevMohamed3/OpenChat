import { z } from "zod"

export const registerBodySchema = z
  .object({
    name: z.string().trim().min(2).max(50),
    username: z.string().trim().min(3).max(30),
    email: z.string().trim().email(),
    password: z.string().min(1),
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

