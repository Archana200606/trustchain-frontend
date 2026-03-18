import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import providerService from '../services/providerService'
import reviewService from '../services/reviewService'
import ReviewCard from '../components/ReviewCard'
import authService from '../services/authService'

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= Math.round(rating || 0) ? ' filled' : ''}`}>★</span>
      ))}
    </span>
  )
}

const CATEGORY_ICONS = {
  ELECTRICIAN:'⚡',PLUMBER:'🔧',TUTOR:'📚',CARPENTER:'🪚',PAINTER:'🎨',
  MECHANIC:'🔩',CLEANER:'🧹',GARDENER:'🌱',CHEF:'👨‍🍳',NURSE:'💊',OTHER:'🛠️'
}

export default function ProviderDetails() {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const isLoggedIn = authService.isLoggedIn()

  async function loadData() {
    try {
      const [p, r] = await Promise.all([
        providerService.getById(id),
        reviewService.getByProvider(id)
      ])
      setProvider(p)
      setReviews(r)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

 useEffect(() => {
  console.log("PROVIDER ID:", id)
  loadData()
}, [id])

  if (loading) return <div className="container page"><div className="spinner" /></div>
  if (!provider) return <div className="container page"><div className="alert alert-error">Provider not found.</div></div>

  const score = provider.trustScore || 0
  const ringCls = score >= 4 ? 'trust-high' : score >= 2.5 ? 'trust-mid' : 'trust-low'
  const icon = CATEGORY_ICONS[provider.category] || '🛠️'

  return (
    <div className="container page">
      <Link to="/providers" style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>← Back to Providers</Link>

      <div className="card" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div className="flex gap-2 flex-wrap" style={{ alignItems: 'flex-start' }}>
            {/* Trust ring */}
            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div className={`trust-score-ring ${ringCls}`} style={{ width: 80, height: 80, fontSize: '1.4rem', margin: '0 auto' }}>
                {score.toFixed(1)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '0.3rem' }}>Trust Score</div>
            </div>

            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-1 flex-wrap" style={{ marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{provider.name}</h1>
                {provider.isVerified && <span className="badge badge-green">✓ Verified</span>}
                <span className={`badge ${provider.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>{provider.status}</span>
              </div>

              <div className="provider-meta">
                <span className="badge badge-blue">{icon} {provider.category}</span>
                <span className="text-muted">📍 {provider.location}</span>
                {provider.yearsExperience && <span className="text-muted">🏅 {provider.yearsExperience} yrs experience</span>}
              </div>

              {provider.description && (
                <p style={{ color: 'var(--gray-600)', marginTop: '0.75rem', lineHeight: 1.7 }}>{provider.description}</p>
              )}

              <div className="flex flex-wrap gap-2" style={{ marginTop: '1rem' }}>
                {provider.phone && <a href={`tel:${provider.phone}`} className="btn btn-secondary btn-sm">📞 {provider.phone}</a>}
                {provider.email && <a href={`mailto:${provider.email}`} className="btn btn-secondary btn-sm">✉️ {provider.email}</a>}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', minWidth: 200 }}>
              {[
                ['⭐', provider.averageRating?.toFixed(1) || '0.0', 'Avg Rating'],
                ['📝', provider.totalReviews, 'Total Reviews'],
                ['✅', provider.verifiedReviews, 'Verified Reviews'],
                ['👍', provider.helpfulVotes, 'Helpful Votes'],
              ].map(([icon, val, label]) => (
                <div key={label} className="card" style={{ padding: '0.75rem', textAlign: 'center', boxShadow: 'none', border: '1px solid var(--gray-200)' }}>
                  <div style={{ fontSize: '1.2rem' }}>{icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{val}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust score formula info */}
      <div className="alert alert-info" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
        <strong>Trust Score Formula:</strong> (avg rating × 0.6) + (verified reviews × 0.2) + (helpful votes × 0.2) — on a 0–5 scale
      </div>

      {/* Reviews */}
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Reviews ({reviews.length})</h2>
        {isLoggedIn ? (
          <Link to={`/providers/${id}/review`} className="btn btn-primary btn-sm">+ Write a Review</Link>
        ) : (
          <Link to="/login" className="btn btn-secondary btn-sm">Login to Review</Link>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💬</div>
          <p>No reviews yet. Be the first to share your experience!</p>
          {isLoggedIn && <Link to={`/providers/${id}/review`} className="btn btn-primary mt-2">Write Review</Link>}
        </div>
      ) : (
        reviews.map(r => <ReviewCard key={r.id} review={r} onUpdate={loadData} />)
      )}
    </div>
  )
}
