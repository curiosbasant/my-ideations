import { z } from 'zod'

export const groupCreateSchema = z.object({ name: z.string() })
export type groupCreateSchema = z.infer<typeof groupCreateSchema>

export const groupSpendCreateSchema = z.object({
  groupId: z.string(),
  amount: z
    .number()
    .or(z.string().pipe(z.coerce.number()))
    .refine((value) => value > 0, 'Amount should be a positive number'),
  note: z.string().max(50).optional(),
})
export type groupSpendCreateSchema = z.infer<typeof groupSpendCreateSchema>
