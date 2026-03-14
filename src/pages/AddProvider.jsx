import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import providerService from '../services/providerService'

const CATEGORIES = ['ELECTRICIAN','PLUMBER','TUTOR','CARPENTER','PAINTER','MECHANIC','CLEANER','GARDENER','CHEF','NURSE','OTHER']

export default function AddProvider() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', category: 'ELECTRICIAN', location: '',
    description: '', phone: '', email: '', yearsExperience: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const payload = { ...form, yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : null }
      const provider = await providerService.add(payload)
      navigate(`/providers/${provider.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add provider.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container page">
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <h1 className="page-title">Add a Provider</h1>
        <p className="page-subtitle">Know a great local professional? Add them to TrustChain.</p>

        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Provider / Business Name *</label>
                <input className="form-control" name="name" value={form.name}
                  onChange={handleChange} placeholder="e.g. John's Electric Co." required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input className="form-control" name="location" value={form.location}
                    onChange={handleChange} placeholder="City, State" required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" value={form.description}
                  onChange={handleChange} rows={3} placeholder="Brief description of services offered…" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="555-0100" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="contact@example.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input className="form-control" type="number" name="yearsExperience" value={form.yearsExperience}
                  onChange={handleChange} placeholder="e.g. 5" min={0} max={60} />
              </div>

              <div className="flex gap-1" style={{ marginTop: '0.5rem' }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Adding…' : '+ Add Provider'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
