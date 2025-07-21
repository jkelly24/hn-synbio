import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import VoteButton from '@/components/VoteButton'
import CommentForm from '@/components/CommentForm'
import CommentList from '@/components/CommentList'

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
  
  let currentUser = null
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
  }
  
  const posts = await getPosts(currentUser?.id)

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SynBio News</h1>
        {session && (
          <Link
            href="/submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Post
          </Link>
        )}
      </div>

      {!session && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>{' '}
            or{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              sign up
            </Link>{' '}
            to submit posts and join the discussion.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No posts yet. Be the first to share something!
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <VoteButton
                  postId={post.id}
                  initialScore={post.score}
                  hasVoted={post.votes.length > 0}
                  isLoggedIn={!!session}
                />
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {post.url ? (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {post.title}
                        </a>
                      ) : (
                        post.title
                      )}
                    </h2>
                    <p className="text-gray-700 mt-2">{post.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span>by {post.user.handle}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Comments</h3>
                      <CommentList comments={post.comments} isLoggedIn={!!session} postId={post.id} />
                    </div>
                    
                    <CommentForm postId={post.id} isLoggedIn={!!session} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
