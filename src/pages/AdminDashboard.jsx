import React, { useEffect, useState } from 'react'
import api from '../services/api'
import reviewService from '../services/reviewService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [providers, setProviders] = useState([])
  const [flagged, setFlagged] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function loadAll() {
    setLoading(true)
    try {
      const [s, p, f, u] = await Promise.all([
        api.get('/admin/dashboard').then(r => r.data),
        api.get('/admin/providers').then(r => r.data),
        reviewService.getFlagged(),
        api.get('/admin/users').then(r => r.data),
      ])
      setStats(s); setProviders(p); setFlagged(f); setUsers(u)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll() }, [])

  async function updateProviderStatus(id, status) {
    try {
      await api.put(`/admin/providers/${id}/status`, { status })
      setMsg(`Provider status updated to ${status}`)
      loadAll()
    } catch (e) { setMsg('Error: ' + (e.response?.data?.error || 'Failed')) }
  }

  async function moderateReview(id, action) {
    try {
      await reviewService.moderate(id, action)
      setMsg(`Review ${action.toLowerCase()}d successfully`)
      loadAll()
    } catch (e) { setMsg('Error: ' + (e.response?.data?.error || 'Failed')) }
  }

  async function toggleUser(id) {
    try {
      const r = await api.put(`/admin/users/${id}/status`)
      setMsg(r.data.message)
      loadAll()
    } catch (e) { setMsg('Error updating user') }
  }

  if (loading) return <div className="container page"><div className="spinner" /></div>

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'providers', label: `🏢 Providers (${providers.length})` },
    { key: 'reviews', label: `🚩 Flagged (${flagged.length})` },
    { key: 'users', label: `👥 Users (${users.length})` },
  ]

  return (
    <div className="container page">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage providers, reviews, and users across TrustChain.</p>

      {msg && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          {msg} <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMsg('')}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1" style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="btn"
            style={{ borderRadius: '8px 8px 0 0', borderBottom: tab === t.key ? '3px solid var(--primary)' : '3px solid transparent',
              background: tab === t.key ? 'var(--primary-light)' : 'none', color: tab === t.key ? 'var(--primary)' : 'var(--gray-600)',
              fontWeight: tab === t.key ? 700 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && stats && (
        <div className="grid grid-3">
          {[
            ['👥', stats.totalUsers, 'Total Users', 'badge-blue'],
            ['🏢', stats.totalProviders, 'Total Providers', 'badge-blue'],
            ['📝', stats.totalReviews, 'Total Reviews', 'badge-blue'],
            ['✅', stats.activeProviders, 'Active Providers', 'badge-green'],
            ['🚩', stats.flaggedReviews, 'Flagged Reviews', stats.flaggedReviews > 0 ? 'badge-red' : 'badge-green'],
            ['⏳', stats.pendingProviders, 'Pending Providers', stats.pendingProviders > 0 ? 'badge-yellow' : 'badge-green'],
          ].map(([icon, val, label, badge]) => (
            <div key={label} className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{val}</div>
                <div><span className={`badge ${badge}`}>{label}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Providers */}
      {tab === 'providers' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                  {['ID','Name','Category','Location','Trust Score','Status','Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--gray-600)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {providers.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--gray-400)' }}>#{p.id}</td>
                    <td style={{ padding: '0.7rem 1rem', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '0.7rem 1rem' }}><span className="badge badge-blue">{p.category}</span></td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--gray-600)' }}>📍 {p.location}</td>
                    <td style={{ padding: '0.7rem 1rem', fontWeight: 700 }}>{p.trustScore?.toFixed(2)}</td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <span className={`badge ${p.status === 'ACTIVE' ? 'badge-green' : p.status === 'PENDING' ? 'badge-yellow' : 'badge-red'}`}>{p.status}</span>
                    </td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <div className="flex gap-1">
                        {p.status !== 'ACTIVE' && <button className="btn btn-success btn-sm" onClick={() => updateProviderStatus(p.id, 'ACTIVE')}>Activate</button>}
                        {p.status !== 'SUSPENDED' && <button className="btn btn-danger btn-sm" onClick={() => updateProviderStatus(p.id, 'SUSPENDED')}>Suspend</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flagged Reviews */}
      {tab === 'reviews' && (
        flagged.length === 0 ? (
          <div className="empty-state"><div className="icon">✅</div><p>No flagged reviews. Community looks healthy!</p></div>
        ) : (
          flagged.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-body">
                <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Review #{r.id}</span>
                    <span className="text-muted" style={{ marginLeft: '0.5rem' }}>by {r.user?.username}</span>
                    <span className="text-muted" style={{ marginLeft: '0.5rem' }}>for Provider #{r.provider?.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`badge ${r.status === 'ACTIVE' ? 'badge-green' : r.status === 'FLAGGED' ? 'badge-yellow' : 'badge-red'}`}>{r.status}</span>
                    <span className="badge badge-red">⚠️ {r.reportCount} reports</span>
                  </div>
                </div>
                <div style={{ margin: '0.5rem 0', color: 'var(--gray-600)', fontStyle: 'italic' }}>
                  "{r.comment || 'No comment'}" — Rating: {r.rating}/5
                </div>
                <div className="flex gap-1">
                  <button className="btn btn-success btn-sm" onClick={() => moderateReview(r.id, 'APPROVE')}>✓ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => moderateReview(r.id, 'REMOVE')}>✕ Remove</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => moderateReview(r.id, 'FLAG')}>⚑ Flag</button>
                </div>
              </div>
            </div>
          ))
        )
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                  {['ID','Username','Email','Role','Status','Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--gray-600)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--gray-400)' }}>#{u.id}</td>
                    <td style={{ padding: '0.7rem 1rem', fontWeight: 600 }}>{u.username}</td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--gray-600)' }}>{u.email}</td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-blue' : 'badge-gray'}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>{u.active ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      {u.role !== 'ADMIN' && (
                        <button className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleUser(u.id)}>
                          {u.active ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
