<template>
    <transition name="fade">
      <div class="tw:fixed tw:bg-white tw:bottom-[50px] tw:left-14 z-50">        
        <div class="tw:bg-white tw:rounded-lg tw:shadow-l tw:p-6">                    
          <h2 class="tw:text-xl tw:font-bold tw:mb-4">Overlay Popup</h2>
          <p class="tw:mb-4">
            This is a simple overlay popup using Vue and Tailwind CSS.
          </p>          
        </div>
      </div>
    </transition>  
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
