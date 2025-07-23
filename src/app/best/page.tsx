import { redirect } from 'next/navigation'

export default function BestPage() {
  // Redirect /best to /best/YYYY-MM-DD (current day)
  const today = new Date().toISOString().split('T')[0] // Gets YYYY-MM-DD format
  redirect(`/best/${today}`)
}
