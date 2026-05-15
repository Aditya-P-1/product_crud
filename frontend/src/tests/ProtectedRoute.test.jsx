import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../api/authApi', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}))

describe('ProtectedRoute', () => {
  const TestContent = () => <div>Protected Content</div>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should show protected content when authenticated', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token'
      if (key === 'user') return '{"email":"test@example.com"}'
      return null
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <TestContent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  it('should not show protected content when not authenticated after bootstrap', async () => {
    localStorage.getItem.mockReturnValue(null)

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <TestContent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })
})
