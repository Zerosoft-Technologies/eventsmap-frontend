<template>
  <header class="tw:fixed tw:top-0 tw:left-0 tw:w-full tw:z-50 tw:bg-transparent tw:py-2 tw:px-4 tw:md:py-3 tw:md:px-8 tw:flex tw:items-center tw:justify-between" >
    <h1 class="tw:font-bold tw:leading-[1.4] tw:tracking-[-0.5px] tw:text-lg">
      The Events Map
    </h1>
    <div class="tw:hidden tw:md:flex tw:items-center tw:gap-3">
      <div class="tw:flex tw:bg-white tw:gap-6 tw:items-center tw:py-3 tw:pr-3 tw:pl-4 tw:border tw:border-(--secondary-color) tw:rounded-lg tw:overflow-hidden" >
        <div class="tw:flex tw:gap-2 tw:cursor-pointer tw:items-center  tw:w-[169px]"><img src="../assets/search.png" alt="Search Icon" /><input type="text" class="tw:outline-none tw:placeholder-(--primary-color)" placeholder="Search for Talent..."></div>
        <div class="tw:w-px tw:h-[22px] tw:bg-(--primary-color)"></div>
        <div class="tw:flex tw:gap-1 tw:cursor-pointer tw:items-center"><img src="../assets/location-01.png" alt="Location Icon" /><p>Amsterdam</p><img src="../assets/chevron-down.png" alt="Chevron Down" class="ml-1" /></div>        
      </div>
      <div>
        <button class="tw:bg-white tw:py-3 tw:hidden tw:gap-2 tw:items-center tw:lg:flex tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg"><img src="../assets/calendar.png" alt="Calendar Icon"/><span>
          <DatePicker />
        </span></button>
      </div>
    </div>
    <button class="tw:lg:hidden tw:text-2xl" @click="menuOpen = !menuOpen">☰</button>

    <div class="tw:hidden tw:lg:flex tw:items-center tw:gap-4">
      <div>
        <button class="tw:bg-white tw:px-4 tw:py-2 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color)"><img src="../assets/favourite.png" alt="Favourite Icon"/><span>Link</span></button>
      </div>
      <div class="tw:h-6 tw:w-px tw:bg-(--primary-color)"></div>
      <div>
        <button class="tw:bg-white tw:px-4 tw:py-2 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/user.png" alt="User Icon"/><span>Create profile</span></button>
      </div>
      <div class="tw:h-6 tw:w-px tw:bg-(--primary-color)"></div>
      <div>
        <button @click="$emit('open-login')" class="tw:bg-white tw:px-4 tw:py-2 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/login.png" alt="Login Icon"/><span>Login</span></button>
      </div>
    </div>

    <transition name="slide-right">
      <div v-if="menuOpen" class="tw:absolute tw:top-full tw:left-0 tw:md:left-auto tw:md:right-0 tw:w-full tw:md:w-1/2 tw:bg-transparent tw:shadow-md tw:p-4 tw:flex tw:flex-col tw:gap-3 tw:lg:hidden tw:transition-all tw:duration-300">
        <div class="tw:flex tw:bg-white tw:md:hidden tw:gap-4 tw:items-center tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Search for Talent...</p>
        </div>
        <div class="tw:bg-white tw:md:hidden tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Amsterdam</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <DatePicker />
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Link</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Create profile</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Login</p>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from "vue";
import DatePicker from "./DatePicker.vue";

const menuOpen = ref(false);
</script>

<style scoped>
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-enter-active {
  transition: all 0.35s ease;
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-leave-active {
  transition: all 0.25s ease;
}
</style>
