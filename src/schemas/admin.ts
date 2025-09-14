import { z } from 'zod'

export const adminCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  status: z.enum(['approved', 'pending', 'verified', 'rejected']).optional(),
})

export type AdminCreateInput = z.infer<typeof adminCreateSchema>

export const adminUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  status: z.enum(['approved', 'pending', 'verified', 'rejected']).optional(),
})

export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>


