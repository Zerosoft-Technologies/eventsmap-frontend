import api from '@/services/api'

export default {
  /**
   * GET /api/v2/my-venues — same auth/axios pattern as eventService.getMyEvents()
   */
  /**
   * @param {import('axios').AxiosRequestConfig} [axiosConfig] e.g. `{ signal }` to cancel in-flight requests
   */
  async getMyVenues(axiosConfig = {}) {
    const response = await api.get('/v2/my-venues', axiosConfig)
    return response.data
  },
}
