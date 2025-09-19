import { env } from '@/config/env'

export function getSiteUrl(): string {
	return env.NEXTAUTH_URL?.replace(/\/$/, '') || 'http://localhost:3000'
}


