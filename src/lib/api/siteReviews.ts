export interface CreateSiteReviewPayload {
    name: string
    rating: number
    comment: string
    locale?: 'ar' | 'en'
}

export async function createSiteReview(payload: CreateSiteReviewPayload) {
    const res = await fetch('/api/site-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to submit review')
    }
    return res.json()
}


