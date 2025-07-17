import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server"
    
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    if (result?.error) {
      // TODO: Handle login errors
      console.log("Login failed")
    } else {
      redirect("/")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form action={handleLogin} className="space-y-4">
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  )
}
