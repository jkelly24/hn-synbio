import { auth } from '@/lib/auth'

// Hardcoded admin emails for MVP
const ADMIN_EMAILS = [
  'jk@jojokelly.com', // Replace with your actual email
  'admin@synbio.com'        // Add other admin emails here
]

export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.email) {
    return false
  }
  return ADMIN_EMAILS.includes(session.user.email)
}

export function isEmailAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}
