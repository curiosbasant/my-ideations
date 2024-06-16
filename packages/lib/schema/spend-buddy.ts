import { z } from 'zod'

export const groupCreateSchema = z.object({ name: z.string() })
export type groupCreateSchema = z.infer<typeof groupCreateSchema>
