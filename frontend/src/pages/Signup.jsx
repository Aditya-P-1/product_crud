import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required")
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        setLoading(false)
        return
      }

      await register(formData.email, formData.password)
      navigate("/")
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-[350px]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Signup
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          disabled={loading}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          disabled={loading}
        />

        <button type="submit" disabled={loading} className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:bg-green-300">
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-500 ml-1"
          >
            Login
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Back to home
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup