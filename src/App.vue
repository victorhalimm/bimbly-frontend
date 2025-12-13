<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Navbar from './components/common/layout/Navbar.vue';

const route = useRoute();
const showNavbar = computed(() => !route.meta.hideNavbar);
</script>

<template>
  <Navbar v-if="showNavbar" />
  <router-view />
</template>
