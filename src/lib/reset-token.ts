import crypto from 'crypto'

export function generateResetToken(): { token: string; hash: string; expiresAt: Date } {
  const token = crypto.randomBytes(24).toString('hex')
  const hash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  return { token, hash, expiresAt }
}

export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}


