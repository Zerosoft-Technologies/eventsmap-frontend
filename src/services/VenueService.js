import api from '@/services/api'

export default {
  /**
   * GET /api/v2/my-venues — same auth/axios pattern as eventService.getMyEvents()
   */
  async getMyVenues() {
    const response = await api.get('/v2/my-venues')
    return response.data
  },
}
