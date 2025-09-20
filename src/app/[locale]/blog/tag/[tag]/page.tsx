import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { readAllPostsMeta } from '@/lib/blog/mdx'
import type { LocaleCode } from '@/lib/blog/types'

type Params = { locale: LocaleCode; tag: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { locale, tag } = await params
    return {
        title: locale === 'ar' ? `وسم: ${tag}` : `Tag: ${tag}`,
        description: locale === 'ar' ? `مقالات تحت وسم ${tag}` : `Posts tagged ${tag}`,
    }
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
	const { locale, tag } = await params
    if (!['en','ar'].includes(locale)) return notFound()
    const posts = readAllPostsMeta(locale).filter(p => (p.frontmatter.tags || []).map(t => t.toLowerCase()).includes(tag.toLowerCase()))
    return (
        <section className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">{locale === 'ar' ? `وسم: ${tag}` : `Tag: ${tag}`}</h1>
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


