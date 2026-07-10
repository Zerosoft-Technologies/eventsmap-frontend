<template>
  <div class="tw:space-y-2 tw:border-t tw:border-gray-200 tw:pt-6">
    <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900">Invitations</h3>
    <p class="tw:text-sm tw:text-gray-600 tw:mb-4">
      Invite talent, venues, and organisers to every generated occurrence. Each date has its own invitation that can be accepted or declined independently.
    </p>

    <InviteSection
      role="talent"
      :has-border="true"
      v-model:selectedIds="talentIds"
    />
    <InviteSection
      role="organizer"
      :has-border="false"
      v-model:selectedIds="organiserIds"
    />
    <InviteSection
      role="venue"
      :has-border="false"
      v-model:selectedIds="venueIds"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InviteSection from '@/components/invite/InviteSection.vue'

const props = defineProps<{
  talentIds: number[]
  organiserIds: number[]
  venueIds: number[]
}>()

const emit = defineEmits<{
  (e: 'update:talentIds', value: number[]): void
  (e: 'update:organiserIds', value: number[]): void
  (e: 'update:venueIds', value: number[]): void
}>()

const talentIds = computed({
  get: () => props.talentIds,
  set: (value: number[]) => emit('update:talentIds', value),
})

const organiserIds = computed({
  get: () => props.organiserIds,
  set: (value: number[]) => emit('update:organiserIds', value),
})

const venueIds = computed({
  get: () => props.venueIds,
  set: (value: number[]) => emit('update:venueIds', value),
})
</script>
