import { prisma } from '@/lib/prisma'

export interface FeedPost {
  id: string
  userId: string
  title: string
  description: string
  url: string | null
  score: number
  rank: number
  createdAt: Date
  deletedAt: Date | null
  user: {
    handle: string
  }
  comments: any[]
  votes: any[]
  _count: {
    votes: number
    comments: number
  }
}

const postInclude = (userId?: string) => ({
  user: {
    select: {
      handle: true,
    },
  },
  comments: {
    where: {
      deletedAt: null,
      parentId: null,
    },
    include: {
      user: {
        select: {
          handle: true,
        },
      },
      votes: userId ? {
        where: {
          userId: userId,
        },
      } : false,
      replies: {
        where: {
          deletedAt: null,
        },
        include: {
          user: {
            select: {
              handle: true,
            },
          },
          votes: userId ? {
            where: {
              userId: userId,
            },
          } : false,
          replies: {
            where: {
              deletedAt: null,
            },
            include: {
              user: {
                select: {
                  handle: true,
                },
              },
              votes: userId ? {
                where: {
                  userId: userId,
                },
              } : false,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  },
  votes: userId ? {
    where: {
      userId: userId,
    },
  } : false,
  _count: {
    select: {
      votes: true,
      comments: {
        where: {
          deletedAt: null,
        },
      },
    },
  },
})

export async function getTodayPosts(limit: number = 30, cursor?: string, userId?: string) {
  return await prisma.post.findMany({
    where: {
      deletedAt: null,
      ...(cursor ? { id: { lt: cursor } } : {}),
    },
    include: postInclude(userId),
    orderBy: {
      rank: 'desc',
    },
    take: limit,
  })
}

export async function getBestPosts(
  period: 'day' | 'month' | 'year',
  date: Date,
  limit: number = 30,
  cursor?: string,
  userId?: string
) {
  const { start, end } = getPeriodBounds(period, date)
  
  return await prisma.post.findMany({
    where: {
      deletedAt: null,
      createdAt: {
        gte: start,
        lt: end,
      },
      ...(cursor ? { id: { lt: cursor } } : {}),
    },
    include: postInclude(userId),
    orderBy: [
      { score: 'desc' },
      { createdAt: 'asc' },
    ],
    take: limit,
  })
}

function getPeriodBounds(period: 'day' | 'month' | 'year', date: Date) {
  const start = new Date(date)
  const end = new Date(date)
  
  switch (period) {
    case 'day':
      start.setUTCHours(0, 0, 0, 0)
      end.setUTCDate(end.getUTCDate() + 1)
      end.setUTCHours(0, 0, 0, 0)
      break
    case 'month':
      start.setUTCDate(1)
      start.setUTCHours(0, 0, 0, 0)
      end.setUTCMonth(end.getUTCMonth() + 1)
      end.setUTCDate(1)
      end.setUTCHours(0, 0, 0, 0)
      break
    case 'year':
      start.setUTCMonth(0, 1)
      start.setUTCHours(0, 0, 0, 0)
      end.setUTCFullYear(end.getUTCFullYear() + 1)
      end.setUTCMonth(0, 1)
      end.setUTCHours(0, 0, 0, 0)
      break
  }
  
  return { start, end }
}

export function formatPeriodDate(period: 'day' | 'month' | 'year', date: Date): string {
  switch (period) {
    case 'day':
      return date.toISOString().split('T')[0] // YYYY-MM-DD
    case 'month':
      return date.toISOString().slice(0, 7) // YYYY-MM
    case 'year':
      return date.getUTCFullYear().toString() // YYYY
  }
}

export function parsePeriodDate(period: 'day' | 'month' | 'year', dateStr: string): Date {
  switch (period) {
    case 'day':
      return new Date(dateStr + 'T00:00:00.000Z')
    case 'month':
      return new Date(dateStr + '-01T00:00:00.000Z')
    case 'year':
      return new Date(dateStr + '-01-01T00:00:00.000Z')
  }
}
