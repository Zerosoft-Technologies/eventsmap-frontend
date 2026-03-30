<template>
  <div class="tw:min-h-screen tw:bg-gray-50 tw:flex tw:justify-center tw:py-4 tw:px-3 tw:md:py-10 tw:md:px-6 tw:overflow-x-hidden">
    <div class="tw:w-full tw:max-w-7xl tw:flex tw:flex-col tw:md:flex-row tw:gap-4 tw:md:gap-6">
      <!-- Mobile Header -->
      <div class="tw:md:hidden tw:flex tw:items-center tw:justify-between tw:bg-white tw:rounded-xl tw:shadow-sm tw:px-4 tw:py-3">
        <button type="button" @click="handleBack" class="tw:text-sm tw:font-medium tw:text-[#0061FF]">Event Map</button>
        <button type="button" @click="toggleMobileSidebar" aria-label="Open menu" class="tw:text-2xl tw:leading-none tw:text-gray-700">☰</button>
      </div>

      <!-- Mobile Sidebar Drawer -->
      <div v-if="mobileSidebarOpen" class="tw:md:hidden tw:fixed tw:inset-0 tw:z-50">
        <div class="tw:absolute tw:inset-0 tw:bg-black/30" @click="closeMobileSidebar"></div>
        <div class="tw:absolute tw:left-0 tw:top-0 tw:h-screen tw:max-w-[92vw] tw:w-full tw:p-2">
          <EventSidebar :menuItems="menuItems"
            @back="handleBack" @event-selected="handleEventSelected"
            @chatbox-click="handleChatboxClick" @menu-click="closeMobileSidebar" />
        </div>
      </div>

      <!-- ================= LEFT CARD (Sidebar Component) ================= -->
      <div class="tw:hidden tw:md:block">
        <EventSidebar :menuItems="menuItems"
          @back="handleBack" @event-selected="handleEventSelected"
          @chatbox-click="handleChatboxClick" />
      </div>

      <!-- ================= RIGHT CARD ================= -->
      <div class="tw:flex-1 tw:bg-[#F6F1E7] tw:rounded-xl tw:md:rounded-3xl tw:shadow-sm tw:p-4 tw:md:p-6">
        <div class="tw:bg-white tw:rounded-2xl tw:p-5 tw:md:p-12">
          <!-- Header -->
          <GalleryHeader :totalImages="totalImages" />

          <!-- Upload Zone -->
          <UploadZone
            ref="uploadZoneRef"
            :uploading="uploading"
            :uploadProgress="uploadProgress"
            @upload="handleUpload"
          />

          <!-- Gallery Grid -->
          <GalleryGrid
            :images="images"
            :loading="loading"
            :error="error"
            :isEmpty="isEmpty"
            @delete="openDeleteModal"
            @view-details="openDetailsModal"
            @edit-alt="openEditAltModal"
            @retry="fetchImages"
            @scroll-to-upload="scrollToUpload"
          />

          <!-- Load More Button -->
          <div v-if="!loading && !error && images.length > 0" class="tw:flex tw:justify-center tw:mt-8 tw:mb-4">
            <button
              v-if="hasMore"
              type="button"
              :disabled="loadingMore"
              @click="loadMore"
              class="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:min-w-[300px] tw:px-6 tw:py-3 tw:text-base tw:font-medium tw:text-white tw:bg-blue-600 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors disabled:tw:opacity-60 disabled:tw:cursor-not-allowed"
            >
              <Loader2 v-if="loadingMore" class="tw:w-5 tw:h-5 tw:animate-spin" />
              <template v-if="loadingMore">Loading...</template>
              <template v-else>Load More Images ({{ remaining }})</template>
            </button>
            <p v-else class="tw:text-sm tw:text-gray-400 tw:py-3">You've reached the end</p>
          </div>
        </div>
      </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      :visible="deleteModalVisible"
      :image="deleteTarget"
      :deleting="deleting"
      :errorMsg="deleteError"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <!-- Image Details Modal -->
    <ImageDetailsModal
      :visible="detailsModalVisible"
      :image="detailsTarget"
      @close="detailsModalVisible = false"
    />

    <!-- Edit Alt Text Modal -->
    <EditAltTextModal
      :visible="editAltModalVisible"
      :image="editAltTarget"
      @close="editAltModalVisible = false"
    />
      </div>
    </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useGallery } from '@/composables/useGallery'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chatStore'
