import Link from 'next/link'

export default function Breadcrumbs({
	locale,
	items,
}: {
	locale: 'en' | 'ar'
	items: { label: string; href?: string }[]
}) {
	return (
		<nav className="text-sm text-gray-500" aria-label="Breadcrumb">
			<ol className="flex flex-wrap gap-2 items-center">
				{items.map((it, idx) => (
					<li key={idx} className="flex items-center gap-2">
						{it.href ? (
							<Link href={it.href} className="hover:text-[var(--color-primary)] underline-offset-4 hover:underline">
								{it.label}
							</Link>
						) : (
							<span className="text-gray-700">{it.label}</span>
						)}
						{idx < items.length - 1 && <span className="opacity-50">/</span>}
					</li>
				))}
			</ol>
		</nav>
	)
}


