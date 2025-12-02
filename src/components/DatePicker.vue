<template>
    <vue-tailwind-datepicker placeholder="DD/MM/YYYY ~ DD/MM/YYYY" :formatter="formatter" v-model="dateValue" :auto-apply="false" @update:model-value="onUpdate">
      <template #default="{ value, placeholder, clear }">
        <p>{{ value || placeholder }}</p>
      </template>                    
    </vue-tailwind-datepicker>
</template>
<script setup>
import { ref } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
const today = new Date();
const pad = (n) => String(n).padStart(2, "0");
let formattedDate = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;

const dateValue = ref([formattedDate, formattedDate]);
const formatter = ref({
  date: "DD/MM/YYYY",
  month: "MMM"
});

const onUpdate = (newValue) => {
  console.log("Date changed:", newValue);
};

</script>

<style scoped>

</style>