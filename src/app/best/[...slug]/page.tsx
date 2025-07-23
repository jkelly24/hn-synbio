import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isCurrentUserAdmin } from '@/lib/admin'
import { getBestPosts } from '@/lib/feeds'
import { parsePeriodDate } from '@/lib/utils'
import FeedTabs from '@/components/FeedTabs'
import PeriodNavigator from '@/components/PeriodNavigator'
import PostList from '@/components/PostList'

interface BestPageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function BestPage({ params }: BestPageProps) {
  const { slug } = await params
  const slugArray = slug || []
  
  // Get session and admin status
  const session = await auth()
  const isAdmin = await isCurrentUserAdmin()
  
  // Get current user (same pattern as homepage)
  let currentUser = null
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
  }
  
  // Parse the slug to determine period and date
  let period: 'day' | 'month' | 'year' = 'day'
  let date = new Date()
  
  if (slugArray.length > 0) {
    const parsed = parsePeriodDate(slugArray[0])
    if (parsed && !isNaN(parsed.date.getTime())) {
      period = parsed.period
      date = parsed.date
    }
  }
  
  // Get best posts for this period (with current user ID)
  const posts = await getBestPosts(period, date, 30, undefined, currentUser?.id)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <FeedTabs activeTab="best" />
        
        <div className="mt-6">
          <PeriodNavigator 
            period={period}
            currentDate={date}
          />
        </div>
        
        <div className="mt-6">
          <PostList 
            posts={posts} 
            session={session}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  )
}
