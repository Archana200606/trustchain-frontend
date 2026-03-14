
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import providerService from '../services/providerService'
import ProviderCard from '../components/ProviderCard'
import authService from '../services/authService'

const CATEGORIES = ['ELECTRICIAN','PLUMBER','TUTOR','CARPENTER','PAINTER','MECHANIC','CLEANER','GARDENER','CHEF','NURSE','OTHER']

const ICONS = {
  ELECTRICIAN:'⚡',
  PLUMBER:'🔧',
  TUTOR:'📚',
  CARPENTER:'🪚',
  PAINTER:'🎨',
  MECHANIC:'🔩',
  CLEANER:'🧹',
  GARDENER:'🌱',
  CHEF:'👨‍🍳',
  NURSE:'💊',
  OTHER:'🛠️'
}

export default function Home() {

  const [topProviders, setTopProviders] = useState([])
  const [loading, setLoading] = useState(true)

  const isLoggedIn = authService.isLoggedIn()

  useEffect(() => {

    providerService.getAll()
      .then(data => {

        console.log("API response:", data)

        // Ensure we always work with an array
        const providers = Array.isArray(data)
          ? data
          : data.providers || []

        setTopProviders(providers.slice(0,3))

      })
      .catch(error => {
        console.error("Error fetching providers:", error)
        setTopProviders([])
      })
      .finally(() => {
        setLoading(false)
      })

  }, [])

  return (
    <div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
        color: '#fff',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}>

        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Find Trusted Local Service Providers
          </h1>

          <p style={{
            fontSize: '1.15rem',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: 1.7
          }}>
            TrustChain uses community ratings, verified reviews, and our unique Trust Score to help you find reliable electricians, plumbers, tutors and more.
          </p>

          <div className="flex gap-2" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>

            <Link
              to="/providers"
              className="btn btn-lg"
              style={{ background: '#fff', color: 'var(--primary)' }}
            >
              🔍 Browse Providers
            </Link>

            {!isLoggedIn && (
              <Link
                to="/register"
                className="btn btn-lg"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.4)'
                }}
              >
                Join Free →
              </Link>
            )}

          </div>

        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
        padding: '1.25rem 0'
      }}>

        <div className="container">

          <div className="flex justify-between flex-wrap gap-2" style={{ textAlign: 'center' }}>

            {[
              ['🔗','Trust Score','Community-verified reliability'],
              ['⭐','5-Star Reviews','From real local users'],
              ['🛡️','Moderated','Admin-reviewed flagged content']
            ].map(([icon,title,desc]) => (

              <div key={title} style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                <div style={{ fontWeight: 700 }}>{title}</div>
                <div className="text-muted">{desc}</div>
              </div>

            ))}

          </div>

        </div>
      </div>

      <div className="container page">

        {/* Categories */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          Browse by Category
        </h2>

        <div className="flex flex-wrap gap-1" style={{ marginBottom: '2.5rem' }}>

          {CATEGORIES.map(cat => (

            <Link
              key={cat}
              to={`/providers?category=${cat}`}
              className="btn btn-secondary"
              style={{ borderRadius: '9999px' }}
            >
              {ICONS[cat]} {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </Link>

          ))}

        </div>

        {/* Top Providers */}

        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Top Rated Providers
          </h2>

          <Link to="/providers" className="btn btn-secondary btn-sm">
            View All →
          </Link>

        </div>

        {loading ? (

          <div className="spinner" />

        ) : Array.isArray(topProviders) && topProviders.length > 0 ? (

          <div className="grid grid-3">

            {topProviders.map(p => (
              <ProviderCard key={p.id} provider={p} />
            ))}

          </div>

        ) : (

          <div className="empty-state">

            <div className="icon">🏘️</div>

            <p>
              No providers yet. 
              <Link to="/add-provider"> Add the first one!</Link>
            </p>

          </div>

        )}

        {/* How it works */}

        <div style={{ marginTop: '3.5rem', marginBottom: '1rem' }}>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            How TrustChain Works
          </h2>

          <div className="grid grid-3">

            {[
              ['1','Find','Search providers by category and location in your area.'],
              ['2','Review','Submit honest ratings after using a service.'],
              ['3','Trust','Our algorithm calculates a Trust Score from ratings, verifications & votes.']
            ].map(([num,title,desc]) => (

              <div key={num} className="card">

                <div className="card-body" style={{ textAlign: 'center' }}>

                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    margin: '0 auto 1rem'
                  }}>
                    {num}
                  </div>

                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                    {title}
                  </h3>

                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                    {desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}
