import { env } from '@/config/env'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelOrder: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || (env.NODE_ENV === 'production' ? 'info' : 'debug')

function shouldLog(level: LogLevel): boolean {
  return levelOrder[level] >= levelOrder[currentLevel]
}

function maskSensitive(value: unknown): unknown {
  if (typeof value === 'string') {
    // Mask emails and long tokens
    const emailMasked = value.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
    if (emailMasked.length > 32) return emailMasked.slice(0, 8) + '…' + emailMasked.slice(-4)
    return emailMasked
  }
  if (typeof value === 'object' && value !== null) {
    const cloned: Record<string, unknown> = Array.isArray(value) ? {} : { ...(value as Record<string, unknown>) }
    const entries = Object.entries(value as Record<string, unknown>)
    for (const [k, v] of entries) {
      if (['password', 'token', 'authorization', 'auth', 'cookie'].includes(k.toLowerCase())) {
        cloned[k] = '[redacted]'
      } else {
        cloned[k] = maskSensitive(v)
      }
    }
    return cloned
  }
  return value
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) console.debug('[DEBUG]', ...args.map(maskSensitive))
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) console.info('[INFO]', ...args.map(maskSensitive))
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) console.warn('[WARN]', ...args.map(maskSensitive))
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) console.error('[ERROR]', ...args.map(maskSensitive))
  },
}


