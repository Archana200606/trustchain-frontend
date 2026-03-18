import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import reviewService from '../services/reviewService'
import providerService from '../services/providerService'

export default function AddReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    providerService.getById(id).then(setProvider).catch(console.error)
  }, [id])

 async function handleSubmit(e) {
  e.preventDefault()

  if (!rating) { 
    setError('Please select a rating.')
    return 
  }

  setError('')
  setLoading(true)

  try {
    const data = {
      providerId: Number(id),
      rating,
      comment
    }

    console.log("SENDING:", data)

    const res = await reviewService.submit(data)

    console.log("SUCCESS:", res)

    navigate(`/providers/${Number(id)}`)

  } catch (err) {
    console.log("ERROR:", err.response?.data)

    setError(err.response?.data?.error || 'Failed to submit review.')
  } finally {
    setLoading(false)
  }
}
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="container page">
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <Link to={`/providers/${id}`} style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>← Back to Provider</Link>

        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">
            <h2 style={{ fontWeight: 700 }}>Write a Review</h2>
            {provider && <p className="text-muted">for <strong>{provider.name}</strong></p>}
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              {/* Star selector */}
              <div className="form-group">
                <label>Your Rating *</label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.35rem' }}>
                  {[1,2,3,4,5].map(n => (
                    <span key={n}
                      style={{ fontSize: '2.2rem', cursor: 'pointer', color: n <= (hovered || rating) ? '#f59e0b' : '#e5e7eb', transition: 'color 0.1s' }}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHovered(n)}
                      onMouseLeave={() => setHovered(0)}>
                      ★
                    </span>
                  ))}
                  {(hovered || rating) > 0 && (
                    <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: 'var(--warning)', fontSize: '1rem' }}>
                      {labels[hovered || rating]}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea className="form-control" value={comment} onChange={e => setComment(e.target.value)}
                  rows={5} placeholder="Share your experience. How was the quality, professionalism, and value?" />
                <div className="text-muted" style={{ marginTop: '0.25rem' }}>{comment.length}/1000</div>
              </div>

              <div className="flex gap-1">
                <button className="btn btn-primary" type="submit" disabled={loading || !rating}>
                  {loading ? 'Submitting…' : 'Submit Review'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          💡 Your review helps the community. Verified reviews carry extra weight in the Trust Score calculation.
        </div>
      </div>
    </div>
  )
}
