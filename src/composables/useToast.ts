import { ref, readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration: number = 4000) {
    const id = ++toastId
    const toast: Toast = { id, message, type, duration }
    
    toasts.value.push(toast)
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    
    return id
  }

  function success(message: string, duration: number = 4000) {
    return show(message, 'success', duration)
  }

  function error(message: string, duration: number = 5000) {
    return show(message, 'error', duration)
  }

  function warning(message: string, duration: number = 4000) {
    return show(message, 'warning', duration)
  }

  function info(message: string, duration: number = 4000) {
    return show(message, 'info', duration)
  }

  function remove(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}
