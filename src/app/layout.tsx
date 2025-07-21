import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { auth, signOut } from '@/lib/auth'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SynBio News',
  description: 'Hacker News for Synthetic Biology',
}

async function Navigation() {
  const session = await auth()
  
  async function handleSignOut() {
    'use server'
    await signOut()
  }
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            SynBio News
          </Link>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/submit"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Submit
                </Link>
                <span className="text-gray-500">
                  Welcome, {session.user?.name}
                </span>
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
