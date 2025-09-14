import { z } from 'zod'

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
})

export type ResendOtpInput = z.infer<typeof resendOtpSchema>

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().regex(/^\d{6}$/,'OTP must be 6 digits'),
})

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>


