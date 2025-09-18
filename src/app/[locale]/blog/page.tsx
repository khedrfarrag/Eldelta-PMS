import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/blog/PostCard'
import Sidebar from '@/components/blog/Sidebar'
import Breadcrumbs from '@/components/blog/Breadcrumbs'

import { readAllPostsMeta } from '@/lib/blog/mdx'
import type { LocaleCode } from '@/lib/blog/types'

type Params = { locale: LocaleCode }

export const revalidate = 3600

export default function BlogIndex({ params }: { params: Params }) {
	const { locale } = params
	if (!['en', 'ar'].includes(locale)) return notFound()
	const posts = readAllPostsMeta(locale)

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-slate-900">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-cyan-950 to-slate-900 text-white py-20">
				<div className="max-w-7xl mx-auto px-4">
					<Breadcrumbs 
						locale={locale} 
						items={[
							{ label: locale === 'ar' ? 'الرئيسية' : 'Home', href: `/` }, 
							{ label: locale === 'ar' ? 'المدونة' : 'Blog' }
						]} 
					/>
					<div className="mt-8 text-center">
						<h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
							{locale === 'ar' ? 'المدونة' : 'Blog'}
						</h1>
						<p className="text-xl text-cyan-100 leading-relaxed max-w-3xl mx-auto">
							{locale === 'ar' ? 'مقالات مختارة عن الاستيراد والتصدير والخدمات اللوجستية.' : 'Selected articles on import, export, and logistics.'}
						</p>
						<div className="mt-8 flex justify-center">
							<div className="w-24 h-1 bg-cyan-400 rounded-full"></div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
					{/* Posts Grid */}
					<div className="lg:col-span-3">
						{posts.length === 0 ? (
							<div className="text-center py-20">
								<div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
									<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
									{locale === 'ar' ? 'لا توجد مقالات بعد' : 'No posts yet'}
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{locale === 'ar' ? 'سنضيف مقالات جديدة قريباً' : 'We\'ll add new articles soon'}
								</p>
							</div>
						) : (
							<div className="space-y-8">
								{/* Featured Post */}
								{posts.length > 0 && (
									<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
										<div className="md:flex">
											<div className="md:w-1/2">
												<div className="h-64 md:h-full bg-gradient-to-br from-cyan-500 to-cyan-700 relative overflow-hidden">
													{posts[0].frontmatter.coverImage?.url && (
														<img 
															src={posts[0].frontmatter.coverImage.url} 
															alt={posts[0].frontmatter.coverImage.alt || posts[0].frontmatter.title}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
														/>
													)}
													<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
													<div className="absolute bottom-4 left-4">
														<span className="inline-block px-3 py-1 bg-cyan-500 text-white rounded-full text-sm font-medium">
															{posts[0].frontmatter.category}
														</span>
													</div>
												</div>
											</div>
											<div className="md:w-1/2 p-8">
												<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
													<span>{posts[0].frontmatter.publishedAt}</span>
													<span>•</span>
													<span>{posts[0].frontmatter.author?.name}</span>
												</div>
												<Link href={`/${locale}/blog/${posts[0].slug}`} className="group">
													<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-cyan-600 transition-colors">
														{posts[0].frontmatter.title}
													</h2>
												</Link>
												<p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
													{posts[0].frontmatter.excerpt}
												</p>
												<div className="flex flex-wrap gap-2 mb-6">
													{posts[0].frontmatter.tags?.slice(0, 3).map((tag) => (
														<span key={tag} className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-full text-sm">
															#{tag}
														</span>
													))}
												</div>
												<Link 
													href={`/${locale}/blog/${posts[0].slug}`}
													className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
												>
													{locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								)}

								{/* Other Posts Grid */}
								{posts.length > 1 && (
									<div>
										<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
											{locale === 'ar' ? 'مقالات أخرى' : 'More Articles'}
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
											{posts.slice(1).map((post) => (
												<PostCard key={post.slug} locale={locale} post={post} />
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-8">
							<Sidebar locale={locale} />
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}


