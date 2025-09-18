export function getSiteUrl(): string {
	return process.env.NEXTAUTH_URL?.replace(/\/$/, '') || 'http://localhost:3000'
}


