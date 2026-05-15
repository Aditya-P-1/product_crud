import React, { createContext, useState, useEffect, useCallback } from 'react'
import authApi from '../api/authApi'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      setIsAuthenticated(false)
    }

    window.addEventListener('auth-logout', handleLogout)
    return () => window.removeEventListener('auth-logout', handleLogout)
  }, [])

  const register = useCallback(async (email, password) => {
    try {
      setError(null)
      const response = await authApi.register(email, password)
      const { token } = response.data.data

      authApi.setToken(token)
      setUser({ email })
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify({ email }))

      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      throw err
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      const response = await authApi.login(email, password)
      const { token } = response.data.data

      authApi.setToken(token)
      setUser({ email })
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify({ email }))

      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
