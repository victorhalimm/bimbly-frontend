<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="grid grid-cols-12 gap-4 p-4">
        <div v-for="i in 100" :key="i" class="w-2 h-2 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Geometric Shapes -->
    <div class="absolute top-20 left-20 w-40 h-40 border-4 border-black rounded-full" style="background-color: var(--color-primary-200);"></div>
    <div class="absolute bottom-20 right-20 w-32 h-32 border-4 border-black transform rotate-12" style="background-color: var(--color-warning-200);"></div>
    <div class="absolute top-40 right-60 w-24 h-24 border-4 border-black rounded-lg transform rotate-45" style="background-color: var(--color-success);"></div>

    <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Main Card -->
        <div class="bg-white border-4 border-black rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="bg-primary border-b-4 border-black p-8 text-center">
            <div class="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
              <div class="text-4xl">🎓</div>
            </div>
            <h1 class="text-3xl font-black text-white mb-2">
              Welcome Back!
            </h1>
            <p class="text-lg font-medium text-white">
              Sign in to your Bimbly account
            </p>
          </div>

          <!-- Form Content -->
          <div class="p-8">
            <!-- Error Message -->
            <NeoAlert
              v-if="error"
              variant="error"
              :message="error"
              dismissible
              @dismiss="error = null"
              class="mb-6"
            />

            <form class="space-y-6" @submit.prevent="handleLogin">
              <!-- Email Input -->
              <NeoInput
                v-model="form.email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                :error-message="errors.email"
                required
                autocomplete="email"
              />

              <!-- Password Input -->
              <NeoInput
                v-model="form.password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                :error-message="errors.password"
                required
                autocomplete="current-password"
              />

              <!-- Forgot Password Link -->
              <div class="text-center">
                <router-link
                  to="/forgot-password"
                  class="text-primary font-black text-lg hover:underline transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Forgot your password?
                </router-link>
              </div>

              <!-- Submit Button -->
              <NeoButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="loading"
                full-width
                class="mt-8"
              >
                <span v-if="loading">Signing in...</span>
                <span v-else>Sign In</span>
              </NeoButton>
            </form>

            <!-- Divider -->
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t-4 border-black"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-lg font-bold text-gray-900">
                  OR
                </span>
              </div>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-lg text-gray-600 font-medium mb-4">
                Don't have an account yet?
              </p>
              <NeoButton
                variant="secondary"
                size="lg"
                full-width
                @click="$router.push('/register')"
              >
                Create New Account
              </NeoButton>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-8 grid grid-cols-3 gap-4">
          <div class="bg-white border-4 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div class="w-12 h-12 bg-primary border-2 border-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-900">Secure</span>
          </div>

          <div class="bg-white border-4 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div class="w-12 h-12 bg-success border-2 border-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-900">Fast</span>
          </div>

          <div class="bg-white border-4 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div class="w-12 h-12 bg-warning border-2 border-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-900">Trusted</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { NeoButton, NeoInput, NeoAlert } from '@/components/common/ui';

export default defineComponent({
  name: 'LoginPage',
  components: {
    NeoButton,
    NeoInput,
    NeoAlert,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: null as string | null,
      errors: {
        email: '',
        password: '',
      },
    };
  },
  computed: {
    loading() {
      const authStore = useAuthStore();
      return authStore.loading;
    },
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.errors = { email: '', password: '' };
      const authStore = useAuthStore();

      // Basic validation
      if (!this.form.email) {
        this.errors.email = 'Email is required';
        return;
      }
      if (!this.form.password) {
        this.errors.password = 'Password is required';
        return;
      }

      try {
        await authStore.login(this.form);

        // Redirect based on user role
        if (authStore.isStudent) {
          this.$router.push('/student/dashboard');
        } else if (authStore.isTutor) {
          this.$router.push('/tutor/dashboard');
        } else if (authStore.isAdmin) {
          this.$router.push('/admin/dashboard');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed. Please check your credentials.';
      }
    },
  },
});
</script>
