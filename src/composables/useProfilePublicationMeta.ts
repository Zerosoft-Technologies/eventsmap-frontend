import { shallowRef } from 'vue'
import api from '@/services/api'

export type ProfilePublicationMeta = {
  labels: Record<string, string>
  sidebar_options: string[]
}

const DEFAULT_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Publish',
  upcoming: 'Upcoming',
  completed: 'Completed',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
}

/** Sidebar picker is fixed to Draft + Publish (Publish → API slug `published`). */
const DEFAULT_SIDEBAR_OPTIONS = ['draft', 'published']

const meta = shallowRef<ProfilePublicationMeta | null>(null)

let loadPromise: Promise<void> | null = null

export function useProfilePublicationMeta() {
  async function ensureLoaded(): Promise<void> {
    if (meta.value) return
    if (loadPromise) {
      await loadPromise
      return
    }
    loadPromise = (async () => {
      try {
        const r = await api.get('/v2/meta/profile-publication-statuses')
        const raw = (r.data as { data?: unknown })?.data ?? r.data
        const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
        const rawLabels = obj.labels
        const labels: Record<string, string> =
          rawLabels && typeof rawLabels === 'object'
            ? { ...DEFAULT_LABELS, ...(rawLabels as Record<string, string>) }
            : { ...DEFAULT_LABELS }
        meta.value = { labels, sidebar_options: [...DEFAULT_SIDEBAR_OPTIONS] }
      } catch {
        meta.value = {
          labels: { ...DEFAULT_LABELS },
          sidebar_options: [...DEFAULT_SIDEBAR_OPTIONS],
        }
      } finally {
        loadPromise = null
      }
    })()
    await loadPromise
  }

  return { meta, ensureLoaded }
}
