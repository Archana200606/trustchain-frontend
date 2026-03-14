import api from './api'

const reviewService = {
  async getByProvider(providerId) {
    const res = await api.get(`/reviews/provider/${providerId}`)
    return res.data
  },

  async submit(data) {
    const res = await api.post('/reviews', data)
    return res.data
  },

  async upvote(reviewId) {
    const res = await api.post(`/reviews/${reviewId}/upvote`)
    return res.data
  },

  async report(reviewId, reason) {
    const res = await api.post(`/reviews/${reviewId}/report`, { reason })
    return res.data
  },

  // Admin
  async getFlagged() {
    const res = await api.get('/admin/reviews/flagged')
    return res.data
  },

  async moderate(reviewId, action) {
    const res = await api.put(`/admin/reviews/${reviewId}/moderate`, { action })
    return res.data
  },
}

export default reviewService
