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
          <span class="tw:text-sm tw:font-medium tw:text-gray-900">{{ roleLabel }}</span>
          <span
            v-if="selectedUsers.length > 0"
            class="tw:ml-2 tw:text-xs tw:font-semibold tw:px-1.5 tw:py-0.5 tw:rounded-full tw:bg-blue-100 tw:text-blue-600"
          >
            {{ selectedUsers.length }}
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
            : 'tw:text-blue-600 hover:tw:bg-blue-50'
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
        :selected-ids="selectedIds"
        @toggle="handleToggle"
      />
    </Transition>

    <!-- Selected chips -->
    <SelectedChips
      v-if="selectedUsers.length > 0"
      :users="selectedUsers"
      @remove="removeUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { User, MapPin, Mic2 } from 'lucide-vue-next'
import InviteSearchPanel from './InviteSearchPanel.vue'
import SelectedChips from './SelectedChips.vue'
import { mockProfiles } from '@/data/mockProfiles'

const emit = defineEmits(['update:selectedIds'])

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
  selectedIds: {
    type: Array,
    default: () => [],
  },
})

const ROLE_CONFIG = {
  talent:    { label: 'Invite Registered Talent',    icon: Mic2    },
  organizer: { label: 'Invite Registered Organizer', icon: User    },
  venue:     { label: 'Invite Registered Venue',     icon: MapPin  },
}

const containerRef   = ref(null)
const isOpen         = ref(false)
const selectedUsers  = ref([])

const roleLabel = computed(() => ROLE_CONFIG[props.role]?.label ?? 'Invite')
const roleIcon  = computed(() => ROLE_CONFIG[props.role]?.icon  ?? User)

const selectedIds = computed(() => selectedUsers.value.map((u) => u.id))

watch(selectedIds, (ids) => {
  emit('update:selectedIds', [...ids])
}, { immediate: true })

function normalizeInviteRole(role) {
  const r = String(role ?? '').toLowerCase().trim()
  if (r === 'organiser') return 'organizer'
  return r
}

const roleProfiles = computed(() => {
  const source = props.profiles ?? mockProfiles
  const targetRole = normalizeInviteRole(props.role)
  return source.filter((p) => normalizeInviteRole(p.profile_type) === targetRole)
})

const recommendedProfiles = computed(() =>
  roleProfiles.value
    .filter((p) => p.account_type === 'premium')
    .slice(0, 4)
)

// Hydrate selected chips from parent v-model (edit mode) and keep in sync
watch(
  [() => props.selectedIds, roleProfiles],
  ([incomingIds, availableProfiles]) => {
    const wanted = Array.isArray(incomingIds) ? incomingIds.map((id) => String(id)) : []
    if (!wanted.length) {
      selectedUsers.value = []
      return
    }

    selectedUsers.value = availableProfiles.filter((p) => wanted.includes(String(p.id)))
  },
  { immediate: true, deep: true }
)

function togglePanel() {
  isOpen.value = !isOpen.value
}

function handleToggle(profile) {
  const idx = selectedUsers.value.findIndex((u) => u.id === profile.id)
  if (idx > -1) {
    selectedUsers.value.splice(idx, 1)
  } else {
    selectedUsers.value.push(profile)
  }
}

function removeUser(userId) {
  selectedUsers.value = selectedUsers.value.filter((u) => u.id !== userId)
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
