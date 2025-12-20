<template>
  <div class="min-h-screen">
    <Navbar
      :notificationCount="unreadCount"
      :unreadMessages="unreadMessages"
      @open-notifications="showNotificationDialog = true"
    />
    <NotificationDialog
      :isOpen="showNotificationDialog"
      @close="showNotificationDialog = false"
    />
    <router-view />
    <FooterSection />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/common/layout/Navbar.vue';
import FooterSection from './views/landing/components/FooterSection.vue';
import NotificationDialog from './components/notification/NotificationDialog.vue';
import { useNotificationStore } from './stores/notification.store';
import { useAuthStore } from './stores/auth.store';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    FooterSection,
    NotificationDialog,
  },
  data() {
    return {
      showNotificationDialog: false,
      unreadMessages: 0,
      pollingInterval: null as number | null,
    };
  },
  computed: {
    notificationStore() {
      return useNotificationStore();
    },
    authStore() {
      return useAuthStore();
    },
    unreadCount(): number {
      return this.notificationStore.unreadCount;
    },
    isAuthenticated(): boolean {
      return this.authStore.isAuthenticated;
    },
  },
  watch: {
    isAuthenticated(newValue: boolean) {
      if (newValue) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    },
  },
  mounted() {
    if (this.isAuthenticated) {
      this.startPolling();
    }
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    startPolling() {
      this.notificationStore.fetchUnreadCount();
      this.pollingInterval = window.setInterval(() => {
        this.notificationStore.fetchUnreadCount();
      }, 30000);
    },
    stopPolling() {
      if (this.pollingInterval !== null) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
  },
});
</script>
