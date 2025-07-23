'use client'

import Link from 'next/link'
import { formatPeriodDate } from '@/lib/feeds'
import { cn } from '@/lib/utils'

interface PeriodNavigatorProps {
  period: 'day' | 'month' | 'year'
  currentDate: Date
  className?: string
}

export default function PeriodNavigator({ 
  period, 
  currentDate, 
  className 
}: PeriodNavigatorProps) {
  
  // Calculate previous and next dates
  const getPreviousDate = () => {
    const prev = new Date(currentDate)
    switch (period) {
      case 'day':
        prev.setUTCDate(prev.getUTCDate() - 1)
        break
      case 'month':
        prev.setUTCMonth(prev.getUTCMonth() - 1)
        break
      case 'year':
        prev.setUTCFullYear(prev.getUTCFullYear() - 1)
        break
    }
    return prev
  }

  const getNextDate = () => {
    const next = new Date(currentDate)
    switch (period) {
      case 'day':
        next.setUTCDate(next.getUTCDate() + 1)
        break
      case 'month':
        next.setUTCMonth(next.getUTCMonth() + 1)
        break
      case 'year':
        next.setUTCFullYear(next.getUTCFullYear() + 1)
        break
    }
    return next
  }

  const formatDisplayDate = () => {
    switch (period) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      case 'month':
        return currentDate.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'long'
        })
      case 'year':
        return currentDate.getUTCFullYear().toString()
    }
  }

  const previousDate = getPreviousDate()
  const nextDate = getNextDate()
  const isNextInFuture = nextDate > new Date()

  return (
    <div className={cn('bg-gray-50 border-b border-gray-200', className)}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Period Selector */}
          <div className="flex space-x-1">
            <Link
              href="/best"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                period === 'day'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              Day
            </Link>
            <Link
              href={`/best/${formatPeriodDate('month', new Date())}`}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                period === 'month'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              Month
            </Link>
            <Link
              href={`/best/${formatPeriodDate('year', new Date())}`}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                period === 'year'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              Year
            </Link>
          </div>

          {/* Current Period Display */}
          <div className="flex items-center space-x-4">
            <Link
              href={`/best/${formatPeriodDate(period, previousDate)}`}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
              aria-label={`Previous ${period}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <div className="text-lg font-medium text-gray-900 min-w-0">
              {formatDisplayDate()}
            </div>

            {!isNextInFuture ? (
              <Link
                href={`/best/${formatPeriodDate(period, nextDate)}`}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
                aria-label={`Next ${period}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="p-2 text-gray-300 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>

          {/* UTC Notice */}
          <div className="text-xs text-gray-500">
            Times in UTC
          </div>
        </div>
      </div>
    </div>
  )
}
