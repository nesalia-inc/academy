import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)