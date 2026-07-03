'use client'

import { useEffect, useState } from 'react'
import { createSiteReview } from '@/lib/api/siteReviews'

type Props = {
    open: boolean
    onClose?: () => void
    onSubmitted?: () => void
    initialName?: string
    locale?: 'ar' | 'en'
}

export default function SiteReviewModal({ open, onClose, onSubmitted, initialName = '', locale = 'ar' as 'ar' | 'en' }: Props) {
    const [name, setName] = useState(initialName || '')
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const isRTL = locale === 'ar'

    const labels = {
        title: isRTL ? 'قيّم تجربتك' : 'Rate your experience',
        name: isRTL ? 'الاسم' : 'Name',
        comment: isRTL ? 'تعليقك' : 'Comment',
        submit: isRTL ? 'إرسال' : 'Submit',
        cancel: isRTL ? 'إلغاء' : 'Cancel',
        rating: isRTL ? 'التقييم' : 'Rating',
        thanks: isRTL ? 'شكرًا لتقييمك!' : 'Thanks for your review!'
    }

    useEffect(() => {
        if (open) setName(initialName || '')
    }, [initialName, open])

    const handleSubmit = async () => {
        if (!name || !comment) return
        try {
            setLoading(true)
            await createSiteReview({ name, rating, comment, locale })
            onSubmitted?.()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => !loading && onClose?.()} />
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-600">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.519 3.651a1.25 1.25 0 001.04.768l3.957.317c1.164.093 1.64 1.53.75 2.3l-3.01 2.59a1.25 1.25 0 00-.403 1.28l.925 3.837c.273 1.133-.964 2.03-1.96 1.415l-3.38-2.057a1.25 1.25 0 00-1.29 0l-3.38 2.057c-.996.615-2.233-.282-1.96-1.415l.925-3.838a1.25 1.25 0 00-.403-1.279l-3.01-2.59c-.89-.77-.414-2.207.75-2.3l3.957-.318a1.25 1.25 0 001.04-.768l1.519-3.65z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">{labels.title}</h3>
                </div>

                <label className="block text-sm mb-1">{labels.name}</label>
                <input
                    className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />

                <label className="block text-sm mb-1">{labels.rating}</label>
                <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const v = i + 1
                        const active = v <= rating
                        return (
                            <button
                                key={v}
                                type="button"
                                aria-label={`rating-${v}`}
                                className={`p-1 transition-transform ${loading ? 'opacity-50' : 'hover:scale-110'}`}
                                onClick={() => setRating(v)}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-7 h-7 ${active ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.75.75 0 011.04.39l1.56 3.736a.75.75 0 00.61.46l4.052.35a.75.75 0 01.42 1.317l-3.06 2.63a.75.75 0 00-.24.77l.94 3.9a.75.75 0 01-1.12.83l-3.43-2.07a.75.75 0 00-.78 0l-3.43 2.07a.75.75 0 01-1.12-.83l.94-3.9a.75.75 0 00-.24-.77l-3.06-2.63a.75.75 0 01.42-1.318l4.053-.35a.75.75 0 00.61-.46l1.56-3.735a.75.75 0 01.39-.39z" />
                                </svg>
                            </button>
                        )
                    })}
                </div>

                <label className="block text-sm mb-1">{labels.comment}</label>
                <textarea
                    className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={loading}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onClose?.()}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                        disabled={loading}
                    >
                        {labels.cancel}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                        disabled={loading || !name || !comment}
                    >
                        {labels.submit}
                    </button>
                </div>
            </div>
        </div>
    )
}


