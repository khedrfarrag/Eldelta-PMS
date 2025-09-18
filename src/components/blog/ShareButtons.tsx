export default function ShareButtons({ url, title }: { url: string; title: string }) {
	const enc = (s: string) => encodeURIComponent(s)
	const twitter = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`
	const facebook = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`
	const linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${enc(url)}&title=${enc(title)}`
	return (
		<div className="flex gap-3 text-sm">
			<a className="underline" href={twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
			<a className="underline" href={facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
			<a className="underline" href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
		</div>
	)
}


