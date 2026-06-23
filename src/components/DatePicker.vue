<template>
  <div class="eventmap-datepicker">
    <VueTailwindDatepicker 
      placeholder="DD/MM/YYYY ~ DD/MM/YYYY" 
      :formatter="formatter" 
      v-model="dateValue" 
      v-model:session-value="sessionValue"
      :auto-apply="false" 
      :inline="inline"
      :no-input="noInput"
      :shortcuts="discoveryShortcuts"
      :disable-date="isPastDiscoveryCalendarDate"
      @update:model-value="onDateUpdate"
      @update:session-value="onSessionUpdate"
    >
      <template #default="{ value, placeholder, clear }">
        <p>{{ value || placeholder }}</p>
      </template>                    
    </VueTailwindDatepicker>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, defineProps } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import {
  getDefaultDiscoveryDateRange,
  createDiscoveryUpcomingShortcuts,
  isPastDiscoveryCalendarDate,
} from "@/utils/discoveryDateTimeFilters";

const discoveryShortcuts = createDiscoveryUpcomingShortcuts();

const props = defineProps({
  // When used inside the mobile overlay dropdown we want the calendar
  // to be part of normal document flow (no popover overlap).
  inline: { type: Boolean, default: false },
  noInput: { type: Boolean, default: false },
  /** Seed range when mounting (e.g. mobile draft from applied filters). Omit to use current month. */
  initialDateRange: { type: Array, default: null },
  /** Seed session toggles when mounting (mobile draft). */
  initialSession: { type: Object, default: null },
  /** When false, session changes are not written to localStorage until parent applies (mobile). */
  persistSessionToStorage: { type: Boolean, default: true },
})

const [defaultStart, defaultEnd] = getDefaultDiscoveryDateRange()
const dateValue = ref([defaultStart, defaultEnd])
const formatter = ref({
  date: "DD/MM/YYYY",
  month: "MMM"
});

// Session state for time periods
const sessionValue = ref({
  morning: false,
  afternoon: false,
  evening: false,
  night: false
});

const emit = defineEmits(['update:dateRange', 'update:session']);

// Handle date updates
const onDateUpdate = (newValue) => {
  emit('update:dateRange', newValue);
};

// Handle session updates
const onSessionUpdate = (newValue) => {
  sessionValue.value = newValue;
  emit('update:session', newValue);
  if (props.persistSessionToStorage) {
    localStorage.setItem('datepicker-session', JSON.stringify(newValue));
  }
};

// Load session / seed from props on mount
onMounted(() => {
  if (
    props.initialDateRange?.length === 2 &&
    props.initialDateRange[0] &&
    props.initialDateRange[1]
  ) {
    dateValue.value = [props.initialDateRange[0], props.initialDateRange[1]];
  }
  if (props.initialSession) {
    sessionValue.value = { ...props.initialSession };
  } else {
    const stored = localStorage.getItem('datepicker-session');
    if (stored) {
      try {
        sessionValue.value = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored session:', e);
      }
    }
  }
  emit('update:dateRange', dateValue.value);
  emit('update:session', sessionValue.value);
});
</script>

<style scoped>
.eventmap-datepicker :deep(.vtd-datepicker) {
  position: relative;
}

/* Override library close control without modifying package source */
.eventmap-datepicker :deep(.text-vtd-orange) {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  left: auto !important;
  z-index: 60;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f97316;
  border-radius: 9999px;
  background: #fff;
  color: #f97316;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.eventmap-datepicker :deep(.text-vtd-orange:hover) {
  background: #fff7ed;
  border-color: #ea580c;
  color: #ea580c;
}

.eventmap-datepicker :deep(.text-vtd-orange svg) {
  width: 1.1rem;
  height: 1.1rem;
}
</style>