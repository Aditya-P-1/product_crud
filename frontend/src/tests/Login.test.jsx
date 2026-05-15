import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { AuthProvider } from '../context/AuthContext'
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
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderLogin = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('should render login form', () => {
    renderLogin()

    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  it('should display validation error for empty fields', async () => {
    renderLogin()

    const loginButton = screen.getByRole('button', { name: /Login/i })
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Email and password are required')).toBeInTheDocument()
    })
  })

  it('should call login API with correct credentials', async () => {
    authApi.login.mockResolvedValueOnce({
      data: {
        data: {
          token: 'test-token',
        },
      },
    })

    renderLogin()

    const emailInput = screen.getByPlaceholderText('Enter Email')
    const passwordInput = screen.getByPlaceholderText('Enter Password')
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should display error message on login failure', async () => {
    const errorMessage = 'Invalid credentials'
    authApi.login.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    })

    renderLogin()

    const emailInput = screen.getByPlaceholderText('Enter Email')
    const passwordInput = screen.getByPlaceholderText('Enter Password')
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')
    await userEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should disable button while loading', async () => {
    authApi.login.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    renderLogin()

    const emailInput = screen.getByPlaceholderText('Enter Email')
    const passwordInput = screen.getByPlaceholderText('Enter Password')
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(loginButton)

    expect(loginButton).toBeDisabled()
  })

  it('should have link to signup page', () => {
    renderLogin()

    const signupLink = screen.getByRole('link', { name: /Sign up/i })
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
})
