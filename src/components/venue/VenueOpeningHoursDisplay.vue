<template>
  <div class="venue-hours">
    <div
      v-for="row in schedule"
      :key="row.day"
      class="venue-hours__row"
      :class="{
        'venue-hours__row--today': row.isToday,
        'venue-hours__row--open': row.isOpen && row.slots.length > 0,
      }"
    >
      <div class="venue-hours__day">
        <span class="venue-hours__abbr" aria-hidden="true">{{ dayAbbrev(row.day) }}</span>
        <div class="venue-hours__day-text">
          <span class="venue-hours__name">{{ row.day }}</span>
          <span v-if="row.isToday" class="venue-hours__today-badge">Today</span>
        </div>
      </div>

      <div class="venue-hours__slots">
        <template v-if="row.isOpen && row.slots.length > 0">
          <span
            v-for="(slot, index) in row.slots"
            :key="`${row.day}-${index}`"
            class="venue-hours__slot"
          >
            <svg class="venue-hours__clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke-width="1.75" />
              <path stroke-linecap="round" stroke-width="1.75" d="M12 7v5l3 2" />
            </svg>
            {{ formatTimeLabel(slot.open) }} – {{ formatTimeLabel(slot.close) }}
          </span>
        </template>
        <span v-else class="venue-hours__closed">Closed</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  parseVenueOpeningHoursFromApi,
} from '@/utils/venueOpeningHours'

const props = defineProps<{
  openingHours: unknown
}>()

const JS_DAY_TO_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

const schedule = computed(() => {
  const rows = parseVenueOpeningHoursFromApi(props.openingHours)
  const todayName = JS_DAY_TO_NAME[new Date().getDay()]
  return rows.map((row) => ({
    ...row,
    isToday: row.day === todayName,
    isOpen: row.is_open && row.slots.some((s) => s.open && s.close),
    slots: row.slots.filter((s) => s.open && s.close),
  }))
})

function dayAbbrev(day: string): string {
  return day.slice(0, 3).toUpperCase()
}

function formatTimeLabel(value: string): string {
  const [hRaw, mRaw] = value.split(':')
  const h = Number(hRaw)
  const m = Number(mRaw)
  if (Number.isNaN(h) || Number.isNaN(m)) return value
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
</script>

<style scoped>
.venue-hours {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.venue-hours__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  border: 1px solid #ece7dc;
  background: linear-gradient(135deg, #fff 0%, #faf8f4 100%);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.venue-hours__row--today {
  border-color: #fdba74;
  box-shadow: 0 4px 14px rgba(255, 119, 0, 0.12);
}

.venue-hours__row--open .venue-hours__abbr {
  background: #fff7ed;
  color: #c2410c;
  border-color: #fed7aa;
}

.venue-hours__day {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.venue-hours__abbr {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.venue-hours__day-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.venue-hours__name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0f172a;
}

.venue-hours__today-badge {
  display: inline-flex;
  width: fit-content;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #c2410c;
  background: #ffedd5;
}

.venue-hours__slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
  min-width: 0;
}

.venue-hours__slot {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  white-space: nowrap;
}

.venue-hours__clock {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
  opacity: 0.85;
}

.venue-hours__closed {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}
</style>
