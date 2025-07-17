"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-orange-500 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          HN-SynBio
        </Link>
        
        <div className="space-x-4">
          {status === "loading" && <span>Loading...</span>}
          
          {!session && status !== "loading" && (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
          
          {session && (
            <>
              <span>Welcome, {session.user?.name || session.user?.email}</span>
              <button 
                onClick={() => signOut()} 
                className="hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
