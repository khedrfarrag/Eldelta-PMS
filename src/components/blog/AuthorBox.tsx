import type { BlogAuthor } from '@/lib/blog/types'

export default function AuthorBox({ author, locale }: { author?: BlogAuthor; locale: 'en' | 'ar' }) {
	if (!author) return null
	return (
		<div className="border rounded p-4 mt-10">
			<div className="font-semibold">{author.name}</div>
			{author.bio && <p className="text-gray-600 text-sm mt-1">{author.bio}</p>}
		</div>
	)
}


