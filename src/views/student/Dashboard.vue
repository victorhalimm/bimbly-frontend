<template>
  <div class="min-h-screen bg-gray-50">
    <BHeader :user="headerUser" @logout="handleLogout" />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h2 class="text-2xl font-semibold mb-4">Student Dashboard</h2>
        <p class="text-gray-600">
          This is a placeholder for the student dashboard. Features will be implemented in Phase 2.
        </p>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import BHeader from '../../components/common/layout/Header.vue';

export default defineComponent({
  name: 'StudentDashboard',
  components: {
    BHeader,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const headerUser = computed(() => ({
      name: authStore.user?.fullName || 'Student',
      email: authStore.user?.email,
      avatar: authStore.user?.profileImageUrl,
      role: 'student' as const,
    }));

    const handleLogout = async () => {
      await authStore.logout();
      router.push('/login');
    };

    return {
      headerUser,
      handleLogout,
    };
  },
});
</script>
