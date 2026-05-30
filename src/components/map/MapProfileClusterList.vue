<template>
  <MapClusterPopupShell
    accent="profile"
    :title="headerTitle"
    :hint="headerHint"
  >
    <MapClusterCardCarousel accent="profile" :item-count="profiles.length">
      <div
        v-for="profile in profiles"
        :key="`${profile.profileType}-${profile.id}`"
        class="map-cluster-carousel-slide"
      >
        <div class="map-cluster-carousel-slide__inner">
          <DiscoveryProfileCard
            :profile="profile"
            :profile-type="profile.profileType"
            map-cluster-embed
            @view-profile="onViewProfile"
          />
        </div>
      </div>
    </MapClusterCardCarousel>
  </MapClusterPopupShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DiscoveryProfileCard from '@/components/DiscoveryProfileCard.vue'
import MapClusterCardCarousel from '@/components/map/MapClusterCardCarousel.vue'
import MapClusterPopupShell from '@/components/map/MapClusterPopupShell.vue'

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const { t } = useI18n()

const headerTitle = computed(() =>
  t('mapCluster.profilesAtLocation', { count: props.profiles.length }),
)

const headerHint = computed(() =>
  props.profiles.length > 1 ? t('mapCluster.browseHint') : t('mapCluster.singleProfileHint'),
)

function onViewProfile(profile) {
  emit('select', profile)
}
</script>
