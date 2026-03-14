
import api from './api'

const providerService = {

  async getAll(category, location) {

    const params = {}

    if (category) params.category = category
    if (location) params.location = location

    const res = await api.get('/providers', { params })

    const data = res.data

    // Ensure always an array
    if (Array.isArray(data)) return data
    if (Array.isArray(data.providers)) return data.providers
    if (Array.isArray(data.data)) return data.data

    return []
  },

  async getById(id) {
    const res = await api.get(`/providers/${id}`)
    return res.data
  },

  async add(data) {
    const res = await api.post('/providers', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/providers/${id}`, data)
    return res.data
  },

  async getCategories() {
    const res = await api.get('/providers/categories')
    return res.data
  }

}

export default providerService

