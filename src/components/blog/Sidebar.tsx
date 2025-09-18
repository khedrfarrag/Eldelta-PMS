import Link from 'next/link'
import { readAllPostsMeta } from '@/lib/blog/mdx'
import { SOCIAL_LINKS } from '@/lib/blog/social'

export default function Sidebar({ locale }: { locale: 'en' | 'ar' }) {
	const posts = readAllPostsMeta(locale)
	const tags = Array.from(new Set(posts.flatMap(p => p.frontmatter.tags || []))).slice(0, 12)
	const categories = Array.from(new Set(posts.map(p => p.frontmatter.category).filter(Boolean) as string[]))
	return (
		<aside className="space-y-6">
			<section>
				<h3 className="font-semibold mb-3">{locale === 'ar' ? 'التصنيفات' : 'Categories'}</h3>
				<ul className="flex flex-wrap gap-2 text-sm">
					{categories.map((c) => (
						<li key={c}>
							<Link className="underline" href={`/${locale}/blog/category/${encodeURIComponent(c!)}`}>{c}</Link>
						</li>
					))}
				</ul>
			</section>
			<section>
				<h3 className="font-semibold mb-3">{locale === 'ar' ? 'وسوم' : 'Tags'}</h3>
				<ul className="flex flex-wrap gap-2 text-sm">
					{tags.map((t) => (
						<li key={t}>
							<Link className="underline" href={`/${locale}/blog/tag/${encodeURIComponent(t)}`}>#{t}</Link>
						</li>
					))}
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


