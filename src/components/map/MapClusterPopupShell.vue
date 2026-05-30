<template>
  <div
    class="map-cluster-popup"
    :class="accent === 'profile' ? 'map-cluster-popup--profile' : 'map-cluster-popup--event'"
  >
    <header class="map-cluster-popup__header">
      <div
        class="map-cluster-popup__icon"
        :class="accent === 'profile' ? 'map-cluster-popup__icon--profile' : 'map-cluster-popup__icon--event'"
        aria-hidden="true"
      >
        <MapPinIcon v-if="accent === 'event'" class="map-cluster-popup__icon-svg" />
        <UsersIcon v-else class="map-cluster-popup__icon-svg" />
      </div>
      <div class="map-cluster-popup__copy">
        <h3 class="map-cluster-popup__title">{{ title }}</h3>
        <p v-if="hint" class="map-cluster-popup__hint">{{ hint }}</p>
      </div>
    </header>
    <div class="map-cluster-popup__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon, UsersIcon } from 'lucide-vue-next'

defineProps({
  accent: {
    type: String,
    default: 'event',
    validator: (v) => v === 'event' || v === 'profile',
  },
  title: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.map-cluster-popup {
  width: min(calc(100vw - 1.25rem), 386px);
  max-width: 386px;
  overflow: hidden;
  border-radius: 1.375rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.6) inset,
    0 8px 16px -4px rgba(15, 23, 42, 0.08),
    0 24px 48px -16px rgba(15, 23, 42, 0.18);
}

.map-cluster-popup__header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1rem 0.875rem;
}

.map-cluster-popup__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.375rem;
  height: 2.375rem;
  flex-shrink: 0;
  border-radius: 0.75rem;
}

.map-cluster-popup__icon--event {
  color: #ea580c;
  background: linear-gradient(145deg, #fff4eb 0%, #ffe8d4 100%);
  box-shadow: 0 1px 2px rgba(234, 88, 12, 0.12);
}

.map-cluster-popup__icon--profile {
  color: #2563eb;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.12);
}

.map-cluster-popup__icon-svg {
  width: 1.125rem;
  height: 1.125rem;
}

.map-cluster-popup__copy {
  min-width: 0;
  flex: 1;
  padding-top: 0.125rem;
}

.map-cluster-popup__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.35;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.map-cluster-popup__hint {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: #64748b;
}

.map-cluster-popup__body {
  padding: 0 0.75rem 0.875rem;
}
</style>
