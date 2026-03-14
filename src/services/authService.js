import api from './api'

const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  async login(data) {
    const res = await api.post('/auth/login', data)
    const { token, userId, username, email, role, fullName } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('username', username)
    localStorage.setItem('email', email)
    localStorage.setItem('role', role)
    localStorage.setItem('fullName', fullName || username)
    return res.data
  },

  logout() {
    localStorage.clear()
    window.location.href = '/login'
  },

  isLoggedIn() {
    return !!localStorage.getItem('token')
  },

  isAdmin() {
    return localStorage.getItem('role') === 'ADMIN'
  },

  getUser() {
    return {
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role'),
      fullName: localStorage.getItem('fullName'),
    }
  },
}

export default authService
