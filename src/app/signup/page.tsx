import { redirect } from "next/navigation"
import bcrypt from "bcrypt"

export default function SignupPage() {
  async function handleSignup(formData: FormData) {
    "use server"
    
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const handle = formData.get("handle") as string
    
    // TODO: Add database user creation logic here
    // For now, just hash password to test bcrypt
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("User would be created:", { email, handle, hashedPassword })
    
    // TODO: Redirect to home after successful signup
    redirect("/login")
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form action={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="handle" className="block text-sm font-medium text-gray-700">
            Handle (3-20 characters)
          </label>
          <input
            type="text"
            id="handle"
            name="handle"
            required
            minLength={3}
            maxLength={20}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
