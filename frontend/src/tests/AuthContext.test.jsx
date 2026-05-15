import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../context/AuthContext'
import authApi from '../api/authApi'

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

function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should start with no authentication', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Not authenticated')).toBeInTheDocument()
  })

  it('should login successfully', async () => {
    const mockToken = 'test-token'
    authApi.login.mockResolvedValueOnce({
      data: {
        data: {
          token: mockToken,
        },
      },
    })

    const LoginComponent = () => {
      const { login } = useAuth()

      return (
        <button
          onClick={() => login('test@example.com', 'password123')}
        >
          Login
        </button>
      )
    }

    render(
      <AuthProvider>
        <div>
          <LoginComponent />
          <TestComponent />
        </div>
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(/Welcome test@example.com/)).toBeInTheDocument()
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should logout successfully', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token'
      if (key === 'user') return JSON.stringify({ email: 'test@example.com' })
      return null
    })

    const LogoutComponent = () => {
      const { logout } = useAuth()
      return (
        <button type="button" onClick={logout}>
          Sign out
        </button>
      )
    }

    render(
      <AuthProvider>
        <div>
          <LogoutComponent />
          <TestComponent />
        </div>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Welcome test@example.com/)).toBeInTheDocument()
    })

    const logoutButton = screen.getByRole('button', { name: /Sign out/i })
    await userEvent.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument()
    })

    expect(authApi.logout).toHaveBeenCalled()
  })

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials'
    authApi.login.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    })

    const LoginComponent = () => {
      const { login, error } = useAuth()

      return (
        <div>
          <button
            type="button"
            onClick={async () => {
              try {
                await login('test@example.com', 'wrongpassword')
              } catch {
                // Error is surfaced through context `error`
              }
            }}
          >
            Login
          </button>
          {error && <p>{error}</p>}
        </div>
      )
    }

    render(
      <AuthProvider>
        <LoginComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
})
