import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                SynBio News
              </Link>
              <p className="text-sm text-gray-600 mt-1">Submit a new post</p>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit a Post</h1>
            <p className="text-gray-600 mb-8">Share something interesting with the SynBio community.</p>
            
            <form action={createPost} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={80}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter a descriptive title (max 80 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">Keep it clear and engaging</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  maxLength={500}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-vertical"
                  placeholder="Describe what you're sharing and why it's interesting (max 500 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">Provide context and explain why this matters</p>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL (optional)
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  pattern="https://.*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="https://example.com/article"
                />
                <p className="text-xs text-gray-500 mt-1">Link to an article, paper, or resource (must start with https://)</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                  >
                    Submit Post
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
