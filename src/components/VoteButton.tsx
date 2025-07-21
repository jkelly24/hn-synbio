'use client'

import { toggleVote } from '@/lib/actions/posts'
import { useState } from 'react'

interface VoteButtonProps {
  postId: string
  initialScore: number
  hasVoted: boolean
  isLoggedIn: boolean
}

export default function VoteButton({ postId, initialScore, hasVoted, isLoggedIn }: VoteButtonProps) {
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
      await toggleVote(postId)
      
      // Optimistic update
      if (voted) {
        setScore(score - 1)
        setVoted(false)
      } else {
        setScore(score + 1)
        setVoted(true)
      }
    } catch (error) {
      console.error('Vote failed:', error)
      alert('Failed to vote. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={`text-lg font-bold px-2 py-1 rounded transition-colors ${
          voted
            ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
            : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        ▲
      </button>
      <span className="text-sm font-medium text-gray-600">{score}</span>
    </div>
  )
}
