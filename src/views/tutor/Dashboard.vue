<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold">Bimbly - Tutor Dashboard</h1>
          </div>
          <div class="flex items-center">
            <span class="mr-4">Welcome, {{ userName }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h2 class="text-2xl font-semibold mb-4">Tutor Dashboard</h2>
        <p class="text-gray-600">
          This is a placeholder for the tutor dashboard. Features will be implemented in Phase 2.
        </p>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TutorDashboard',
  computed: {
    userName() {
      return useAuthStore().userName;
    },
  },
  methods: {
    async handleLogout() {
      const authStore = useAuthStore();
      const router = useRouter();
      await authStore.logout();
      router.push('/login');
    },
  },
});
</script>
