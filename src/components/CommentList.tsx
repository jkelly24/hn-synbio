'use client'

import CommentVoteButton from './CommentVoteButton'
import ReplyForm from './ReplyForm'
import { useState } from 'react'

interface Comment {
  id: string
  body: string
  score: number
  createdAt: Date
  user: {
    handle: string
  }
  votes: Array<{ id: string }>
  replies?: Comment[]
}

interface CommentListProps {
  comments: Comment[]
  isLoggedIn: boolean
  postId: string
}

interface CommentItemProps {
  comment: Comment
  isLoggedIn: boolean
  postId: string
  depth?: number
}

function CommentItem({ comment, isLoggedIn, postId, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const maxDepth = 2 // 0, 1, 2 = 3 levels total

  // Function to convert line breaks to paragraphs
  const formatComment = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim())
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    ))
  }

  const indentClass = depth === 0 ? '' : depth === 1 ? 'ml-8' : 'ml-16'
  const borderClass = depth > 0 ? 'border-l-2 border-gray-200 pl-4' : ''

  return (
    <div className={`${indentClass} ${borderClass}`}>
      <div className="bg-gray-50 p-3 rounded-md max-w-full overflow-hidden">
        <div className="flex items-start space-x-3">
          <CommentVoteButton
            commentId={comment.id}
            initialScore={comment.score}
            hasVoted={comment.votes.length > 0}
            isLoggedIn={isLoggedIn}
          />
          <div className="flex-1">
            <div className="text-gray-800 text-sm break-all overflow-wrap-anywhere hyphens-auto whitespace-pre-wrap max-w-full">
              {formatComment(comment.body)}
            </div>
            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
              <span>by {comment.user.handle}</span>
              <span>•</span>
              <span>
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {depth < maxDepth && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-blue-600 hover:underline"
                  >
                    {showReplyForm ? 'Cancel' : 'Reply'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {showReplyForm && (
          <div className="mt-3">
            <ReplyForm
              postId={postId}
              parentId={comment.id}
              isLoggedIn={isLoggedIn}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isLoggedIn={isLoggedIn}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentList({ comments, isLoggedIn, postId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isLoggedIn={isLoggedIn}
          postId={postId}
        />
      ))}
    </div>
  )
}
