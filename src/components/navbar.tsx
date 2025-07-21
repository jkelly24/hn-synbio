import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-orange-600">
              SynBio News
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <span className="text-gray-700">
                  Welcome, {session.user.name}
                </span>
                <form action={async () => {
                  'use server'
                  await signOut()
                }}>
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}