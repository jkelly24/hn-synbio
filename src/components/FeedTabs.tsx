'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface FeedTabsProps {
  className?: string
}

export default function FeedTabs({ className }: FeedTabsProps) {
  const pathname = usePathname()
  
  const isToday = pathname === '/' || pathname === '/today'
  const isBest = pathname.startsWith('/best')

  return (
    <div className={cn('sticky top-0 z-10 bg-white border-b border-gray-200', className)}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8" aria-label="Feed navigation">
          <Link
            href="/today"
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              isToday
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
            aria-current={isToday ? 'page' : undefined}
          >
            Today
          </Link>
          <Link
            href="/best"
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              isBest
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
            aria-current={isBest ? 'page' : undefined}
          >
            Best
          </Link>
        </nav>
      </div>
    </div>
  )
}
