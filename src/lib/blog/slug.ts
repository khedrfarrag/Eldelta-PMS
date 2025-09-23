// Simple slugify that supports Arabic and Latin letters, digits, and hyphens
// - Lowercases
// - Replaces spaces/underscores with hyphens
// - Removes characters except Arabic letters, a-z, 0-9, and hyphens
export function slugifyLabel(input: string): string {
    if (!input) return ''
    const lower = input.toLowerCase()
    const replaced = lower.replace(/[\s_]+/g, '-')
    // Keep Arabic unicode range \u0600-\u06FF and basic latin letters and digits
    const cleaned = replaced.replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
    // Collapse multiple hyphens
    return cleaned.replace(/-+/g, '-').replace(/^-|-$|\/-/g, '').trim()
}


