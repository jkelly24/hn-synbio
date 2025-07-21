import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function createPost(formData: FormData) {
  'use server'
  
  const session = await auth()
  console.log('Session in server action:', session)
  console.log('User ID:', session?.user?.id)
  
  if (!session?.user?.id) {
    throw new Error('You must be logged in to submit a post')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const url = formData.get('url') as string

  if (!title || !description) {
    throw new Error('Title and description are required')
  }

  if (title.length > 80) {
    throw new Error('Title must be 80 characters or less')
  }

  if (description.length > 500) {
    throw new Error('Description must be 500 characters or less')
  }

  if (url && !url.startsWith('https://')) {
    throw new Error('URL must start with https://')
  }

  try {
    await prisma.post.create({
      data: {
        title,
        description,
        url: url || null,
        userId: session.user.id,
      },
    })
  } catch (error) {
    throw new Error('Failed to create post')
  }

  redirect('/')
}

export default async function SubmitPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Submit a Post</h1>
      
      <form action={createPost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={80}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title (max 80 characters)"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your post (max 500 characters)"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-2">
            URL (optional)
          </label>
          <input
            type="url"
            id="url"
            name="url"
            pattern="https://.*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Post
        </button>
      </form>
    </div>
  )
}
