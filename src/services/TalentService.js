import api from '@/services/api'

export default {
  /**
   * GET /api/v2/my-talents — same auth/axios pattern as eventService.getMyEvents()
   */
  async getMyTalents() {
    const response = await api.get('/v2/my-talents')
    return response.data
  },
}
