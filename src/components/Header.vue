<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-transparent py-2 px-4 md:py-3 md:px-8 flex items-center justify-between" >
    <h1 class="font-bold leading-[1.4] tracking-[-0.5px] text-lg">
      The Events Map
    </h1>
    <div class="hidden md:flex items-center gap-3">
      <div class="flex bg-white gap-6 items-center py-3 pr-3 pl-4 border border-[var(--secondary-color)] rounded-lg overflow-hidden" >
        <div class="flex gap-2 cursor-pointer items-center  w-[169px]"><img src="../assets/search.png" alt="Search Icon" /><input type="text" class="outline-none placeholder-[var(--primary-color)]" placeholder="Search for Talent..."></div>
        <div class="w-px h-[22px] bg-[var(--primary-color)]"></div>
        <div class="flex gap-1 cursor-pointer items-center"><img src="../assets/location-01.png" alt="Location Icon" /><p>Amsterdam</p><img src="../assets/chevron-down.png" alt="Chevron Down" class="ml-1" /></div>        
      </div>
      <div class="overflow-hidden">
        <button class="bg-white py-3 hidden gap-2 items-center lg:flex px-4 border border-[var(--secondary-color)] rounded-lg"><img src="../assets/calendar.png" alt="Calendar Icon"/><span>Date of today</span></button>
      </div>
    </div>
    <button class="lg:hidden text-2xl" @click="menuOpen = !menuOpen">☰</button>

    <div class="hidden lg:flex items-center gap-4">
      <div>
        <button class="bg-white px-4 py-2 rounded-[6px] flex gap-1 items-center border border-[var(--secondary-color)]"><img src="../assets/favourite.png" alt="Favourite Icon"/><span>Link</span></button>
      </div>
      <div class="h-6 w-px bg-[var(--primary-color)]"></div>
      <div>
        <button class="bg-white px-4 py-2 rounded-[6px] flex items-center border gap-1 border-[var(--secondary-color)]"><img src="../assets/user.png" alt="User Icon"/><span>Create profile</span></button>
      </div>
      <div class="h-6 w-px bg-[var(--primary-color)]"></div>
      <div>
        <button @click="$emit('open-login')" class="bg-white px-4 py-2 rounded-[6px] flex items-center border gap-1 border-[var(--secondary-color)]"><img src="../assets/login.png" alt="Login Icon"/><span>Login</span></button>
      </div>
    </div>

    <transition name="slide-right">
      <div v-if="menuOpen" class="absolute top-full left-0 md:left-auto md:right-0 w-full md:w-1/2 bg-transparent shadow-md p-4 flex flex-col gap-3 lg:hidden transition-all duration-300">
        <div class="flex bg-white md:hidden gap-4 items-center py-3 px-4 border border-[var(--secondary-color)] rounded-lg">
          <p>Search for Talent...</p>
        </div>
        <div class="bg-white md:hidden py-3 px-4 border border-[var(--secondary-color)] rounded-lg">
          <p>Amsterdam</p>
        </div>
        <div class="bg-white py-3 px-4 border border-[var(--secondary-color)] rounded-lg">
          <p>Date of today</p>
        </div>
        <div class="bg-white py-3 px-4 border border-[var(--secondary-color)] rounded-lg">
          <p>Link</p>
        </div>
        <div class="bg-white py-3 px-4 border border-[var(--secondary-color)] rounded-lg">
          <p>Create profile</p>
        </div>
        <div class="bg-white py-3 px-4 border border-[var(--secondary-color)] rounded-lg"  >
          <p>Login</p>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from "vue";

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
