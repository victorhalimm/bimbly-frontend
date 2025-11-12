<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>

        <div v-if="loading" class="mt-8">
          <p class="text-gray-600">Verifying your email...</p>
        </div>

        <div v-else-if="success" class="mt-8">
          <div class="rounded-md bg-green-50 p-4">
            <div class="text-sm text-green-800">
              Email verified successfully! You can now log in.
            </div>
          </div>
          <div class="mt-4">
            <router-link
              to="/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </router-link>
          </div>
        </div>

        <div v-else-if="error" class="mt-8">
          <div class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-800">{{ error }}</div>
          </div>
          <div class="mt-4">
            <router-link
              to="/login"
              class="text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

export default defineComponent({
  name: 'EmailVerification',
  data() {
    return {
      loading: false,
      success: false,
      error: null as string | null,
    };
  },
  async mounted() {
    const token = this.$route.query.token as string;

    if (!token) {
      this.error = 'Invalid or missing verification token';
      return;
    }

    this.loading = true;
    const authStore = useAuthStore();

    try {
      await authStore.verifyEmail(token);
      this.success = true;
    } catch (error: any) {
      this.error = error.response?.data?.message || 'Email verification failed';
    } finally {
      this.loading = false;
    }
  },
});
</script>
