import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

import { getPostMeta, getRelatedPosts, getSiblingTranslation } from '@/lib/blog/mdx'
import type { LocaleCode } from '@/lib/blog/types'
import ShareButtons from '@/components/blog/ShareButtons'
import AuthorBox from '@/components/blog/AuthorBox'
import { getSiteUrl } from '@/lib/blog/site'
import Breadcrumbs from '@/components/blog/Breadcrumbs'

export const revalidate = 3600

type Params = { locale: LocaleCode; slug: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, slug } = params
    const meta = getPostMeta(locale, slug)
    if (!meta) return {}
    const fm = meta.frontmatter
    const sibling = getSiblingTranslation(locale, slug)
    const alternates: Record<string, string> = {}
    alternates[locale] = `/${locale}/blog/${slug}`
    if (sibling) alternates[sibling.frontmatter.locale] = `/${sibling.frontmatter.locale}/blog/${sibling.slug}`
    return {
        title: fm.seo?.metaTitle || fm.title,
        description: fm.seo?.metaDescription || fm.excerpt,
        alternates: { languages: alternates, canonical: fm.seo?.canonicalUrl },
        openGraph: {
            title: fm.seo?.metaTitle || fm.title,
            description: fm.seo?.metaDescription || fm.excerpt,
            images: fm.coverImage?.url ? [{ url: fm.coverImage.url }]: undefined,
            locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: fm.seo?.metaTitle || fm.title,
            description: fm.seo?.metaDescription || fm.excerpt,
            images: fm.coverImage?.url ? [fm.coverImage.url] : undefined,
        },
    }
}

export default function BlogPostPage({ params }: { params: Params }) {
	const { locale, slug } = params
	if (!['en', 'ar'].includes(locale)) return notFound()

	const meta = getPostMeta(locale, slug)
	if (!meta) return notFound()

	const sibling = getSiblingTranslation(locale, slug)
	const related = getRelatedPosts(locale, slug, 3)

	const source = fs.readFileSync(path.join(process.cwd(), 'content', 'blog', locale, `${slug}.mdx`), 'utf8')
	const { content } = matter(source)

	const site = getSiteUrl()
	const url = `${site}/${locale}/blog/${slug}`

	return (
		<>
		<article className="min-h-screen bg-gray-50 dark:bg-slate-900">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-cyan-950 to-slate-900 text-white py-16">
				<div className="max-w-4xl mx-auto px-4">
			<Breadcrumbs
				locale={locale}
				items={[
					{ label: locale === 'ar' ? 'الرئيسية' : 'Home', href: `/` },
					{ label: locale === 'ar' ? 'المدونة' : 'Blog', href: `/${locale}/blog` },
					{ label: meta.frontmatter.title },
				]}
			/>
					<div className="mt-8">
						{meta.frontmatter.category && (
							<span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm font-medium mb-4">
								{meta.frontmatter.category}
							</span>
						)}
						<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
							{meta.frontmatter.title}
						</h1>
						{meta.frontmatter.excerpt && (
							<p className="text-xl text-cyan-100 leading-relaxed max-w-3xl">
								{meta.frontmatter.excerpt}
							</p>
						)}
						<div className="flex flex-wrap gap-4 mt-8">
							{meta.frontmatter.tags?.slice(0, 3).map((tag) => (
								<span key={tag} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
									#{tag}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-12">
				{meta.frontmatter.coverImage?.url && (
					<div className="mb-12 -mt-8 relative">
						<div className=" rounded-2xl shadow-2xl overflow-hidden">
							<Image 
								src={meta.frontmatter.coverImage.url} 
								alt={meta.frontmatter.coverImage.alt || meta.frontmatter.title} 
								width={meta.frontmatter.coverImage.width || 1200} 
								height={meta.frontmatter.coverImage.height || 630} 
								className="w-full h-auto aspect-video object-cover" 
							/>
						</div>
				</div>
			)}

				<article className="prose prose-lg dark:prose-invert max-w-none">
					<MDXRemote source={content} />
				</article>

				{/* Action Buttons */}
				<div className="mt-16 flex flex-wrap gap-4 justify-center">
				{sibling && (
						<Link 
							className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
							href={`/${sibling.frontmatter.locale}/blog/${sibling.slug}`}
						>
							{locale === 'ar' ? 'Read other language' : 'اقرأ النسخة الأخرى'}
					</Link>
				)}
					<Link 
						className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors"
						href={`/${locale}/blog`}
					>
					{locale === 'ar' ? 'رجوع للمدونة' : 'Back to Blog'}
				</Link>
			</div>

				{/* Share Section */}
				<div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
					<h3 className="text-lg font-semibold mb-4 text-center">
						{locale === 'ar' ? 'شارك هذا المقال' : 'Share this article'}
					</h3>
				<ShareButtons url={url} title={meta.frontmatter.title} />
			</div>

				{/* Author Box */}
			<AuthorBox author={meta.frontmatter.author} locale={locale} />

				{/* Related Posts */}
			{related.length > 0 && (
					<section className="mt-16">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
								{locale === 'ar' ? 'مقالات ذات صلة' : 'Related posts'}
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
								{locale === 'ar' ? 'اكتشف المزيد من المحتوى المشابه' : 'Discover more similar content'}
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{related.map((r) => (
								<Link 
									key={r.slug} 
									href={`/${locale}/blog/${r.slug}`}
									className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
								>
									<h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 transition-colors mb-2">
										{r.frontmatter.title}
									</h3>
									{r.frontmatter.excerpt && (
										<p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
											{r.frontmatter.excerpt}
										</p>
									)}
								</Link>
						))}
						</div>
				</section>
			)}
			</main>
			</article>
		</>
	)
}