import { useToast } from '@/composables/useToast'
import type { GalleryImage } from '@/api/gallery'

import GalleryHeader from '@/components/gallery/GalleryHeader.vue'
import UploadZone from '@/components/gallery/UploadZone.vue'
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
import DeleteConfirmationModal from '@/components/gallery/DeleteConfirmationModal.vue'
import ImageDetailsModal from '@/components/gallery/ImageDetailsModal.vue'
import EditAltTextModal from '@/components/gallery/EditAltTextModal.vue'
import EventSidebar from './packages/eventsidebar/Eventsidebar.vue'
import { 
  Home, 
  Calendar, 
  BarChart3, 
  MessageSquareText, 
  Settings,
  Images 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const toast = useToast()

const {
  images,
  loading,
  loadingMore,
  error,
  uploading,
  uploadProgress,
  deleting,
  deleteError,
  totalImages,
  hasMore,
  remaining,
  isEmpty,
  fetchImages,
  loadMore,
  uploadImage,
  deleteImage,
} = useGallery()

// Mobile sidebar state
const mobileSidebarOpen = ref(false)

// Refs
const uploadZoneRef = ref<InstanceType<typeof UploadZone> | null>(null)

// Delete modal state
const deleteModalVisible = ref(false)
const deleteTarget = ref<GalleryImage | null>(null)

// Details modal state
const detailsModalVisible = ref(false)
const detailsTarget = ref<GalleryImage | null>(null)

// Edit Alt modal state
const editAltModalVisible = ref(false)
const editAltTarget = ref<GalleryImage | null>(null)

// Menu items for sidebar
const menuItems = computed(() => {
  const baseRoute = route.path.split("/")[1]
  return [
    { id: 'home', label: 'Home', icon: Home, route: `/${baseRoute}` },
    { id: 'details', label: 'Details', icon: Calendar, route: `/${baseRoute}` },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, route: `/${baseRoute}/report` },
    { id: 'gallery', label: 'Gallery', icon: Images, route: `/${baseRoute}/gallery-images` },
    { id: 'settings', label: 'Settings', icon: Settings, route: `/${baseRoute}/settings` },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'chatbox', label: 'chatbox', icon: MessageSquareText },
  ]
})

onMounted(() => {
  fetchImages()
})

// Upload handler
async function handleUpload(file: File, altText: string) {
  const success = await uploadImage(file, altText || undefined)
  if (success) {
    uploadZoneRef.value?.clearFile()
  }
}

// Delete handlers
function openDeleteModal(image: GalleryImage) {
  deleteTarget.value = image
  deleteModalVisible.value = true
}

function closeDeleteModal() {
  deleteModalVisible.value = false
  deleteTarget.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  const success = await deleteImage(deleteTarget.value.image_id)
  if (success) {
    closeDeleteModal()
  }
}

// Details modal
function openDetailsModal(image: GalleryImage) {
  detailsTarget.value = image
  detailsModalVisible.value = true
}

// Edit Alt modal
function openEditAltModal(image: GalleryImage) {
  editAltTarget.value = image
  editAltModalVisible.value = true
}

// Scroll to upload zone
function scrollToUpload() {
  uploadZoneRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Mobile sidebar handlers
function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

function handleBack() {
  router.push({ name: 'Home' })
}

function handleEventSelected(eventId: string) {
  // Handle event selection if needed
}

function handleChatboxClick() {
  closeMobileSidebar()
  if (authStore.user?.account_type !== 'premium') {
    toast.warning('Chat is available only for premium users.')
    return
  }
  chatStore.open()
}
</script>
