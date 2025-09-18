import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { readAllPostsMeta } from '@/lib/blog/mdx'
import type { LocaleCode } from '@/lib/blog/types'

type Params = { locale: LocaleCode; cat: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, cat } = params
    return {
        title: locale === 'ar' ? `تصنيف: ${cat}` : `Category: ${cat}`,
        description: locale === 'ar' ? `مقالات ضمن تصنيف ${cat}` : `Posts in category ${cat}`,
    }
}

export default function CategoryPage({ params }: { params: Params }) {
    const { locale, cat } = params
    if (!['en','ar'].includes(locale)) return notFound()
    const posts = readAllPostsMeta(locale).filter(p => (p.frontmatter.category || '').toLowerCase() === cat.toLowerCase())
    return (
        <section className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">{locale === 'ar' ? `تصنيف: ${cat}` : `Category: ${cat}`}</h1>
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


