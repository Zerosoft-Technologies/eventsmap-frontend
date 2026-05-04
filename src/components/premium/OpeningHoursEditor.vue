<template>
    <div class="tw:space-y-2">
        <p
            class="tw:text-xs tw:leading-snug tw:text-gray-500 sm:tw:text-sm"
            title="Close must be after open per period; split shifts allowed; no overlaps."
        >
            Close after open. Multiple periods per day (no overlap). Closed days: toggle off.
        </p>

        <div class="tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:overflow-hidden">
            <div
                v-for="(row, idx) in schedule"
                :key="row.day"
                class="tw:border-b tw:border-gray-100 last:tw:border-b-0"
                :class="rowHighlight(row) ? 'tw:bg-amber-50/40' : ''"
            >
                <div class="tw:flex tw:items-start tw:gap-2 tw:px-2 tw:py-2 sm:tw:gap-3 sm:tw:px-3 sm:tw:py-2.5">
                    <span
                        class="tw:mt-1.5 tw:w-9 tw:shrink-0 tw:text-sm tw:font-semibold tw:text-gray-900 tw:tabular-nums sm:tw:w-10 sm:tw:text-base"
                        :title="row.day"
                    >
                        {{ shortDay(row.day) }}
                    </span>

                    <button
                        type="button"
                        role="switch"
                        :aria-checked="row.is_open"
                        :aria-label="row.is_open ? 'Open—click to close' : 'Closed—click to open'"
                        @click="toggleDay(idx)"
                        class="tw:relative tw:mt-1 tw:inline-flex tw:h-6 tw:w-11 tw:shrink-0 tw:cursor-pointer tw:rounded-full tw:border-0 tw:transition-colors focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:ring-offset-2"
                        :class="row.is_open ? 'tw:bg-blue-600' : 'tw:bg-gray-300'"
                    >
                        <span
                            class="tw:pointer-events-none tw:inline-block tw:h-5 tw:w-5 tw:my-0.5 tw:translate-x-0.5 tw:rounded-full tw:bg-white tw:shadow tw:transition tw:duration-200"
                            :class="row.is_open ? 'tw:translate-x-[1.25rem]' : ''"
                        />
                    </button>

                    <div class="tw:min-w-0 tw:flex-1 tw:space-y-1.5">
                        <div
                            v-for="(slot, sidx) in row.slots"
                            :key="`${row.day}-slot-${sidx}`"
                            class="tw:flex tw:min-w-0 tw:items-center tw:gap-1"
                        >
                            <input
                                v-model="slot.open"
                                type="time"
                                step="300"
                                :disabled="!row.is_open"
                                :aria-label="`Opens, ${row.day} period ${sidx + 1}`"
                                class="tw:min-h-[2.5rem] tw:min-w-0 tw:flex-1 tw:rounded-lg tw:border tw:py-2 tw:px-2 tw:text-sm tw:leading-normal tw:text-gray-900 tw:tabular-nums focus:tw:outline-none focus:tw:ring-2 focus:tw:border-transparent focus:tw:ring-blue-500 disabled:tw:cursor-not-allowed disabled:tw:bg-gray-50 sm:tw:min-h-[2.75rem] sm:tw:px-3 sm:tw:text-base"
                                :class="slotFieldBorder(row, slot)"
                            />
                            <span class="tw:shrink-0 tw:px-0.5 tw:text-sm tw:text-gray-400 sm:tw:text-base">–</span>
                            <input
                                v-model="slot.close"
                                type="time"
                                step="300"
                                :disabled="!row.is_open"
                                :aria-label="`Closes, ${row.day} period ${sidx + 1}`"
                                class="tw:min-h-[2.5rem] tw:min-w-0 tw:flex-1 tw:rounded-lg tw:border tw:py-2 tw:px-2 tw:text-sm tw:leading-normal tw:text-gray-900 tw:tabular-nums focus:tw:outline-none focus:tw:ring-2 focus:tw:border-transparent focus:tw:ring-blue-500 disabled:tw:cursor-not-allowed disabled:tw:bg-gray-50 sm:tw:min-h-[2.75rem] sm:tw:px-3 sm:tw:text-base"
                                :class="slotFieldBorder(row, slot)"
                            />
                            <button
                                v-if="row.is_open && row.slots.length > 1"
                                type="button"
                                class="tw:flex tw:h-8 tw:w-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:text-base tw:font-medium tw:leading-none tw:text-red-600 hover:tw:bg-red-50"
                                :title="'Remove period'"
                                @click="removeSlot(idx, sidx)"
                            >
                                ×
                            </button>
                            <span v-else class="tw:inline-block tw:w-8 tw:shrink-0" aria-hidden="true" />
                        </div>

                        <button
                            v-if="row.is_open"
                            type="button"
                            class="tw:pt-0.5 tw:text-sm tw:font-medium tw:text-blue-700 hover:tw:text-blue-900 tw:underline tw:underline-offset-2 sm:tw:text-base"
                            @click="addSlot(idx)"
                        >
                            + period
                        </button>
                    </div>
                </div>

                <p
                    v-if="rowInlineMessage(row)"
                    class="tw:px-2 tw:pb-2 tw:pt-0 tw:text-xs tw:leading-snug tw:text-red-600 sm:tw:px-3 sm:tw:text-sm"
                >
                    {{ rowInlineMessage(row) }}
                </p>
            </div>
        </div>

        <p v-if="errorMessage" class="tw:flex tw:items-start tw:gap-2 tw:text-sm tw:text-red-600">
            <span class="tw:mt-0.5">•</span>
            <span>{{ errorMessage }}</span>
        </p>
    </div>
