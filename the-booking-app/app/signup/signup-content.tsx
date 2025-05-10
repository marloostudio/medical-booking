"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Remove useSearchParams and accept props directly
export function SignupContent({
  inviteCode = "",
  clinicId = "",
  redirectTo = "/dashboard",
}: {
  inviteCode?: string
  clinicId?: string
  redirectTo?: string
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Signup logic here
      console.log("Signing up with", email, name)

      // Redirect after successful signup
      router.push(redirectTo)
    } catch (err) {
      setError("Error creating account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="mt-2 text-sm text-gray-600">
          {inviteCode ? "Complete your registration" : "Sign up for a new account"}
        </p>
      </div>

      {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
          Already have an account? Log in
        </a>
      </div>
    </div>
  )
}
