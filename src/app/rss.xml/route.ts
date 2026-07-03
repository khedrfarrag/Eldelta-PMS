import { NextResponse } from 'next/server'
import { readAllPostsMeta } from '@/lib/blog/mdx'
import { getSiteUrl } from '@/lib/blog/site'

export async function GET() {
	const site = getSiteUrl()
	const posts = [...readAllPostsMeta('en'), ...readAllPostsMeta('ar')]
		.sort((a, b) => new Date((b.frontmatter.publishedAt || '')).getTime() - new Date((a.frontmatter.publishedAt || '')).getTime())
		.slice(0, 20)

	const items = posts
		.map((p) => {
			const url = `${site}/${p.frontmatter.locale}/blog/${p.slug}`
			return `\n  <item>\n    <title><![CDATA[${p.frontmatter.title}]]></title>\n    <link>${url}</link>\n    <guid>${url}</guid>\n    <description><![CDATA[${p.frontmatter.excerpt || ''}]]></description>\n    ${p.frontmatter.publishedAt ? `<pubDate>${new Date(p.frontmatter.publishedAt).toUTCString()}</pubDate>` : ''}\n  </item>`
		})
		.join('')

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Eldilta Blog</title>\n  <link>${site}</link>\n  <description>Import/Export insights and guides</description>${items}\n</channel>\n</rss>`

	return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}


