import { MDXRemote } from 'next-mdx-remote/rsc'
import type { LocaleCode } from '@/lib/blog/types'

interface ArticleContentProps {
  content: string
  locale: LocaleCode
}

export default function ArticleContent({ content, locale }: ArticleContentProps) {
  const isRTL = locale === 'ar'

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`
        prose prose-lg 
        ${isRTL ? 'prose-rtl' : 'prose-ltr'}
        dark:prose-invert 
        max-w-none
        prose-headings:font-bold
        prose-headings:text-gray-900
        dark:prose-headings:text-white
        prose-h1:text-4xl
        prose-h1:mb-8
        prose-h1:mt-12
        prose-h1:border-b-2
        prose-h1:border-cyan-500
        prose-h1:pb-4
        prose-h2:text-3xl
        prose-h2:mb-6
        prose-h2:mt-10
        prose-h2:text-cyan-600
        dark:prose-h2:text-cyan-400
        prose-h3:text-2xl
        prose-h3:mb-4
        prose-h3:mt-8
        prose-h3:text-gray-800
        dark:prose-h3:text-gray-200
        prose-p:text-lg
        prose-p:leading-relaxed
        prose-p:mb-6
        prose-p:text-gray-700
        dark:prose-p:text-gray-300
        prose-strong:text-gray-900
        dark:prose-strong:text-white
        prose-strong:font-bold
        prose-ul:my-6
        prose-ol:my-6
        prose-li:my-2
        prose-li:text-gray-700
        dark:prose-li:text-gray-300
        prose-li:leading-relaxed
        prose-blockquote:border-l-4
        prose-blockquote:border-cyan-500
        prose-blockquote:bg-cyan-50
        dark:prose-blockquote:bg-cyan-900/20
        prose-blockquote:pl-6
        prose-blockquote:py-4
        prose-blockquote:my-8
        prose-blockquote:rounded-r-lg
        prose-blockquote:italic
        prose-blockquote:text-gray-800
        dark:prose-blockquote:text-gray-200
        prose-code:bg-gray-100
        dark:prose-code:bg-gray-800
        prose-code:px-2
        prose-code:py-1
        prose-code:rounded
        prose-code:text-sm
        prose-code:font-mono
        prose-pre:bg-gray-900
        prose-pre:text-gray-100
        prose-pre:p-6
        prose-pre:rounded-lg
        prose-pre:overflow-x-auto
        prose-pre:my-8
        prose-table:my-8
        prose-table:border-collapse
        prose-table:w-full
        prose-th:bg-cyan-50
        dark:prose-th:bg-cyan-900/30
        prose-th:border
        prose-th:border-gray-300
        dark:prose-th:border-gray-600
        prose-th:px-4
        prose-th:py-3
        prose-th:text-left
        prose-th:font-semibold
        prose-th:text-gray-900
        dark:prose-th:text-white
        prose-td:border
        prose-td:border-gray-300
        dark:prose-td:border-gray-600
        prose-td:px-4
        prose-td:py-3
        prose-td:text-gray-700
        dark:prose-td:text-gray-300
        prose-img:rounded-lg
        prose-img:shadow-lg
        prose-img:my-8
        prose-a:text-cyan-600
        dark:prose-a:text-cyan-400
        prose-a:no-underline
        hover:prose-a:underline
        prose-a:font-medium
        prose-hr:border-gray-300
        dark:prose-hr:border-gray-600
        prose-hr:my-12
      `}>
        <MDXRemote source={content} />
      </div>
    </div>
  )
}
