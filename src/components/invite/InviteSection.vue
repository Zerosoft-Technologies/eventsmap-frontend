<template>
  <div class="tw:relative" ref="containerRef">

    <!-- Row header -->
    <div
      class="tw:flex tw:items-center tw:justify-between tw:py-3"
      :class="{ 'tw:border-b tw:border-gray-100': hasBorder }"
    >
      <div class="tw:flex tw:items-center tw:gap-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
          <component :is="roleIcon" class="tw:w-5 tw:h-5 tw:text-gray-600" />
        </div>
        <div>
          <span class="tw:text-sm tw:font-medium tw:text-[var(--text-primary)]">{{ roleLabel }}</span>
          <span
            v-if="parentSelectedIds.length > 0"
            class="tw:ml-2 tw:text-xs tw:font-semibold tw:px-1.5 tw:py-0.5 tw:rounded-full tw:bg-blue-100 tw:text-[var(--primary-color)]"
          >
            {{ parentSelectedIds.length }}
          </span>
        </div>
      </div>

      <button
        type="button"
        @click.stop="togglePanel"
        :class="[
          'tw:text-sm tw:font-medium tw:px-3 tw:py-1.5 tw:rounded-lg tw:transition-all tw:leading-none',
          isOpen
            ? 'tw:bg-gray-100 tw:text-gray-600 hover:tw:bg-gray-200'
            : 'tw:text-[var(--primary-color)] hover:tw:bg-blue-50'
        ]"
      >
        {{ isOpen ? '✕ Close' : '+ Add' }}
      </button>
    </div>

    <!-- Animated search panel -->
    <Transition
      enter-active-class="tw:transition tw:duration-200 tw:ease-out"
      enter-from-class="tw:opacity-0 tw:-translate-y-1 tw:scale-[0.98]"
      enter-to-class="tw:opacity-100 tw:translate-y-0 tw:scale-100"
      leave-active-class="tw:transition tw:duration-150 tw:ease-in"
      leave-from-class="tw:opacity-100 tw:translate-y-0 tw:scale-100"
      leave-to-class="tw:opacity-0 tw:-translate-y-1 tw:scale-[0.98]"
    >
      <InviteSearchPanel
        v-if="isOpen"
        :role="role"
        :profiles="roleProfiles"
        :recommended="recommendedProfiles"
        :selected-ids="parentSelectedIds"
        :loading="loading"
        :load-error="loadError"
        @toggle="handleToggle"
        @refetch="emit('refetch', role)"
      />
    </Transition>

    <!-- Selected chips -->
    <SelectedChips
      v-if="displaySelectedUsers.length > 0"
      :users="displaySelectedUsers"
      @remove="removeUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { User, MapPin, Mic2 } from 'lucide-vue-next'
import InviteSearchPanel from './InviteSearchPanel.vue'
import SelectedChips from './SelectedChips.vue'
import { mockProfiles } from '@/data/mockProfiles'

const emit = defineEmits(['update:selectedIds', 'open', 'refetch'])

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (v) => ['talent', 'organizer', 'venue'].includes(v),
  },
  hasBorder: {
    type: Boolean,
    default: true,
  },
  profiles: {
    type: Array,
    default: undefined,
  },
  /** Full registry for chip hydration (cached profiles across roles). */
  allProfiles: {
    type: Array,
    default: () => [],
  },
  selectedIds: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadError: {
    type: String,
    default: '',
  },
})

const ROLE_CONFIG = {
  talent:    { label: 'Invite Registered Talent',    icon: Mic2    },
  organizer: { label: 'Invite Registered Organiser', icon: User    },
  venue:     { label: 'Invite Registered Venue',     icon: MapPin  },
}

const containerRef   = ref(null)
const isOpen         = ref(false)

const roleLabel = computed(() => ROLE_CONFIG[props.role]?.label ?? 'Invite')
const roleIcon  = computed(() => ROLE_CONFIG[props.role]?.icon  ?? User)

const parentSelectedIds = computed(() => normalizeIds(props.selectedIds))

function normalizeIds(ids) {
  return (Array.isArray(ids) ? ids : []).map((id) => String(id)).filter(Boolean)
}

function areSameIdSets(a, b) {
  const aa = normalizeIds(a).sort()
  const bb = normalizeIds(b).sort()
  if (aa.length !== bb.length) return false
  for (let i = 0; i < aa.length; i += 1) {
    if (aa[i] !== bb[i]) return false
  }
  return true
}

function normalizeInviteRole(role) {
  const r = String(role ?? '').toLowerCase().trim()
  if (r === 'organiser') return 'organizer'
  return r
}

const roleProfiles = computed(() => {
  const source = props.profiles !== undefined ? props.profiles : mockProfiles
  const targetRole = normalizeInviteRole(props.role)
  return source.filter((p) => normalizeInviteRole(p.profile_type) === targetRole)
})

const profileRegistry = computed(() => {
  if (props.allProfiles?.length) return props.allProfiles
  if (props.profiles !== undefined) return props.profiles
  return mockProfiles
})

function stubProfile(id) {
  const n = Number.parseInt(String(id), 10)
  const profileType = props.role === 'organizer' ? 'organiser' : props.role
  return {
    id: Number.isFinite(n) ? n : id,
    name: `Profile #${id}`,
    profile_type: profileType,
    account_type: 'free',
    country: '',
  }
}

function findProfileById(id) {
  const sid = String(id)
  return profileRegistry.value.find((p) => String(p.id) === sid) ?? null
}

function resolveProfile(id) {
  return findProfileById(id) ?? stubProfile(id)
}

const displaySelectedUsers = computed(() =>
  parentSelectedIds.value.map((id) => resolveProfile(id)),
)

const recommendedProfiles = computed(() =>
  roleProfiles.value
    .filter((p) => p.account_type === 'premium')
    .slice(0, 4)
)

function handleToggle(profile) {
  const pid = String(profile.id)
  const current = [...parentSelectedIds.value]
  const idx = current.indexOf(pid)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(pid)
  }
  emit('update:selectedIds', current)
}

function removeUser(userId) {
  const pid = String(userId)
  emit(
    'update:selectedIds',
    parentSelectedIds.value.filter((id) => id !== pid),
  )
}

function togglePanel() {
  const willOpen = !isOpen.value
  isOpen.value = willOpen
  if (willOpen) {
    emit('open', props.role)
  }
}

function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

function onClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onClickOutside)
})
</script>
