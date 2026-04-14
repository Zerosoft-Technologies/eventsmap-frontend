import api from '@/services/api'

export default {
  /**
   * GET /api/v2/my-talents — same auth/axios pattern as eventService.getMyEvents()
   */
  /**
   * @param {import('axios').AxiosRequestConfig} [axiosConfig] e.g. `{ signal }` to cancel in-flight requests
   */
  async getMyTalents(axiosConfig = {}) {
    const response = await api.get('/v2/my-talents', axiosConfig)
    return response.data
  },
}
