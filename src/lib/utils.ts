import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date parsing utilities for best feed
export function parsePeriodDate(slug: string): { period: 'day' | 'month' | 'year', date: Date } | null {
  // Match YYYY-MM-DD (day)
  if (/^\d{4}-\d{2}-\d{2}$/.test(slug)) {
    const date = new Date(slug + 'T00:00:00Z')
    if (!isNaN(date.getTime())) {
      return { period: 'day', date }
    }
  }
  
  // Match YYYY-MM (month)
  if (/^\d{4}-\d{2}$/.test(slug)) {
    const date = new Date(slug + '-01T00:00:00Z')
    if (!isNaN(date.getTime())) {
      return { period: 'month', date }
    }
  }
  
  // Match YYYY (year)
  if (/^\d{4}$/.test(slug)) {
    const date = new Date(slug + '-01-01T00:00:00Z')
    if (!isNaN(date.getTime())) {
      return { period: 'year', date }
    }
  }
  
  return null
}

export function formatPeriodDate(period: 'day' | 'month' | 'year', date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  switch (period) {
    case 'day':
      return `${year}-${month}-${day}`
    case 'month':
      return `${year}-${month}`
    case 'year':
      return `${year}`
    default:
      return `${year}-${month}-${day}`
  }
}
