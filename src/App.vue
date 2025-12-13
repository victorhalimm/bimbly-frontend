<script setup lang="ts">
import Navbar from './components/common/layout/Navbar.vue';
import FooterSection from './views/landing/components/FooterSection.vue';

</script>

<template>
  <Navbar />
  <router-view />
  <FooterSection />
</template>
