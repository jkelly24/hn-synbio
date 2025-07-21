'use client'

import { useState } from 'react'

interface DeleteButtonProps {
  type: 'post' | 'comment'
  id: string
  onDeleted?: () => void
}

export default function DeleteButton({ type, id, onDeleted }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        alert(`Failed to delete ${type}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Failed to delete ${type}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
