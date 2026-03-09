<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:items-center tw:justify-center tw:px-4">
    <div class="tw:w-full tw:max-w-md tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-8 tw:text-center">

      <!-- Processing -->
      <template v-if="status === 'processing'">
        <Loader2 class="tw:w-12 tw:h-12 tw:mx-auto tw:animate-spin tw:text-blue-500 tw:mb-4" />
        <h2 class="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">Processing your response...</h2>
        <p class="tw:text-sm tw:text-gray-500">Please wait a moment.</p>
      </template>

      <!-- Success: Accepted -->
      <template v-else-if="status === 'accepted'">
        <div class="tw:w-16 tw:h-16 tw:mx-auto tw:bg-green-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-4">
          <CheckCircle2 class="tw:w-9 tw:h-9 tw:text-green-500" />
        </div>
        <h2 class="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">Invitation Accepted!</h2>
        <p class="tw:text-sm tw:text-gray-500 tw:mb-6 tw:leading-relaxed">
          You have successfully joined the event. Chat access is now available for your account.
        </p>
        <router-link
          to="/"
          class="tw:inline-block tw:px-6 tw:py-2.5 tw:bg-blue-500 tw:text-white tw:text-sm tw:font-medium tw:rounded-lg hover:tw:bg-blue-600 tw:transition-colors"
        >
          Go to Home
        </router-link>
      </template>

      <!-- Success: Rejected -->
      <template v-else-if="status === 'rejected'">
        <div class="tw:w-16 tw:h-16 tw:mx-auto tw:bg-orange-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-4">
          <XCircle class="tw:w-9 tw:h-9 tw:text-orange-400" />
        </div>
        <h2 class="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">Invitation Declined</h2>
        <p class="tw:text-sm tw:text-gray-500 tw:mb-6">You have declined the event invitation.</p>
        <router-link
          to="/"
          class="tw:inline-block tw:px-6 tw:py-2.5 tw:bg-gray-200 tw:text-gray-700 tw:text-sm tw:font-medium tw:rounded-lg hover:tw:bg-gray-300 tw:transition-colors"
        >
          Go to Home
        </router-link>
      </template>

      <!-- Error -->
      <template v-else-if="status === 'error'">
        <div class="tw:w-16 tw:h-16 tw:mx-auto tw:bg-red-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-4">
          <AlertCircle class="tw:w-9 tw:h-9 tw:text-red-500" />
        </div>
        <h2 class="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">Something went wrong</h2>
        <p class="tw:text-sm tw:text-red-500 tw:mb-6 tw:leading-relaxed">{{ errorMessage }}</p>
        <div class="tw:flex tw:gap-3 tw:justify-center">
          <button
            @click="processResponse"
            class="tw:px-5 tw:py-2 tw:bg-blue-500 tw:text-white tw:text-sm tw:font-medium tw:rounded-lg hover:tw:bg-blue-600 tw:transition-colors"
          >
            Retry
          </button>
          <router-link
            to="/"
            class="tw:px-5 tw:py-2 tw:bg-gray-200 tw:text-gray-700 tw:text-sm tw:font-medium tw:rounded-lg hover:tw:bg-gray-300 tw:transition-colors"
          >
            Go Home
          </router-link>
        </div>
      </template>

      <!-- Invalid link -->
      <template v-else-if="status === 'invalid'">
        <div class="tw:w-16 tw:h-16 tw:mx-auto tw:bg-gray-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-4">
          <LinkOff class="tw:w-9 tw:h-9 tw:text-gray-400" />
        </div>
        <h2 class="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">Invalid Invitation Link</h2>
        <p class="tw:text-sm tw:text-gray-500 tw:mb-6">
          This invitation link is invalid or has expired. Please check your email for a valid link.
        </p>
        <router-link
          to="/"
          class="tw:inline-block tw:px-6 tw:py-2.5 tw:bg-gray-200 tw:text-gray-700 tw:text-sm tw:font-medium tw:rounded-lg hover:tw:bg-gray-300 tw:transition-colors"
        >
          Go to Home
        </router-link>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-vue-next'
import { chatService } from '@/services/chatService'

type PageStatus = 'processing' | 'accepted' | 'rejected' | 'error' | 'invalid'

const route = useRoute()

const status       = ref<PageStatus>('processing')
const errorMessage = ref('')

async function processResponse() {
  const invitationId = route.params.id as string
  const action       = route.query.action as string
  const token        = route.query.token as string | undefined

  // Validate required params
  if (!invitationId || !action) {
    status.value = 'invalid'
    return
  }

  if (action !== 'accept' && action !== 'reject') {
    status.value = 'invalid'
    return
  }

  status.value = 'processing'

  try {
    const apiStatus = action === 'accept' ? 'accepted' : 'rejected'

    await chatService.respondToInvitation(invitationId, {
      status: apiStatus,
      ...(token ? { token } : {}),
    })

    status.value = apiStatus

  } catch (err: any) {
    console.error('Invitation response error:', err)
    const msg = err?.response?.data?.message
    if (err?.response?.status === 404 || err?.response?.status === 410) {
      status.value = 'invalid'
    } else {
      errorMessage.value = msg || 'An unexpected error occurred. Please try again.'
      status.value       = 'error'
    }
  }
}

onMounted(processResponse)
</script>
