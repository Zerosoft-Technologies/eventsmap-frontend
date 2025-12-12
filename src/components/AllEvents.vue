<template>
    <transition name="fade">
      <div class="tw:fixed tw:p-4 tw:bg-white  tw:rounded-lg tw:md:left-7 tw:bottom-2 tw:z-50 tw:lg:z-10">   
        <div class="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <h3 class="tw:font-semibold tw:text-2xl tw:leading-[1.35] tw:tracking-[-0.006em]">All Events</h3>
          <img class="tw:cursor-pointer" @click="close" src="../assets/cancel.png" alt="Close icon">
        </div>        
        <div class="tw:max-h-[80vh] tw:lg:max-h-[60vh] tw:space-y-4 tw:pr-2 tw:overflow-y-auto">
          <div v-for="event in events" :key="event.id">
            <Event :event="event"></Event>
          </div>
          <div class="tw:text-center">
            <button @click="reset" class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">                
                Reset Search
            </button>
          </div>
        </div>
      </div>
    </transition>  
</template>
<script setup>
import Event from './Event.vue';

defineProps({
  events: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['closeResults', 'resetSearch']);

function reset (){
  emit('resetSearch')
}

function close(){  
  emit('closeResults')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 999px;
}
</style>


