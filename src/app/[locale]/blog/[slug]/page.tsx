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
import BlogImage from '@/components/blog/BlogImage'
import EnhancedArticleContent from '@/components/blog/EnhancedArticleContent'
import ClientTableOfContents from '@/components/blog/ClientTableOfContents'
import FloatingTOC from '@/components/blog/FloatingTOC'
import ReadingProgress from '@/components/blog/ReadingProgress'
import { getSiteUrl } from '@/lib/blog/site'
import Breadcrumbs from '@/components/blog/Breadcrumbs'

export const revalidate = 3600

type Params = { locale: LocaleCode; slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { locale, slug } = await params
    const meta = getPostMeta(locale, slug)
    if (!meta) return {}
    const fm = meta.frontmatter
    const sibling = getSiblingTranslation(locale, slug)
    const alternates: Record<string, string> = {}
    alternates[locale] = `/${locale}/blog/${slug}`
    if (sibling) alternates[sibling.frontmatter.locale] = `/${sibling.frontmatter.locale}/blog/${sibling.slug}`
    const siteUrl = getSiteUrl()
    const articleUrl = `${siteUrl}/${locale}/blog/${slug}`
    const coverImageUrl = fm.coverImage?.url ? 
        (fm.coverImage.url.startsWith('http') ? fm.coverImage.url : `${siteUrl}${fm.coverImage.url}`) : 
        `${siteUrl}/blog/cover-placeholder.svg`

    return {
        title: fm.seo?.metaTitle || fm.title,
        description: fm.seo?.metaDescription || fm.excerpt,
        alternates: { languages: alternates, canonical: fm.seo?.canonicalUrl || articleUrl },
        icons: {
            icon: '/images/Nav/eldita.svg',
            shortcut: '/images/Nav/eldita.svg',
            apple: '/images/Nav/eldita.svg',
        },
        openGraph: {
            title: fm.seo?.metaTitle || fm.title,
            description: fm.seo?.metaDescription || fm.excerpt,
            url: articleUrl,
            siteName: 'Eldelta',
            images: [
                {
                    url: coverImageUrl,
                    width: fm.coverImage?.width || 1200,
                    height: fm.coverImage?.height || 630,
                    alt: fm.coverImage?.alt || fm.title,
                }
            ],
            locale: locale,
            type: 'article',
            publishedTime: fm.publishedAt,
            authors: [fm.author?.name || 'Eldelta Team'],
            section: fm.category,
            tags: fm.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: fm.seo?.metaTitle || fm.title,
            description: fm.seo?.metaDescription || fm.excerpt,
            images: [coverImageUrl],
            creator: '@eldelta',
            site: '@eldelta',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
    const { locale, slug } = await params
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
		<ReadingProgress />
		<article className="min-h-screen">
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
						
						{/* العنوان مع أيقونة الترجمة */}
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-4xl md:text-5xl font-bold leading-tight">
								{meta.frontmatter.title}
							</h1>
							
							{/* أيقونة الترجمة */}
							{sibling && (
								<Link 
									href={`/${sibling.frontmatter.locale}/blog/${sibling.slug}`}
									className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
									title={locale === 'ar' ? 'Read in English' : 'اقرأ بالعربية'}
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
									</svg>
									<span className="text-sm font-medium">
										{locale === 'ar' ? 'EN' : 'AR'}
									</span>
								</Link>
							)}
						</div>
						
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
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Table of Contents - Desktop Only */}
					<div className="hidden lg:block lg:col-span-1">
						<ClientTableOfContents locale={locale} />
					</div>
					
					{/* Article Content */}
					<div className="lg:col-span-3">
						{meta.frontmatter.coverImage?.url && (
							<div className="mb-12 -mt-8 relative">
								<div className="rounded-2xl shadow-2xl overflow-hidden">
									<BlogImage 
										src={meta.frontmatter.coverImage.url} 
										alt={meta.frontmatter.coverImage.alt || meta.frontmatter.title} 
										width={meta.frontmatter.coverImage.width || 1200} 
										height={meta.frontmatter.coverImage.height || 630} 
										priority
									/>
								</div>
							</div>
						)}

						<EnhancedArticleContent content={content} locale={locale} />
					</div>
				</div>

			

				
				{/* Related Posts */}
			{related.length > 0 && (
					<section className="mt-16">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold  mb-4">
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
			{/* Share Section */}
			<div className=" mt-12 p-6 rounded-2xl shadow-lg">
					<h3 className="text-2xl  font-bold mb-4 text-center">
						{locale === 'ar' ? 'شارك هذا المقال' : 'Share this article'}
					</h3>
				<ShareButtons url={url} title={meta.frontmatter.title} locale={locale} />
			</div>

				{/* Author Box */}
			<AuthorBox 
				author={{
					name: "فريق الدلتا",
					role: locale === 'ar' ? "خبراء الاستيراد والتصدير" : "Import & Export Experts",
					experience: locale === 'ar' ? "أكثر من 10 سنوات" : "Over 10 years",
					specializations: locale === 'ar' 
						? ["الصين", "الهند", "تركيا", "ألمانيا"]
						: ["China", "India", "Turkey", "Germany"],
					achievements: locale === 'ar'
						? ["500+ صفقة ناجحة", "50+ دولة", "1000+ عميل"]
						: ["500+ successful projects", "50+ countries", "1000+ clients"],
					contact: "support@eldelta-group.com",
					phone: "+966 59 837 7921"
				}}
				locale={locale}
			/>

			</main>
			
			{/* Floating Table of Contents for Mobile */}
			<FloatingTOC locale={locale} />
			</article>
		</>
	)
}


