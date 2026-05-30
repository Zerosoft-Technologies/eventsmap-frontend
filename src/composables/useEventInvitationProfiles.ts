import { ref, computed, watch, type Ref } from 'vue'
import {
  fetchEventInvitationProfiles,
  fetchInvitationProfiles,
  inviteRoleToApiType,
  type InvitationProfile,
} from '@/api/invitationProfiles'

type InviteRoleKey = 'talent' | 'organizer' | 'venue'

function normalizeInviteRole(role: string): InviteRoleKey | string {
  const r = String(role ?? '').toLowerCase().trim()
  if (r === 'organiser') return 'organizer'
  if (r === 'talent' || r === 'venue' || r === 'organizer') return r
  return r
}

function roleKeyFromApiType(apiType: string): InviteRoleKey | null {
  const t = apiType.toLowerCase().trim()
  if (t === 'talent') return 'talent'
  if (t === 'venue') return 'venue'
  if (t === 'organiser' || t === 'organizer') return 'organizer'
  return null
}

function emptyRoleLists(): Record<InviteRoleKey, InvitationProfile[]> {
  return { talent: [], organizer: [], venue: [] }
}

export function useEventInvitationProfiles(eventId: Ref<number | string | null | undefined>) {
  const profileById = ref<Map<number, InvitationProfile>>(new Map())
  const listsByRole = ref<Record<InviteRoleKey, InvitationProfile[]>>(emptyRoleLists())
  const loading = ref(false)
  const loadingByRole = ref<Record<InviteRoleKey, boolean>>({
    talent: false,
    organizer: false,
    venue: false,
  })
  const error = ref<string | null>(null)

  /** Keys: `${scope}:${apiProfileType}:${search}` — empty search is cached per role. */
  const fetchedKeys = new Set<string>()
  let searchTimer: ReturnType<typeof setTimeout> | null = null

  function scopeId(): string {
    const id = eventId.value
    return id != null && id !== '' ? String(id) : 'create'
  }

  function cacheKey(apiType: string, search: string): string {
    return `${scopeId()}:${apiType}:${search.trim().toLowerCase()}`
  }

  function mergeProfiles(incoming: InvitationProfile[]) {
    if (!incoming.length) return
    const next = new Map(profileById.value)
    for (const p of incoming) next.set(p.id, p)
    profileById.value = next
  }

  function assignRoleList(role: InviteRoleKey, list: InvitationProfile[]) {
    listsByRole.value = { ...listsByRole.value, [role]: list }
  }

  function splitAndAssignRoleLists(profiles: InvitationProfile[]) {
    const next = emptyRoleLists()
    for (const p of profiles) {
      const rk = normalizeInviteRole(p.profile_type)
      if (rk === 'talent' || rk === 'organizer' || rk === 'venue') {
        next[rk].push(p)
      }
    }
    for (const rk of Object.keys(next) as InviteRoleKey[]) {
      next[rk].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    }
    listsByRole.value = next
  }

  function invalidateCache() {
    fetchedKeys.clear()
    profileById.value = new Map()
    listsByRole.value = emptyRoleLists()
  }

  watch(eventId, () => {
    invalidateCache()
  })

  async function load(options: { search?: string; profile_type?: string } = {}) {
    const profileType = options.profile_type ?? 'talent,organiser,venue'
    const search = options.search?.trim() ?? ''
    const key = cacheKey(profileType, search)

    if (!search && fetchedKeys.has(key)) {
      return
    }

    const singleRole = !profileType.includes(',')
    const roleKey = singleRole ? roleKeyFromApiType(profileType) : null
    if (singleRole && roleKey) {
      loadingByRole.value = { ...loadingByRole.value, [roleKey]: true }
    } else {
      loading.value = true
    }
    error.value = null
    try {
      const id = eventId.value
      let data: InvitationProfile[]

      if (id != null && id !== '') {
        data = await fetchEventInvitationProfiles(id, {
          exclude_invited: true,
          search: search || undefined,
          profile_type: profileType,
        })
      } else {
        data = await fetchInvitationProfiles({
          exclude_self: true,
          search: search || undefined,
          profile_type: profileType,
        })
      }

      mergeProfiles(data)

      if (!search) {
        if (profileType.includes(',')) {
          splitAndAssignRoleLists(data)
        } else {
          const rk = roleKeyFromApiType(profileType)
          if (rk) assignRoleList(rk, data)
        }
        fetchedKeys.add(key)
      } else {
        const rk = roleKeyFromApiType(profileType)
        if (rk) assignRoleList(rk, data)
      }
    } catch (e) {
      console.error('Failed to load invitation profiles:', e)
      error.value = e instanceof Error ? e.message : 'Could not load profiles'
    } finally {
      if (singleRole && roleKey) {
        loadingByRole.value = { ...loadingByRole.value, [roleKey]: false }
      } else {
        loading.value = false
      }
    }
  }

  function roleLoading(role: string): boolean {
    const rk = normalizeInviteRole(role)
    if (rk === 'talent' || rk === 'organizer' || rk === 'venue') {
      return loadingByRole.value[rk]
    }
    return loading.value
  }

  /** Open picker: fetch once per role (empty search) until event scope changes. */
  function ensureRoleLoaded(role: string, search = '') {
    const apiType = inviteRoleToApiType(role)
    return load({ profile_type: apiType, search })
  }

  /** Bypass cache and reload profiles for one role from the API. */
  function refetchRole(role: string) {
    const apiType = inviteRoleToApiType(role)
    fetchedKeys.delete(cacheKey(apiType, ''))
    return load({ profile_type: apiType, search: '' })
  }

  function loadForRole(role: string, search = '') {
    return ensureRoleLoaded(role, search)
  }

  function debouncedSearch(role: string, query: string, delayMs = 350) {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      ensureRoleLoaded(role, query)
    }, delayMs)
  }

  const allProfiles = computed(() =>
    Array.from(profileById.value.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    ),
  )

  const talentProfiles = computed(() => listsByRole.value.talent)
  const organiserProfiles = computed(() => listsByRole.value.organizer)
  const venueProfiles = computed(() => listsByRole.value.venue)

  /** Pre-fill registry from event invited_*_objects (edit mode). */
  function seedProfiles(incoming: InvitationProfile[]) {
    if (!incoming.length) return
    mergeProfiles(incoming)
    const next = { ...listsByRole.value }
    for (const p of incoming) {
      const rk = normalizeInviteRole(p.profile_type)
      if (rk !== 'talent' && rk !== 'organizer' && rk !== 'venue') continue
      const list = [...next[rk]]
      if (!list.some((x) => x.id === p.id)) list.push(p)
      list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      next[rk] = list
    }
    listsByRole.value = next
  }

  return {
    profiles: allProfiles,
    allProfiles,
    talentProfiles,
    organiserProfiles,
    venueProfiles,
    loading,
    loadingByRole,
    error,
    load,
    loadForRole,
    ensureRoleLoaded,
    refetchRole,
    roleLoading,
    debouncedSearch,
    invalidateCache,
    seedProfiles,
  }
}
