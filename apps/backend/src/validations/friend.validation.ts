import { z } from "zod"

/** Usernames are stored and matched lowercase — normalized at the boundary. */
const normalizedUsername = z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.toLowerCase())

export const friendRequestBodySchema = z
    .object({
        username: normalizedUsername,
    })
    .strict()

export const friendSearchQuerySchema = z.object({
    username: normalizedUsername,
})

export const friendRequestIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
})

export const friendUserIdParamsSchema = z.object({
    userId: z.coerce.number().int().positive(),
})
