import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username:'', email:'', password:'', fullName:'', phone:'', city:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      await authService.register(form)
      setSuccess('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div className="card">
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create your account</h1>
              <p className="text-muted">Join TrustChain to find and rate local services</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group">
                  <label>Username *</label>
                  <input className="form-control" name="username" value={form.username}
                    onChange={handleChange} placeholder="johndoe" required minLength={3} />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" name="fullName" value={form.fullName}
                    onChange={handleChange} placeholder="John Doe" />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input className="form-control" type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="john@example.com" required />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input className="form-control" type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="At least 6 characters" required minLength={6} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="555-0100" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" name="city" value={form.city}
                    onChange={handleChange} placeholder="New York" />
                </div>
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '0.5rem' }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
