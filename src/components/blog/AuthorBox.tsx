import Image from 'next/image'
import Link from 'next/link'
import type { LocaleCode } from '@/lib/blog/types'

interface Author {
  name: string
  role: string
  experience: string
  specializations: string[]
  achievements: string[]
  contact: string
  phone: string
  image?: string
}

interface AuthorBoxProps {
  author: Author
  locale: LocaleCode
}

export default function AuthorBox({ author, locale }: AuthorBoxProps) {
  const isRTL = locale === 'ar'

	return (
    <div className=" rounded-2xl p-8 shadow-lg border border-cyan-200 dark:border-cyan-800">
      <div className="flex flex-col md:flex-row gap-6">
        {/* صورة الفريق */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
            <Image
              src={author.image || '/images/Nav/eldita.svg'}
              alt={author.name}
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* معلومات الفريق */}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-3xl font-bold mb-2">
              {author.name}
            </h3>
            <p className="text-lg text-cyan-600 dark:text-cyan-400 font-medium mb-1">
              {author.role}
            </p>
            <p className="text-sm ">
              {isRTL ? 'خبرة:' : 'Experience:'} {author.experience}
            </p>
          </div>

          {/* التخصصات */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold  mb-2">
              {isRTL ? 'التخصصات:' : 'Specializations:'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {author.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* الإنجازات */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">
              {isRTL ? 'الإنجازات:' : 'Achievements:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {author.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm "
                >
                  <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* معلومات الاتصال */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`mailto:${author.contact}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Link>
            
            <Link
              href={`tel:${author.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {author.phone}
            </Link>
          </div>
        </div>
      </div>

      {/* رسالة تحفيزية */}
      <div className="mt-6 p-4  rounded-lg border border-cyan-200 dark:border-cyan-700">
        <p className="text-sm text-center">
          {isRTL 
            ? 'فريق الدلتا جاهز لمساعدتك في كل خطوة من خطوات الاستيراد والتصدير. خبرتنا الواسعة وعلاقاتنا القوية مع الموردين حول العالم تضمن نجاح مشروعك.'
            : 'The Eldelta team is ready to help you with every step of import and export. Our extensive experience and strong relationships with suppliers worldwide ensure your project\'s success.'
          }
        </p>
      </div>
		</div>
	)
}