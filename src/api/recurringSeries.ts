import api from '@/services/api'

export interface RecurrenceRules {
  weekdays?: number[]
  interval?: number
  day_of_month?: number
  month?: number
  event_template?: RecurringEventTemplate
}

export interface RecurringEventTemplate {
  title: string
  event_type?: string
  category_id: number
  address: string
  venue_name?: string
  latitude: number
  longitude: number
  start_time: string
  end_time: string
  description?: string
  invited_talents?: number[]
  invited_organisers?: number[]
  invited_venues?: number[]
}

export interface RecurringSeries {
  id: number
  organizer_id: number
  recurrence_type: string
  recurrence_rules: RecurrenceRules
  event_template?: RecurringEventTemplate
  source_event_id?: number | null
  timezone: string
  start_date: string
  end_date: string | null
  is_approved: boolean
  approved_at: string | null
  events_count?: number
  created_at: string
  updated_at: string
}

export interface RecurringSeriesPagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface RecurringSeriesListResponse {
  success: boolean
  message: string
  data: {
    series: RecurringSeries[]
    pagination: RecurringSeriesPagination
  }
}

export interface RecurringSeriesResponse {
  success: boolean
  message: string
  data: RecurringSeries
  lifecycle?: LifecycleStats
}

export interface RecurringSeriesPayload {
  recurrence_type: string
  recurrence_rules: RecurrenceRules
  timezone: string
  start_date: string
  end_date?: string | null
  source_event_id?: number
  event_template?: RecurringEventTemplate
}

export interface RecurringEventSourceSummary {
  id: number
  title: string
  event_date?: string | null
  start_time?: string | null
  end_time?: string | null
  category?: { id: number; name: string } | null
}

export interface RecurringEventTemplateResponse {
  success: boolean
  message: string
  data: {
    source_event: RecurringEventSourceSummary
    event_template: RecurringEventTemplate
  }
}

export interface RecurringSeriesUpdatePayload extends Partial<RecurringSeriesPayload> {
  apply_to_future?: boolean
}

export interface RecurringSeriesUpdateResponse extends RecurringSeriesResponse {
  generation?: GenerationStats | null
  propagation?: PropagationStats | null
  generation_queued?: boolean
}

export interface LifecycleStats {
  deleted: number
  cancelled: number
  skipped_past: number
  skipped_already_handled: number
  notified: number
  series_processed?: number
}

export interface PropagationStats {
  updated: number
  removed: number
  skipped_modified: number
  skipped_past: number
  generation: GenerationStats
}

export interface GenerationStats {
  created: number
  skipped_existing: number
  skipped_past: number
  total_candidates: number
}

export const recurringSeriesApi = {
  async getEventTemplate(eventId: number): Promise<RecurringEventTemplateResponse> {
    const { data } = await api.get(`/v2/recurring-series/event-templates/${eventId}`)
    return data
  },

  async list(params: {
    page?: number
    per_page?: number
    recurrence_type?: string
  } = {}): Promise<RecurringSeriesListResponse> {
    const { data } = await api.get('/v2/recurring-series', { params })
    return data
  },

  async get(id: number): Promise<RecurringSeriesResponse> {
    const { data } = await api.get(`/v2/recurring-series/${id}`)
    return data
  },

  async create(payload: RecurringSeriesPayload): Promise<RecurringSeriesUpdateResponse> {
    const { data } = await api.post('/v2/recurring-series', payload)
    return data
  },

  async update(id: number, payload: RecurringSeriesUpdatePayload): Promise<RecurringSeriesUpdateResponse> {
    const { data } = await api.put(`/v2/recurring-series/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<{ success: boolean; message: string; lifecycle?: LifecycleStats }> {
    const { data } = await api.delete(`/v2/recurring-series/${id}`, { data: { confirm: true } })
    return data
  },

  async cancel(id: number): Promise<{ success: boolean; message: string; lifecycle?: LifecycleStats }> {
    const { data } = await api.post(`/v2/recurring-series/${id}/cancel`, { confirm: true })
    return data
  },

  async regenerate(id: number): Promise<RecurringSeriesResponse & { generation?: GenerationStats | null }> {
    const { data } = await api.post(`/v2/recurring-series/${id}/regenerate`)
    return data
  },
}
