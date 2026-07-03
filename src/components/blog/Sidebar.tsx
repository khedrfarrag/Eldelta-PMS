import Link from 'next/link'
import { readAllPostsMeta } from '@/lib/blog/mdx'
import { SOCIAL_LINKS } from '@/lib/blog/social'
import { slugifyLabel } from '@/lib/blog/slug'

export default function Sidebar({ locale }: { locale: 'en' | 'ar' }) {
	const posts = readAllPostsMeta(locale)

	// Category counts and slugs
	const categoryCountMap = posts.reduce<Record<string, number>>((acc, p) => {
		const c = (p.frontmatter.category || '').trim()
		if (!c) return acc
		acc[c] = (acc[c] || 0) + 1
		return acc
	}, {})
	const categories = Object.keys(categoryCountMap)
		.sort((a, b) => categoryCountMap[b] - categoryCountMap[a])

	// Tag counts and top-N popular tags
	const tagCountMap = posts.reduce<Record<string, number>>((acc, p) => {
		for (const t of (p.frontmatter.tags || [])) {
			const normalized = (t || '').trim()
			if (!normalized) continue
			acc[normalized] = (acc[normalized] || 0) + 1
		}
		return acc
	}, {})
	const topTagLimit = 16
	const tags = Object.keys(tagCountMap)
		.sort((a, b) => tagCountMap[b] - tagCountMap[a])
		.slice(0, topTagLimit)
	return (
		<aside className="space-y-6">
			<section>
				<h3 className="font-semibold mb-3">{locale === 'ar' ? 'التصنيفات' : 'Categories'}</h3>
				<ul className="flex flex-wrap gap-2 text-sm">
					{categories.map((c) => {
						const slug = slugifyLabel(c)
						return (
							<li key={c}>
								<Link className="underline" href={`/${locale}/blog/category/${encodeURIComponent(slug)}`}>
									{c} <span className="opacity-70">({categoryCountMap[c]})</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</section>
			<section>
				<h3 className="font-semibold mb-3">{locale === 'ar' ? 'وسوم' : 'Tags'}</h3>
				<ul className="flex flex-wrap gap-2 text-sm">
					{tags.map((t) => {
						const slug = slugifyLabel(t)
						return (
							<li key={t}>
								<Link className="underline" href={`/${locale}/blog/tag/${encodeURIComponent(slug)}`}>
									#{t} <span className="opacity-70">({tagCountMap[t]})</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</section>
			<section>
				<h3 className="font-semibold mb-3">{locale === 'ar' ? 'تواصل معنا' : 'Follow Us'}</h3>
				<div className="flex gap-3 text-sm">
					<Link className="underline" href={SOCIAL_LINKS.facebook}>Facebook</Link>
					<Link className="underline" href={SOCIAL_LINKS.instagram}>Instagram</Link>
					<Link className="underline" href={SOCIAL_LINKS.whatsapp}>WhatsApp</Link>
					<Link className="underline" href={SOCIAL_LINKS.email}>Email</Link>
				</div>
			</section>
		</aside>
	)
}


