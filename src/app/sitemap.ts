import type { MetadataRoute } from 'next'
import { readAllPostsMeta } from '@/lib/blog/mdx'
import { getSiteUrl } from '@/lib/blog/site'

export default function sitemap(): MetadataRoute.Sitemap {
	const site = getSiteUrl()
	const urls: MetadataRoute.Sitemap = []
	for (const locale of ['en','ar'] as const) {
		// Blog index
		urls.push({ url: `${site}/${locale}/blog`, changeFrequency: 'weekly', priority: 0.6 })
		// Posts
		for (const p of readAllPostsMeta(locale)) {
			urls.push({ url: `${site}/${locale}/blog/${p.slug}`, changeFrequency: 'weekly', priority: 0.7, lastModified: p.frontmatter.updatedAt || p.frontmatter.publishedAt })
		}
	}
	return urls
}


