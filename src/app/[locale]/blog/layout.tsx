import AnimatedThemeToggle from "@/components/shared/Navigation/AnimatedThemeToggle";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return <div className="blog-theme min-h-screen">
        <AnimatedThemeToggle/>
		{children}

		</div>
}


