import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeDropdownId = ref<string | null>(null)

export function useDropdownState() {
  const openDropdown = (id: string) => {
    activeDropdownId.value = id
  }

  const closeDropdown = () => {
    activeDropdownId.value = null
  }

  const toggleDropdown = (id: string) => {
    if (activeDropdownId.value === id) {
      closeDropdown()
    } else {
      openDropdown(id)
    }
  }

  const isDropdownOpen = (id: string) => {
    return activeDropdownId.value === id
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDropdown()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscape)
  })

  return {
    activeDropdownId,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    isDropdownOpen
  }
}
