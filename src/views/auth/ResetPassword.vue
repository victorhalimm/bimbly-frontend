<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="text-sm text-green-800">{{ success }}</div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-800">{{ error }}</div>
        </div>

        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? 'Resetting...' : 'Reset password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'ResetPassword',
  data() {
    return {
      form: {
        password: '',
        confirmPassword: '',
      },
      error: null as string | null,
      success: null as string | null,
    };
  },
  computed: {
    loading() {
      return useAuthStore().loading;
    },
  },
  methods: {
    async handleResetPassword() {
      this.error = null;
      this.success = null;

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      const route = useRoute();
      const token = route.query.token as string;

      if (!token) {
        this.error = 'Invalid or missing reset token';
        return;
      }

      const authStore = useAuthStore();
      const router = useRouter();

      try {
        await authStore.resetPassword(token, this.form.password);
        this.success = 'Password reset successful! Redirecting to login...';
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to reset password';
      }
    },
  },
});
</script>
