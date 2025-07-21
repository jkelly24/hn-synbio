'use client'

import { toggleCommentVote } from '@/lib/actions/posts'
import { useState } from 'react'

interface CommentVoteButtonProps {
  commentId: string
  initialScore: number
  hasVoted: boolean
  isLoggedIn: boolean
}

export default function CommentVoteButton({ commentId, initialScore, hasVoted, isLoggedIn }: CommentVoteButtonProps) {
  const [score, setScore] = useState(initialScore)
  const [voted, setVoted] = useState(hasVoted)
  const [isLoading, setIsLoading] = useState(false)

  async function handleVote() {
    if (!isLoggedIn) {
      alert('Please log in to vote')
      return
    }

    setIsLoading(true)
    
    try {
      await toggleCommentVote(commentId)
      
      // Optimistic update
      if (voted) {
        setScore(score - 1)
        setVoted(false)
      } else {
        setScore(score + 1)
        setVoted(true)
      }
    } catch (error) {
      console.error('Comment vote failed:', error)
      alert('Failed to vote. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={`text-sm font-bold px-1 py-0.5 rounded transition-colors ${
          voted
            ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
            : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        ▲
      </button>
      <span className="text-xs font-medium text-gray-600">{score}</span>
    </div>
  )
}
