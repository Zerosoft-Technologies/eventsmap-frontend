<template>
  <Header @open-login="isLoginOpen = true"></Header>
  <LoginPopup :isOpen="isLoginOpen" @close="isLoginOpen = false" />
  <router-view />
</template>

<script setup>
  import Header from './components/Header.vue'
  import LoginPopup from './components/LoginPopup.vue'
  import { ref, watch } from 'vue';
  
  const isLoginOpen = ref(false);
  watch(isLoginOpen, (newVal, oldVal) => {
    console.log('isLoginOpen changed:', oldVal, '=>', newVal)
  })
</script>