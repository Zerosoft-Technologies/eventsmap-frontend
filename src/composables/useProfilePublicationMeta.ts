import { shallowRef } from 'vue'
import api from '@/services/api'

export type ProfilePublicationMeta = {
  labels: Record<string, string>
  sidebar_options: string[]
}

const DEFAULT_LABELS: Record<string, string> = {
  draft: 'Draft',
  upcoming: 'Upcoming',
  completed: 'Completed',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
}

const DEFAULT_SIDEBAR_OPTIONS = ['upcoming', 'completed', 'suspended', 'cancelled']

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
        let sidebarOptions = DEFAULT_SIDEBAR_OPTIONS
        if (Array.isArray(obj.sidebar_options) && obj.sidebar_options.length > 0) {
          sidebarOptions = obj.sidebar_options.map((s) => String(s))
        }
        sidebarOptions = sidebarOptions.filter((s) => String(s).toLowerCase() !== 'draft')
        meta.value = { labels, sidebar_options: sidebarOptions }
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
