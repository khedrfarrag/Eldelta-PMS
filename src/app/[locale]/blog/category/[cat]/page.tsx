import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { readAllPostsMeta } from '@/lib/blog/mdx'
import type { LocaleCode } from '@/lib/blog/types'

type Params = { locale: LocaleCode; cat: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { locale, cat } = await params
    return {
        title: locale === 'ar' ? `تصنيف: ${cat}` : `Category: ${cat}`,
        description: locale === 'ar' ? `مقالات ضمن تصنيف ${cat}` : `Posts in category ${cat}`,
        icons: {
            icon: '/images/Nav/eldita.svg',
            shortcut: '/images/Nav/eldita.svg',
            apple: '/images/Nav/eldita.svg',
        },
    }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
	const { locale, cat } = await params
    if (!['en','ar'].includes(locale)) return notFound()
    const { slugifyLabel } = await import('@/lib/blog/slug')
    const decoded = decodeURIComponent(cat)
    const targetSlugs = new Set([
        slugifyLabel(cat),
        slugifyLabel(decoded),
        cat.toLowerCase(),
        decoded.toLowerCase(),
    ])
    const postsAll = readAllPostsMeta(locale)
    const posts = postsAll.filter(p => {
        const name = (p.frontmatter.category || '').trim()
        if (!name) return false
        const candidates = [
            slugifyLabel(name),
            name.toLowerCase(),
        ]
        return candidates.some(c => targetSlugs.has(c))
    })
    const humanName = posts[0]?.frontmatter.category || decoded || cat
    return (
        <section className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">{locale === 'ar' ? `تصنيف: ${humanName}` : `Category: ${humanName}`}</h1>
            {posts.length === 0 ? <p className="text-gray-500">{locale === 'ar' ? 'لا توجد نتائج.' : 'No results.'}</p> : (
                <ul className="space-y-4">
                    {posts.map(p => (
                        <li key={p.slug} className="border rounded p-4">
                            <Link href={`/${locale}/blog/${p.slug}`} className="font-semibold">{p.frontmatter.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}


