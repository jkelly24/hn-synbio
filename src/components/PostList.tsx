import Link from 'next/link'
import VoteButton from '@/components/VoteButton'
import CommentForm from '@/components/CommentForm'
import CommentList from '@/components/CommentList'
import DeleteButton from '@/components/DeleteButton'

interface PostListProps {
  posts: any[]
  session: any
  isAdmin: boolean
}

export default function PostList({ posts, session, isAdmin }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500 text-lg">
          No posts yet. Be the first to share something!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
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
                        <a href={post.url}
                          target="_blank"
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
      ))}
    </div>
  )
}
