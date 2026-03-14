import React, { useState } from 'react'
import reviewService from '../services/reviewService'
import authService from '../services/authService'

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= rating ? ' filled' : ''}`}>★</span>
      ))}
    </span>
  )
}

export default function ReviewCard({ review, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [votes, setVotes] = useState(review.helpfulVotes || 0)
  const isLoggedIn = authService.isLoggedIn()

  async function handleUpvote() {
    if (!isLoggedIn) return alert('Please login to upvote')
    setLoading(true)
    try {
      const res = await reviewService.upvote(review.id)
      setVotes(res.helpfulVotes)
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to upvote')
    } finally {
      setLoading(false)
    }
  }

  async function handleReport() {
    if (!isLoggedIn) return alert('Please login to report')
    const reason = prompt('Why are you reporting this review?')
    if (!reason) return
    try {
      await reviewService.report(review.id, reason)
      alert('Review reported. Thank you for helping keep TrustChain trustworthy.')
      if (onUpdate) onUpdate()
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to report')
    }
  }

  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : ''

  const statusColor = { ACTIVE: 'badge-green', FLAGGED: 'badge-yellow', REMOVED: 'badge-red' }

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="card-body">
        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
          <div className="flex items-center gap-1">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {(review.user?.username || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.user?.username || 'Anonymous'}</div>
              <div className="text-muted">{date}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Stars rating={review.rating} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{review.rating}/5</span>
            {review.isVerified && <span className="badge badge-green" style={{ marginLeft: '0.25rem' }}>✓</span>}
            {review.status !== 'ACTIVE' && (
              <span className={`badge ${statusColor[review.status] || 'badge-gray'}`}>{review.status}</span>
            )}
          </div>
        </div>

        {review.comment && (
          <p style={{ fontSize: '0.92rem', color: 'var(--gray-600)', marginBottom: '0.75rem', lineHeight: '1.6' }}>
            "{review.comment}"
          </p>
        )}

        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm" onClick={handleUpvote} disabled={loading}>
            👍 Helpful ({votes})
          </button>
          {isLoggedIn && (
            <button className="btn btn-sm" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
              onClick={handleReport}>
              ⚑ Report
            </button>
          )}
          {review.reportCount > 0 && (
            <span className="text-muted">⚠️ {review.reportCount} report{review.reportCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  )
}
