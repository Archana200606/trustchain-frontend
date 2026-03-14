import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await authService.login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="card">
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back</h1>
              <p className="text-muted">Sign in to your TrustChain account</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username or Email</label>
                <input className="form-control" name="usernameOrEmail" value={form.usernameOrEmail}
                  onChange={handleChange} placeholder="Enter username or email" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="Enter password" required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '0.5rem' }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          <strong>Demo Admin:</strong> username <code>admin</code> / password <code>admin123</code>
        </div>
      </div>
    </div>
  )
}
