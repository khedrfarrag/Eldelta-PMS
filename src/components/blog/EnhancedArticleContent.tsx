import { ReactNode } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ContentCard from './ContentCard'
import ReadMoreSection from './ReadMoreSection'
import AnimatedContainer from './AnimatedContainer'
import type { LocaleCode } from '@/lib/blog/types'

interface EnhancedArticleContentProps {
  content: string
  locale: LocaleCode
}

// Icons for different content types
const Icons = {
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tip: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  money: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  checklist: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

export default function EnhancedArticleContent({ content, locale }: EnhancedArticleContentProps) {
  const isRTL = locale === 'ar'

  // Parse content to extract structured sections
  const parseContent = (content: string) => {
    // This is a simplified parser - in a real implementation, you might want to use a more sophisticated MDX parser
    const sections = []
    const lines = content.split('\n')
    let currentSection = { type: 'default', title: '', content: '', icon: Icons.document }
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection })
        }
        currentSection = {
          type: 'default',
          title: line.replace('## ', '').trim(),
          content: '',
          icon: Icons.document
        }
      } else if (line.startsWith('### ')) {
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection })
        }
        const title = line.replace('### ', '').trim()
        let type = 'default'
        let icon = Icons.document
        
        // Determine section type based on title keywords
        if (title.toLowerCase().includes('مطلوب') || title.toLowerCase().includes('required') || title.toLowerCase().includes('documents')) {
          type = 'info'
          icon = Icons.checklist
        } else if (title.toLowerCase().includes('وقت') || title.toLowerCase().includes('time') || title.toLowerCase().includes('duration')) {
          type = 'tip'
          icon = Icons.clock
        } else if (title.toLowerCase().includes('تكلفة') || title.toLowerCase().includes('cost') || title.toLowerCase().includes('price')) {
          type = 'success'
          icon = Icons.money
        } else if (title.toLowerCase().includes('تحذير') || title.toLowerCase().includes('warning') || title.toLowerCase().includes('risk')) {
          type = 'warning'
          icon = Icons.warning
        } else if (title.toLowerCase().includes('نصيحة') || title.toLowerCase().includes('tip') || title.toLowerCase().includes('advice')) {
          type = 'tip'
          icon = Icons.tip
        }
        
        currentSection = { type, title, content: '', icon }
      } else {
        currentSection.content += line + '\n'
      }
    }
    
    if (currentSection.content.trim()) {
      sections.push(currentSection)
    }
    
    return sections
  }

  const sections = parseContent(content)

  if (sections.length === 0) {
    // Fallback to regular content if no sections found
    return (
      <AnimatedContainer>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </div>
        </div>
      </AnimatedContainer>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {sections.map((section, index) => (
        <AnimatedContainer key={index} delay={index * 200}>
          <ContentCard
            title={section.title}
            icon={section.icon}
            locale={locale}
            cardType={section.type as any}
            defaultExpanded={index < 2} // First two sections expanded by default
          >
            <ReadMoreSection
              locale={locale}
              previewLength={300}
              showReadMore={section.content.length > 500}
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote source={section.content} />
              </div>
            </ReadMoreSection>
          </ContentCard>
        </AnimatedContainer>
      ))}
    </div>
  )
}
