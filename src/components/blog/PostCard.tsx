import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/blog/types'
import { motion } from 'framer-motion'
export default function PostCard({ locale, post }: { locale: 'en' | 'ar'; post: BlogPostMeta }) {
	return (
		<article 
			className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
		>
			{/* Default vertical layout */}
			<div className="block group-hover:hidden transition-opacity duration-200">
				<div className="h-48 bg-gradient-to-br from-cyan-500 to-cyan-700 relative overflow-hidden">
					{post.frontmatter.coverImage?.url && (
						<img 
							src={post.frontmatter.coverImage.url} 
							alt={post.frontmatter.coverImage.alt || post.frontmatter.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
						/>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
					<div className="absolute bottom-3 left-3 animate-fade-in-up">
						<span className="inline-block px-2 py-1 bg-cyan-500 text-white rounded-full text-xs font-medium">
							{post.frontmatter.category}
						</span>
					</div>
				</div>
				<div className="p-6">
					<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 animate-fade-in">
						<span>{post.frontmatter.publishedAt}</span>
						<span>•</span>
						<span>{post.frontmatter.author?.name}</span>
					</div>
					<Link href={`/${locale}/blog/${post.slug}`} className="group/link">
						<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover/link:text-cyan-600 transition-all duration-300 line-clamp-2 group-hover/link:translate-x-1">
							{post.frontmatter.title}
						</h3>
					</Link>
					{post.frontmatter.excerpt && (
						<p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 animate-fade-in">
							{post.frontmatter.excerpt}
						</p>
					)}
					{post.frontmatter.tags && (
						<div className="flex flex-wrap gap-1 mb-4 animate-fade-in-up">
							{post.frontmatter.tags.slice(0, 3).map((tag, index) => (
								<span 
									key={tag} 
									className="px-2 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-full text-xs transition-all duration-200 hover:scale-110"
									style={{ animationDelay: `${0.4 + index * 0.1}s` }}
								>
									#{tag}
								</span>
							))}
						</div>
					)}
					<div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
						<Link 
							href={`/${locale}/blog/${post.slug}`}
							className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-all duration-300 group-hover:gap-2"
						>
							{locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
							<svg 
								className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</Link>
					</div>
				</div>
			</div>

			{/* Hover horizontal layout - Featured Post Style */}
			<div className="hidden group-hover:block animate-fade-in-scale ">
				<div className="md:flex">
					<div className="md:w-1/2">
						<div className="h-48 md:h-full bg-gradient-to-br from-cyan-500 to-cyan-700 relative overflow-hidden">
							{post.frontmatter.coverImage?.url && (
								<img 
									src={post.frontmatter.coverImage.url} 
									alt={post.frontmatter.coverImage.alt || post.frontmatter.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
								/>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
							<div className="absolute bottom-4 left-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
								<span className="inline-block px-3 py-1 bg-cyan-500 text-white rounded-full text-sm font-medium">
									{post.frontmatter.category}
								</span>
							</div>
						</div>
					</div>
					<div className="md:w-1/2 p-6">
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
							<span>{post.frontmatter.publishedAt}</span>
							<span>•</span>
							<span>{post.frontmatter.author?.name}</span>
						</div>
						<Link href={`/${locale}/blog/${post.slug}`} className="group/link">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover/link:text-cyan-600 transition-all duration-300 animate-fade-in-up group-hover/link:translate-x-1" style={{ animationDelay: '0.2s' }}>
								{post.frontmatter.title}
							</h3>
						</Link>
						{post.frontmatter.excerpt && (
							<p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
								{post.frontmatter.excerpt}
							</p>
						)}
						<div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s', transition: 'all 1s ease-in-out' }}>
							{post.frontmatter.tags?.slice(0, 3).map((tag, index) => (
								<span 
									key={tag} 
									className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-full text-sm transition-all duration-200 hover:scale-110"
									style={{ animationDelay: `${0.5 + index * 0.1}s` }}
								>
									#{tag}
								</span>
							))}
						</div>
						<div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
							<Link 
								href={`/${locale}/blog/${post.slug}`}
								className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 group-hover:gap-3"
							>
								{locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
								<svg 
									className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</article>
	)
}