</template>

<script setup>
import {
    areSlotsNonOverlapping,
    createEmptySlot,
    isClosingAfterOpening,
} from '@/utils/venueOpeningHours'

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
        if (!Array.isArray(row.slots) || row.slots.length === 0) {
            row.slots = [createEmptySlot()]
        }
        const only = row.slots[0]
        if (row.slots.length === 1 && only && !only.open && !only.close) {
            only.open = '12:00'
            only.close = '18:00'
        }
    } else {
        row.slots = [createEmptySlot()]
    }
}

function addSlot(dayIdx) {
    const row = schedule.value[dayIdx]
    if (!row) return
    if (!Array.isArray(row.slots)) row.slots = []
    row.slots.push(createEmptySlot())
}

function removeSlot(dayIdx, slotIdx) {
    const row = schedule.value[dayIdx]
    if (!row?.slots || row.slots.length <= 1) return
    row.slots.splice(slotIdx, 1)
}

function slotMissingTimes(row, slot) {
    if (!row.is_open) return false
    return !slot.open || !slot.close
}

function slotOrderInvalid(row, slot) {
    if (!row.is_open || !slot.open || !slot.close) return false
    return !isClosingAfterOpening(slot.open, slot.close)
}

function rowMissingAnySlotTimes(row) {
    if (!row.is_open) return false
    return row.slots.some((slot) => slotMissingTimes(row, slot))
}

function rowAnySlotOrderInvalid(row) {
    if (!row.is_open) return false
    return row.slots.some((slot) => slotOrderInvalid(row, slot))
}

function rowOverlapInvalid(row) {
    if (!row.is_open) return false
    const filled = row.slots.filter((s) => s.open && s.close)
    if (filled.length < 2) return false
    return !areSlotsNonOverlapping(row.slots)
}

function rowHighlight(row) {
    return rowMissingAnySlotTimes(row) || rowAnySlotOrderInvalid(row) || rowOverlapInvalid(row)
}

function slotFieldBorder(row, slot) {
    const bad =
        row.is_open &&
        (slotMissingTimes(row, slot) || slotOrderInvalid(row, slot) || rowOverlapInvalid(row))
    return bad ? 'tw:border-amber-400' : 'tw:border-gray-200'
}

function rowInlineMessage(row) {
    if (rowMissingAnySlotTimes(row)) return 'Fill each period or remove empties.'
    if (rowAnySlotOrderInvalid(row)) return 'Closing time must be after opening.'
    if (rowOverlapInvalid(row)) return 'Periods cannot overlap (e.g. end 12:00 → start 12:00 is ok).'
    return ''
}
</script>
