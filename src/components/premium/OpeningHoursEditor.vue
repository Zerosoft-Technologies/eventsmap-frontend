<template>
    <div class="tw:space-y-2">
        <p class="tw:text-xs tw:text-gray-500 tw:leading-relaxed">
            Same calendar day: closing time must be after opening. Times are disabled when a day is closed.
        </p>

        <div class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:overflow-hidden tw:shadow-sm">
            <div
                v-for="(row, idx) in schedule"
                :key="row.day"
                class="tw:border-b tw:border-gray-100 last:tw:border-b-0"
                :class="rowHighlight(row) ? 'tw:bg-amber-50/50' : ''"
            >
                <!-- Single compact row: day | toggle | open | close -->
                <div
                    class="tw:grid tw:grid-cols-[minmax(0,4rem)_auto_minmax(0,1fr)_minmax(0,1fr)] tw:items-center tw:gap-x-2 tw:gap-y-0 tw:px-2.5 tw:py-2 sm:tw:grid-cols-[5.5rem_auto_minmax(0,1fr)_minmax(0,1fr)] sm:tw:gap-x-2.5 sm:tw:px-3 sm:tw:py-2.5"
                >
                    <span
                        class="tw:text-xs tw:font-semibold tw:text-gray-900 tw:leading-snug sm:tw:text-sm"
                        :title="row.day"
                    >
                        <span class="sm:tw:hidden">{{ shortDay(row.day) }}</span>
                        <span class="tw:hidden sm:tw:inline">{{ row.day }}</span>
                    </span>

                    <button
                        type="button"
                        role="switch"
                        :aria-checked="row.is_open"
                        :aria-label="row.is_open ? 'Open—click to close' : 'Closed—click to open'"
                        @click="toggleDay(idx)"
                        class="tw:relative tw:inline-flex tw:h-6 tw:w-11 tw:shrink-0 tw:cursor-pointer tw:rounded-full tw:border-0 tw:transition-colors focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:ring-offset-2"
                        :class="row.is_open ? 'tw:bg-blue-600' : 'tw:bg-gray-300'"
                    >
                        <span
                            class="tw:pointer-events-none tw:inline-block tw:h-5 tw:w-5 tw:my-0.5 tw:translate-x-0.5 tw:rounded-full tw:bg-white tw:shadow tw:transition tw:duration-200"
                            :class="row.is_open ? 'tw:translate-x-[1.25rem]' : ''"
                        />
                    </button>

                    <input
                        v-model="row.open"
                        type="time"
                        step="300"
                        :disabled="!row.is_open"
                        aria-label="Opens"
                        class="tw:min-w-0 tw:min-h-[2.5rem] tw:w-full tw:rounded-lg tw:border tw:py-2 tw:px-2 tw:text-sm tw:leading-normal tw:text-gray-900 tw:tabular-nums focus:tw:outline-none focus:tw:ring-2 focus:tw:border-transparent focus:tw:ring-blue-500 disabled:tw:cursor-not-allowed disabled:tw:bg-gray-50 disabled:tw:text-gray-400"
                        :class="rowFieldBorder(row)"
                    />
                    <input
                        v-model="row.close"
                        type="time"
                        step="300"
                        :disabled="!row.is_open"
                        aria-label="Closes"
                        class="tw:min-w-0 tw:min-h-[2.5rem] tw:w-full tw:rounded-lg tw:border tw:py-2 tw:px-2 tw:text-sm tw:leading-normal tw:text-gray-900 tw:tabular-nums focus:tw:outline-none focus:tw:ring-2 focus:tw:border-transparent focus:tw:ring-blue-500 disabled:tw:cursor-not-allowed disabled:tw:bg-gray-50 disabled:tw:text-gray-400"
                        :class="rowFieldBorder(row)"
                    />
                </div>
                <p
                    v-if="rowInlineMessage(row)"
                    class="tw:px-2.5 tw:pb-2 tw:pt-0 tw:text-xs tw:text-red-600 tw:leading-snug sm:tw:px-3"
                >
                    {{ rowInlineMessage(row) }}
                </p>
            </div>
        </div>

        <p v-if="errorMessage" class="tw:text-sm tw:text-red-600 tw:flex tw:items-start tw:gap-2">
            <span class="tw:mt-0.5">•</span>
            <span>{{ errorMessage }}</span>
        </p>
    </div>
</template>

<script setup>
import { isClosingAfterOpening } from '@/utils/venueOpeningHours'

defineProps({
    errorMessage: { type: String, default: '' },
})

const schedule = defineModel({
    type: Array,
    required: true,
})

const SHORT = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
}

function shortDay(day) {
    return SHORT[day] ?? day.slice(0, 3)
}

function toggleDay(idx) {
    const row = schedule.value[idx]
    if (!row) return
    row.is_open = !row.is_open
    if (row.is_open) {
        if (!row.open) row.open = '12:00'
        if (!row.close) row.close = '18:00'
    }
}

function rowMissingTimes(row) {
    if (!row.is_open) return false
    return !row.open || !row.close
}

function rowOrderInvalid(row) {
    if (!row.is_open || !row.open || !row.close) return false
    return !isClosingAfterOpening(row.open, row.close)
}

function rowHighlight(row) {
    return rowMissingTimes(row) || rowOrderInvalid(row)
}

function rowFieldBorder(row) {
    return rowHighlight(row) ? 'tw:border-amber-400' : 'tw:border-gray-200'
}

function rowInlineMessage(row) {
    if (rowMissingTimes(row)) return 'Set both opening and closing times.'
    if (rowOrderInvalid(row)) return 'Closing time must be after opening time.'
    return ''
}
</script>
