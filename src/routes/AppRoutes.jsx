import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Providers from '../pages/Providers'
import AddProvider from '../pages/AddProvider'
import ProviderDetails from '../pages/ProviderDetails'
import AddReview from '../pages/AddReview'
import AdminDashboard from '../pages/AdminDashboard'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/providers" element={<Providers />} />
      <Route path="/providers/:id" element={<ProviderDetails />} />
      <Route path="/add-provider" element={<PrivateRoute><AddProvider /></PrivateRoute>} />
      <Route path="/providers/:id/review" element={<PrivateRoute><AddReview /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
