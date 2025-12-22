<template>
  <Header @open-login="isLoginOpen = true"></Header>
  <LoginPopup :isOpen="isLoginOpen" @close="isLoginOpen = false" />
  <router-view />
</template>

<script setup>
  import LoginPopup from './components/LoginPopup.vue'
  import Header from './components/Header.vue'
  import { ref, watch } from 'vue';
  
  const isLoginOpen = ref(false);
  watch(isLoginOpen, (newVal, oldVal) => {
  })
</script>