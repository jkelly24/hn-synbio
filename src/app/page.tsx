import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isCurrentUserAdmin } from '@/lib/admin'
import Link from 'next/link'
import VoteButton from '@/components/VoteButton'
import CommentForm from '@/components/CommentForm'
import CommentList from '@/components/CommentList'
import DeleteButton from '@/components/DeleteButton'

async function getPosts(userId?: string) {
  return await prisma.post.findMany({
    where: {
      deletedAt: null,
    },
    include: {
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
    },
    orderBy: {
      rank: 'desc',
    },
  })
}

export default async function HomePage() {
  const session = await auth()
  const isAdmin = await isCurrentUserAdmin()
  
  let currentUser = null
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
  }
  
  const posts = await getPosts(currentUser?.id)

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

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">
                No posts yet. Be the first to share something!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <VoteButton
                        postId={post.id}
                        initialScore={post.score}
                        hasVoted={post.votes.length > 0}
                        isLoggedIn={!!session}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-semibold text-gray-900 leading-6">
                            {post.url ? (
                              <a                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
                              >
                                {post.title}
                              </a>
                            ) : (
                              post.title
                            )}
                            {post.url && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({new URL(post.url).hostname})
                              </span>
                            )}
                          </h2>
                          {isAdmin && (
                            <DeleteButton type="post" id={post.id} />
                          )}
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-3">{post.description}</p>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="font-medium">{post.user.handle}</span>
                          <span>•</span>
                          <time>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                          <span>•</span>
                          <span>{post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Discussion
                        </h3>
                        
                        <div className="space-y-4">
                          <CommentList 
                            comments={post.comments} 
                            isLoggedIn={!!session} 
                            postId={post.id} 
                            isAdmin={isAdmin}
                          />
                          
                          <div className="pt-4 border-t border-gray-100">
                            <CommentForm postId={post.id} isLoggedIn={!!session} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
