import axiosInstance from './axios'

const authApi = {
  register: (email, password) => {
    return axiosInstance.post('/auth/register', {
      email,
      password,
    })
  },

  login: (email, password) => {
    return axiosInstance.post('/auth/login', {
      email,
      password,
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  setToken: (token) => {
    localStorage.setItem('token', token)
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}

export default authApi
