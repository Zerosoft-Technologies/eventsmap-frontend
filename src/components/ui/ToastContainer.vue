<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="remove(toast.id)"
        >
          <div class="toast-icon">
            <CheckCircle v-if="toast.type === 'success'" class="icon" />
            <XCircle v-else-if="toast.type === 'error'" class="icon" />
            <AlertTriangle v-else-if="toast.type === 'warning'" class="icon" />
            <Info v-else class="icon" />
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click.stop="remove(toast.id)">
            <X class="close-icon" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toast:hover {
  transform: translateX(-4px);
}

.toast-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.toast-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.toast-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.toast-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.toast-icon {
  flex-shrink: 0;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.toast-message {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: white;
}

/* Transitions */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
