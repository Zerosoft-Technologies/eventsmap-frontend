<template>
    <VueTailwindDatepicker 
      placeholder="DD/MM/YYYY ~ DD/MM/YYYY" 
      :formatter="formatter" 
      v-model="dateValue" 
      v-model:session-value="sessionValue"
      :auto-apply="false" 
      :inline="inline"
      :no-input="noInput"
      @update:model-value="onDateUpdate"
      @update:session-value="onSessionUpdate"
    >
      <template #default="{ value, placeholder, clear }">
        <p>{{ value || placeholder }}</p>
      </template>                    
    </VueTailwindDatepicker>
</template>

<script setup>
import { ref, defineEmits, onMounted, defineProps } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";

const { inline, noInput } = defineProps({
  // When used inside the mobile overlay dropdown we want the calendar
  // to be part of normal document flow (no popover overlap).
  inline: { type: Boolean, default: false },
  noInput: { type: Boolean, default: false },
})

const today = new Date();
const pad = (n) => String(n).padStart(2, "0");
let formattedDate = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;

const dateValue = ref([formattedDate, formattedDate]);
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
  console.log('Session updated:', newValue);
  
  // Optional: Save to localStorage
  localStorage.setItem('datepicker-session', JSON.stringify(newValue));
};

// Load session from localStorage on mount
onMounted(() => {
  const stored = localStorage.getItem('datepicker-session');
  if (stored) {
    try {
      sessionValue.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored session:', e);
    }
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>