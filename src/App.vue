<template>
  <div class="min-h-screen">
    <Navbar/>
    <router-view />
    <FooterSection />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/common/layout/Navbar.vue';
import FooterSection from './views/landing/components/FooterSection.vue';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    FooterSection,
  }
});
</script>
