export type LocaleCode = 'en' | 'ar'

export interface BlogAuthor {
	name: string
	avatarUrl?: string
	bio?: string
	websiteUrl?: string
	twitter?: string
	linkedin?: string
}

export interface BlogSEO {
	metaTitle?: string
	metaDescription?: string
	canonicalUrl?: string
	ogImage?: string
}

export interface BlogFrontmatter {
	title: string
	excerpt?: string
	coverImage?: {
		url: string
		alt?: string
		width?: number
		height?: number
	}
	tags?: string[]
	category?: string
	author?: BlogAuthor
	publishedAt?: string
	updatedAt?: string
	status?: 'draft' | 'published'
	locale: LocaleCode
	translationOf: string
	seo?: BlogSEO
}

export interface BlogPostMeta {
	slug: string
	path: string
	frontmatter: BlogFrontmatter
}


