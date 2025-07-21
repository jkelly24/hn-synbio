'use client'

import { addComment } from '@/lib/actions/posts'
import { useState } from 'react'

interface CommentFormProps {
  postId: string
  isLoggedIn: boolean
}

export default function CommentForm({ postId, isLoggedIn }: CommentFormProps) {
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!isLoggedIn) {
      alert('Please log in to comment')
      return
    }

    if (!body.trim()) {
      setError('Comment cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await addComment(postId, body)
      setBody('')
    } catch (error: any) {
      setError(error.message || 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="text-sm text-gray-500 italic">
        Log in to join the discussion
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment... (Press Enter twice for paragraph breaks)"
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          disabled={isSubmitting}
        />
        {error && (
          <div className="mt-1">
            <span className="text-xs text-red-500">{error}</span>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !body.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  )
}
