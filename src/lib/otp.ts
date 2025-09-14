import crypto from 'crypto'

export type OtpRecord = {
  email: string
  otpHash: string
  expiresAt: Date
  createdAt: Date
}

export function generateNumericOtp(length: number = 6): string {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    const idx = crypto.randomInt(0, digits.length)
    code += digits[idx]
  }
  return code
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

export function isExpired(date: Date): boolean {
  return Date.now() > date.getTime()
}


