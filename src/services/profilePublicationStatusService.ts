import api from '@/services/api'

export type ProfilePublicationResource = 'events' | 'talents' | 'venues' | 'organisers'

export interface PatchProfileStatusResponse {
  success?: boolean
  message?: string
  data?: {
    status?: string
    status_label?: string
  }
}

export async function patchProfilePublicationStatus(
  resource: ProfilePublicationResource,
  id: number,
  status: string,
): Promise<PatchProfileStatusResponse> {
  const r = await api.patch(`/v2/${resource}/${id}/status`, { status })
  return r.data as PatchProfileStatusResponse
}
