<template>
  <div class="tw:bg-white tw:rounded-xl tw:border tw:border-gray-200 tw:p-4">
    <!-- Header -->
    <div class="tw:flex tw:items-center tw:justify-between tw:mb-4">
      <h3 class="tw:text-lg tw:font-semibold tw:text-[var(--primary-color)]">Filters</h3>
      <button 
        @click="$emit('reset')"
        class="tw:text-sm tw:text-gray-500 tw:hover:text-[var(--primary-color)] tw:transition-colors"
      >
        Reset all
      </button>
    </div>

    <!-- Live Now Toggle -->
    <div class="tw:mb-4">
      <button
        @click="$emit('update:liveNow', !liveNow)"
        :class="[
          'tw:w-full tw:py-2.5 tw:px-4 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:gap-2 tw:font-medium tw:transition-all',
          liveNow 
            ? 'tw:bg-red-500 tw:text-white' 
            : 'tw:bg-gray-100 tw:text-gray-700 tw:hover:bg-gray-200'
        ]"
      >
        <span :class="['tw:w-2 tw:h-2 tw:rounded-full', liveNow ? 'tw:bg-white tw:animate-pulse' : 'tw:bg-red-500']"></span>
        Live Now
      </button>
    </div>

    <!-- Category -->
    <div class="tw:mb-4">
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Category</label>
      <select 
        :value="category"
        @change="handleCategoryChange"
        class="tw:w-full tw:py-2 tw:px-3 tw:border tw:border-gray-300 tw:rounded-lg tw:bg-white tw:text-sm tw:focus:ring-2 tw:focus:ring-[var(--primary-color)] tw:focus:border-transparent tw:outline-none"
      >
        <option value="">All Categories</option>
        <option value="music">Music</option>
        <option value="dance">Dance</option>
        <option value="theatre">Theatre</option>
        <option value="nightlife">Nightlife</option>
        <option value="film">Film</option>
      </select>
    </div>

    <!-- Price Range -->
    <div class="tw:mb-4">
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Price Range (€)</label>
      <div class="tw:flex tw:gap-2">
        <input 
          type="number"
          :value="minPrice ?? ''"
          @input="handleMinPriceChange"
          placeholder="Min"
          min="0"
          class="tw:w-1/2 tw:py-2 tw:px-3 tw:border tw:border-gray-300 tw:rounded-lg tw:text-sm tw:focus:ring-2 tw:focus:ring-[var(--primary-color)] tw:focus:border-transparent tw:outline-none"
        />
        <input 
          type="number"
          :value="maxPrice ?? ''"
          @input="handleMaxPriceChange"
          placeholder="Max"
          min="0"
          class="tw:w-1/2 tw:py-2 tw:px-3 tw:border tw:border-gray-300 tw:rounded-lg tw:text-sm tw:focus:ring-2 tw:focus:ring-[var(--primary-color)] tw:focus:border-transparent tw:outline-none"
        />
      </div>
    </div>

    <!-- Date Range -->
    <div class="tw:mb-4">
      <label class="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Date Range</label>
      <div class="tw:flex tw:flex-col tw:gap-2">
        <input 
          type="date"
          :value="fromDate ?? ''"
          @input="handleFromDateChange"
          class="tw:w-full tw:py-2 tw:px-3 tw:border tw:border-gray-300 tw:rounded-lg tw:text-sm tw:focus:ring-2 tw:focus:ring-[var(--primary-color)] tw:focus:border-transparent tw:outline-none"
        />
        <input 
          type="date"
          :value="toDate ?? ''"
          @input="handleToDateChange"
          class="tw:w-full tw:py-2 tw:px-3 tw:border tw:border-gray-300 tw:rounded-lg tw:text-sm tw:focus:ring-2 tw:focus:ring-[var(--primary-color)] tw:focus:border-transparent tw:outline-none"
        />
      </div>
    </div>

    <!-- Radius Slider -->
    <div class="tw:mb-4">
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-2">
        <label class="tw:text-sm tw:font-medium tw:text-gray-700">Search Radius</label>
        <span class="tw:text-sm tw:text-[var(--primary-color)] tw:font-medium">{{ radius }} km</span>
      </div>
      <input 
        type="range"
        :value="radius"
        @input="$emit('update:radius', Number(($event.target as HTMLInputElement).value))"
        min="1"
        max="100"
        step="1"
        class="tw:w-full tw:h-2 tw:bg-gray-200 tw:rounded-lg tw:appearance-none tw:cursor-pointer"
        style="accent-color: var(--primary-color);"
      />
      <div class="tw:flex tw:justify-between tw:text-xs tw:text-gray-500 tw:mt-1">
        <span>1 km</span>
        <span>100 km</span>
      </div>
    </div>

    <!-- Use Location Toggle -->
    <div class="tw:flex tw:items-center tw:justify-between tw:p-3 tw:bg-gray-50 tw:rounded-lg">
      <div class="tw:flex tw:items-center tw:gap-2">
        <MapPinIcon class="tw:w-4 tw:h-4 tw:text-gray-500" />
        <span class="tw:text-sm tw:text-gray-700">Filter by location</span>
      </div>
      <button
        @click="$emit('update:useGeoFilter', !useGeoFilter)"
        :class="[
          'tw:relative tw:w-11 tw:h-6 tw:rounded-full tw:transition-colors',
          useGeoFilter ? 'tw:bg-[var(--primary-color)]' : 'tw:bg-gray-300'
        ]"
      >
        <span 
          :class="[
            'tw:absolute tw:top-0.5 tw:w-5 tw:h-5 tw:bg-white tw:rounded-full tw:shadow tw:transition-transform',
            useGeoFilter ? 'tw:translate-x-5.5' : 'tw:translate-x-0.5'
          ]"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon } from 'lucide-vue-next'
import type { EventCategory } from '../../types/events'

defineProps<{
  liveNow: boolean
  category: EventCategory
  minPrice: number | null
  maxPrice: number | null
  fromDate: string | null
  toDate: string | null
  radius: number
  useGeoFilter: boolean
}>()

const emit = defineEmits<{
  (e: 'update:liveNow', value: boolean): void
  (e: 'update:category', value: EventCategory): void
  (e: 'update:minPrice', value: number | null): void
  (e: 'update:maxPrice', value: number | null): void
  (e: 'update:fromDate', value: string | null): void
  (e: 'update:toDate', value: string | null): void
  (e: 'update:radius', value: number): void
  (e: 'update:useGeoFilter', value: boolean): void
  (e: 'reset'): void
}>()

const handleCategoryChange = (event: globalThis.Event) => {
  const value = (event.target as HTMLSelectElement).value as EventCategory
  emit('update:category', value)
}

const handleMinPriceChange = (event: globalThis.Event) => {
  const value = (event.target as HTMLInputElement).value
  const num = parseFloat(value)
  emit('update:minPrice', isNaN(num) ? null : num)
}

const handleMaxPriceChange = (event: globalThis.Event) => {
  const value = (event.target as HTMLInputElement).value
  const num = parseFloat(value)
  emit('update:maxPrice', isNaN(num) ? null : num)
}

const handleFromDateChange = (event: globalThis.Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:fromDate', value || null)
}

const handleToDateChange = (event: globalThis.Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:toDate', value || null)
}
</script>
