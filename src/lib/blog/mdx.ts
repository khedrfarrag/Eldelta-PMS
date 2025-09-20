import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

import type { BlogFrontmatter, BlogPostMeta, LocaleCode } from './types'

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog')

export function getLocaleDir(locale: LocaleCode): string {
	return path.join(BLOG_ROOT, locale)
}

export function listPostSlugs(locale: LocaleCode): string[] {
	const dir = getLocaleDir(locale)
	if (!fs.existsSync(dir)) return []
	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.mdx'))
		.map((f) => f.replace(/\.mdx$/, ''))
}

export function readPostMeta(locale: LocaleCode, slug: string): BlogPostMeta | null {
	const filePath = path.join(getLocaleDir(locale), `${slug}.mdx`)
	if (!fs.existsSync(filePath)) return null
	const raw = fs.readFileSync(filePath, 'utf8')
	const { data } = matter(raw)
	const fm = data as BlogFrontmatter
	return { slug, path: filePath, frontmatter: fm }
}

export function readAllPostsMeta(locale: LocaleCode): BlogPostMeta[] {
	return listPostSlugs(locale)
		.map((slug) => readPostMeta(locale, slug))
		.filter((p): p is BlogPostMeta => Boolean(p))
}

export interface PairedTranslations {
	key: string
	en?: BlogPostMeta
	ar?: BlogPostMeta
}

/**
 * Build translation pairs based on shared `translationOf` key in frontmatter.
 */
export function pairTranslations(): PairedTranslations[] {
	const enPosts = readAllPostsMeta('en')
	const arPosts = readAllPostsMeta('ar')

	const byKey: Record<string, PairedTranslations> = {}

	for (const p of enPosts) {
		const key = p.frontmatter.translationOf
		if (!byKey[key]) byKey[key] = { key }
		byKey[key].en = p
	}

	for (const p of arPosts) {
		const key = p.frontmatter.translationOf
		if (!byKey[key]) byKey[key] = { key }
		byKey[key].ar = p
	}

	return Object.values(byKey)
}

export function getPostMeta(locale: LocaleCode, slug: string): BlogPostMeta | null {
	return readPostMeta(locale, slug)
}

export function getSiblingTranslation(locale: LocaleCode, slug: string): BlogPostMeta | null {
	const current = readPostMeta(locale, slug)
	if (!current) return null
	const key = current.frontmatter.translationOf
	const otherLocale: LocaleCode = locale === 'en' ? 'ar' : 'en'
	const others = readAllPostsMeta(otherLocale)
	return others.find((p) => p.frontmatter.translationOf === key) || null
}

export function getRelatedPosts(locale: LocaleCode, slug: string, limit = 3): BlogPostMeta[] {
	const current = readPostMeta(locale, slug)
	if (!current) return []
	const all = readAllPostsMeta(locale)
	const currentTags = new Set((current.frontmatter.tags || []).map((t) => t.toLowerCase()))
	const category = current.frontmatter.category?.toLowerCase()
	return all
		.filter((p) => p.slug !== slug)
		.sort((a, b) => {
			let scoreA = 0
			let scoreB = 0
			const aTags = new Set((a.frontmatter.tags || []).map((t) => t.toLowerCase()))
			const bTags = new Set((b.frontmatter.tags || []).map((t) => t.toLowerCase()))
			for (const t of aTags) if (currentTags.has(t)) scoreA += 1
			for (const t of bTags) if (currentTags.has(t)) scoreB += 1
			if (a.frontmatter.category?.toLowerCase() === category) scoreA += 1
			if (b.frontmatter.category?.toLowerCase() === category) scoreB += 1
			return scoreB - scoreA
		})
		.slice(0, limit)
}


