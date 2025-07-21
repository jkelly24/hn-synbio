import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get posts from last 7 days that aren't deleted
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        deletedAt: null, // Only include non-deleted posts
      },
      select: {
        id: true,
        score: true,
        createdAt: true,
      },
    })

    // Calculate new ranks using gravity formula
    const now = new Date()
    const updates = posts.map((post) => {
      const hoursAgo = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60)
      const rank = (post.score - 1) / Math.pow(hoursAgo + 2, 1.5)
      
      return prisma.post.update({
        where: { id: post.id },
        data: { rank },
      })
    })

    // Execute all updates
    await Promise.all(updates)

    return NextResponse.json({ success: true, updated: posts.length })
  } catch (error) {
    console.error('Rank calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate ranks' },
      { status: 500 }
    )
  }
}
