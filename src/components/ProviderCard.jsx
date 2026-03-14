import React from 'react'
import { Link } from 'react-router-dom'

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= Math.round(rating) ? ' filled' : ''}`}>★</span>
      ))}
    </span>
  )
}

function TrustRing({ score }) {
  const cls = score >= 4 ? 'trust-high' : score >= 2.5 ? 'trust-mid' : 'trust-low'
  return <div className={`trust-score-ring ${cls}`}>{score?.toFixed(1) ?? '0.0'}</div>
}

const CATEGORY_ICONS = {
  ELECTRICIAN: '⚡', PLUMBER: '🔧', TUTOR: '📚', CARPENTER: '🪚',
  PAINTER: '🎨', MECHANIC: '🔩', CLEANER: '🧹', GARDENER: '🌱',
  CHEF: '👨‍🍳', NURSE: '💊', OTHER: '🛠️'
}

export default function ProviderCard({ provider }) {
  const icon = CATEGORY_ICONS[provider.category] || '🛠️'
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-body" style={{ flex: 1 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
          <TrustRing score={provider.trustScore} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>{provider.name}</h3>
            <div className="provider-meta">
              <span className="badge badge-blue">{icon} {provider.category}</span>
              {provider.isVerified && <span className="badge badge-green">✓ Verified</span>}
            </div>
          </div>
        </div>

        <div className="text-muted" style={{ marginBottom: '0.5rem' }}>📍 {provider.location}</div>

        {provider.description && (
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '0.75rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {provider.description}
          </p>
        )}

        <div className="flex items-center gap-1" style={{ marginBottom: '0.25rem' }}>
          <Stars rating={provider.averageRating} />
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
            {provider.averageRating?.toFixed(1) ?? '0.0'} ({provider.totalReviews} reviews)
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
          👍 {provider.helpfulVotes} helpful votes · ✅ {provider.verifiedReviews} verified reviews
        </div>
      </div>

      <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
        <Link to={`/providers/${provider.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
          View Profile →
        </Link>
      </div>
    </div>
  )
}
