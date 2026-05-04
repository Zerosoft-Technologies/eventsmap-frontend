import api from '@/services/api'

export type ProfilePublicationResource = 'events' | 'talents' | 'venues' | 'organisers'

export interface PatchProfileStatusResponse {
  success?: boolean
  message?: string
  data?: {
    publish_status?: string
    status?: string
    status_label?: string
  }
}

export async function patchProfilePublicationStatus(
  resource: ProfilePublicationResource,
  id: number,
  status: string,
): Promise<PatchProfileStatusResponse> {
  const r = await api.patch(`/v2/${resource}/${id}/publish-status`, { publish_status: status })
  return r.data as PatchProfileStatusResponse
}
