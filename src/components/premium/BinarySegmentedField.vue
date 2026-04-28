<template>
    <div
        :class="[
            'tw:border tw:transition-shadow',
            compact
                ? 'tw:rounded-xl tw:px-3 tw:py-2'
                : 'tw:rounded-2xl tw:px-4 tw:py-3 tw:md:px-5 tw:md:py-4',
            error ? 'tw:border-red-300 tw:bg-red-50/40 tw:shadow-sm' : 'tw:border-gray-200/90 tw:bg-white tw:shadow-sm hover:tw:shadow-md',
        ]"
    >
        <div
            :class="[
                'tw:flex tw:items-center tw:justify-between tw:gap-2',
                compact ? 'tw:gap-2' : 'tw:flex-col tw:gap-3 lg:tw:flex-row lg:tw:items-center lg:tw:justify-between',
            ]"
        >
            <div class="tw:min-w-0 tw:flex-1">
                <p :class="compact ? 'tw:text-xs tw:font-semibold tw:text-gray-900 tw:leading-snug' : 'tw:text-sm tw:font-semibold tw:text-gray-900'">
                    {{ label }}
                </p>
                <p v-if="hint" :class="compact ? 'tw:text-[11px] tw:text-gray-500 tw:mt-0.5 tw:leading-snug' : 'tw:text-xs tw:text-gray-500 tw:mt-0.5 tw:leading-snug'">{{ hint }}</p>
            </div>
            <div
                :class="[
                    'tw:inline-flex tw:shrink-0 tw:p-0.5 tw:rounded-lg tw:bg-gray-100/90 tw:border tw:border-gray-200/80 tw:shadow-inner',
                    compact ? '' : 'tw:p-1 tw:rounded-xl',
                ]"
                role="group"
                :aria-label="label"
            >
                <button
                    type="button"
                    @click="set(true)"
                    :class="segmentClass(modelValue === true)"
                    :aria-pressed="modelValue === true"
                >
                    {{ yesLabel }}
                </button>
                <button
                    type="button"
                    @click="set(false)"
                    :class="segmentClass(modelValue === false)"
                    :aria-pressed="modelValue === false"
                >
                    {{ noLabel }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: { type: String, required: true },
    hint: { type: String, default: '' },
    yesLabel: { type: String, default: 'Yes' },
    noLabel: { type: String, default: 'No' },
    error: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
})

const modelValue = defineModel({ required: false, default: null })

function set(next) {
    modelValue.value = next
}

function segmentClass(active) {
    const base = props.compact
        ? 'tw:px-2.5 tw:py-1 tw:rounded-md tw:text-xs tw:font-medium tw:transition-all tw:duration-200 tw:min-w-[2.75rem]'
        : 'tw:px-4 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium tw:transition-all tw:duration-200 tw:min-w-[4.5rem]'
    if (active) {
        return `${base} tw:bg-white tw:text-gray-900 tw:shadow-md tw:ring-1 tw:ring-gray-200/80`
    }
    return `${base} tw:text-gray-500 hover:tw:text-gray-800`
}
</script>
