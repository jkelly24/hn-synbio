import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isCurrentUserAdmin } from '@/lib/admin'
import { getTodayPosts } from '@/lib/feeds'
import FeedTabs from '@/components/FeedTabs'
import PostList from '@/components/PostList'
import Link from 'next/link'

export const revalidate = 60 // 60 seconds as per PRD

export default async function TodayPage() {
  const session = await auth()
  const isAdmin = await isCurrentUserAdmin()
  
  let currentUser = null
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
  }
  
  const posts = await getTodayPosts(30, undefined, currentUser?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SynBio News</h1>
              <p className="text-sm text-gray-600 mt-1">Synthetic biology news and discussion</p>
            </div>
            {session && (
              <Link
                href="/submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                Submit Post
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Feed Tabs */}
      <FeedTabs activeTab="today" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!session && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">
              <Link href="/login" className="font-medium text-blue-900 hover:text-blue-700 underline">
                Login
              </Link>{' '}
              or{' '}
              <Link href="/signup" className="font-medium text-blue-900 hover:text-blue-700 underline">
                sign up
              </Link>{' '}
              to submit posts and join the discussion.
            </p>
          </div>
        )}

        <PostList 
          posts={posts} 
          session={session}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  )
}
