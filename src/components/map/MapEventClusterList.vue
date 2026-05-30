<template>
  <MapClusterPopupShell
    accent="event"
    :title="headerTitle"
    :hint="headerHint"
  >
    <MapClusterCardCarousel accent="event" :item-count="events.length">
      <div
        v-for="event in events"
        :key="String(event.id)"
        class="map-cluster-carousel-slide"
      >
        <div class="map-cluster-carousel-slide__inner">
          <Event
            :event="event"
            map-cluster-embed
            @view-event="onViewEvent"
          />
        </div>
      </div>
    </MapClusterCardCarousel>
  </MapClusterPopupShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Event from '@/components/Event.vue'
import MapClusterCardCarousel from '@/components/map/MapClusterCardCarousel.vue'
import MapClusterPopupShell from '@/components/map/MapClusterPopupShell.vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const { t } = useI18n()

const headerTitle = computed(() =>
  t('mapCluster.eventsAtLocation', { count: props.events.length }),
)

const headerHint = computed(() =>
  props.events.length > 1 ? t('mapCluster.browseHint') : t('mapCluster.singleEventHint'),
)

function onViewEvent(event) {
  emit('select', event)
}
</script>
