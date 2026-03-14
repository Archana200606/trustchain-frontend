import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = authService.isLoggedIn()
  const isAdmin = authService.isAdmin()
  const user = authService.getUser()

  function handleLogout() {
    authService.logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">🔗 TrustChain</Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>Home</NavLink>
          <NavLink to="/providers" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Providers</NavLink>

          {isLoggedIn && (
            <NavLink to="/add-provider" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              + Add Provider
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Admin
            </NavLink>
          )}

          {isLoggedIn ? (
            <>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginLeft: '0.5rem' }}>
                👤 {user.fullName || user.username}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Login</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: '0.25rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
