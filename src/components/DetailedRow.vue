<template>
<div class="tw:flex tw:items-center tw:leading-[1.6] tw:gap-2 tw:text-[10px]">
<img :src="iconUrl" :alt="`${icon} icon`">
<a href="{{ link }}" v-if="link">{{ text }}</a>
<span v-else>
    {{ text }}
</span>
</div>
</template>


<script setup>
import { computed } from "vue"; 

const props = defineProps({
    icon: String,
    text: String,
    link: {
        type: String,
        required: false
    }
})

const iconUrl = new URL(`../assets/${props.icon}.png`, import.meta.url).href

// const iconClass = computed(() => `lucide-${props.icon} w-4 h-4 text-gray-500`)
</script>