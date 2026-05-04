<template>
  <div v-if="user" class="tw:flex tw:items-center tw:gap-4 tw:mb-6">
    <div
      class="tw:w-16 tw:h-16 tw:md:w-20 tw:md:h-20 tw:shrink-0 tw:rounded-full tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-gray-100 tw:flex tw:items-center tw:justify-center"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
        class="tw:w-full tw:h-full tw:object-cover"
      />
      <UserIcon v-else class="tw:w-8 tw:h-8 tw:md:w-9 tw:md:h-9 tw:text-gray-400" aria-hidden="true" />
    </div>
    <div class="tw:min-w-0">
      <p class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:truncate">{{ user.name }}</p>
      <p class="tw:text-sm tw:text-gray-500 tw:truncate">{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User as UserIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { getUserProfileImageUrl } from '@/utils/userProfileImage'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const imageUrl = computed(() => getUserProfileImageUrl(user.value ?? undefined))
</script>
