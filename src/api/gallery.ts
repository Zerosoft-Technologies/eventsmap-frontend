import api from '@/services/api'

export interface GalleryImage {
  id: number
  image_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  image_alt_text: string | null
  upload_date: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  image_url: string
}

export interface GalleryPagination {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export interface GalleryResponse {
  status: string
  data: {
    images: GalleryImage[]
    pagination: GalleryPagination
  }
}

export interface UploadResponse {
  status: string
  message: string
  data: GalleryImage
}

export interface DeleteResponse {
  status: string
  message: string
}

export const galleryApi = {
  /**
   * Fetch gallery images with pagination
   */
  async fetchImages(page: number = 1, perPage: number = 10): Promise<GalleryResponse> {
    const { data } = await api.get(`/gallery-images`, {
      params: { page, per_page: perPage }
    })
    return data
  },

  /**
   * Upload a new image with optional alt text and event_id
   */
  async uploadImage(
    file: File,
    altText?: string,
    eventId?: number,
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('image', file)
    if (altText) formData.append('alt_text', altText)
    if (eventId) formData.append('event_id', String(eventId))

    const { data } = await api.post('/gallery-images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      }
    })
    return data
  },

  /**
   * Delete an image by its UUID (image_id, NOT database id)
   */
  async deleteImage(imageId: string): Promise<DeleteResponse> {
    const { data } = await api.delete(`/gallery-images/${imageId}`)
    return data
  }
}
