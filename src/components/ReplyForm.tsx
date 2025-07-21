'use client'

import { addReply } from '@/lib/actions/posts'
import { useState } from 'react'

interface ReplyFormProps {
  postId: string
  parentId: string
  isLoggedIn: boolean
  onCancel: () => void
}

export default function ReplyForm({ postId, parentId, isLoggedIn, onCancel }: ReplyFormProps) {
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!isLoggedIn) {
      alert('Please log in to reply')
      return
    }

    if (!body.trim()) {
      setError('Reply cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await addReply(postId, parentId, body)
      setBody('')
      onCancel() // Close the reply form after successful submission
    } catch (error: any) {
      setError(error.message || 'Failed to add reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="text-sm text-gray-500 italic">
        Log in to reply
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3 p-3 bg-white border border-gray-200 rounded-md">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a reply..."
          className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={3}
          disabled={isSubmitting}
          autoFocus
        />
        {error && (
          <div className="mt-1">
            <span className="text-xs text-red-500">{error}</span>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? 'Replying...' : 'Reply'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
