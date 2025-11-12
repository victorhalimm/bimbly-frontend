<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="grid grid-cols-12 gap-4 p-4">
        <div v-for="i in 100" :key="i" class="w-2 h-2 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Geometric Shapes -->
    <div class="absolute top-20 right-20 w-40 h-40 border-4 border-black rounded-lg transform rotate-12" style="background-color: var(--color-warning-200);"></div>
    <div class="absolute bottom-20 left-20 w-32 h-32 border-4 border-black rounded-full" style="background-color: var(--color-primary-200);"></div>
    <div class="absolute top-40 left-60 w-24 h-24 border-4 border-black transform rotate-45" style="background-color: var(--color-success);"></div>

    <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Main Card -->
        <div class="bg-white border-4 border-black rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="bg-success border-b-4 border-black p-8 text-center">
            <div class="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
              <div class="text-4xl">🚀</div>
            </div>
            <h1 class="text-3xl font-black text-white mb-2">
              Join Bimbly Today!
            </h1>
            <p class="text-lg font-medium text-white">
              Create your account and start learning
            </p>
          </div>

          <!-- Form Content -->
          <div class="p-8">
            <!-- Success Message -->
            <NeoAlert
              v-if="success"
              variant="success"
              :message="success"
              auto-dismiss
              class="mb-6"
            />

            <!-- Error Message -->
            <NeoAlert
              v-if="error"
              variant="error"
              :message="error"
              dismissible
              @dismiss="error = null"
              class="mb-6"
            />

            <form class="space-y-6" @submit.prevent="handleRegister">
              <!-- Full Name -->
              <NeoInput
                v-model="form.fullName"
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                required
              />

              <!-- Email -->
              <NeoInput
                v-model="form.email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                autocomplete="email"
                required
              />

              <!-- Phone Number -->
              <NeoInput
                v-model="form.phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="081234567890"
                pattern="08[0-9]{8,11}"
                helper-text="Format: 08xxxxxxxxxx"
                required
              />

              <!-- Password -->
              <NeoInput
                v-model="form.password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                autocomplete="new-password"
                minlength="8"
                helper-text="Minimum 8 characters"
                required
              />

              <!-- Confirm Password -->
              <NeoInput
                v-model="form.confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                autocomplete="new-password"
                :error-message="passwordMatchError"
                required
              />

              <!-- User Type -->
              <NeoRadio
                v-model="form.userType"
                label="I want to register as"
                :options="[
                  { label: 'Student', value: 'student' },
                  { label: 'Tutor', value: 'tutor' },
                ]"
                name="userType"
                helper-text="Choose your role on the platform"
                required
              />

              <!-- Submit Button -->
              <NeoButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="loading"
                full-width
                class="mt-8"
              >
                <span v-if="loading">Creating Account...</span>
                <span v-else>Create Account</span>
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

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-lg text-gray-600 font-medium mb-4">
                Already have an account?
              </p>
              <NeoButton
                variant="secondary"
                size="lg"
                full-width
                @click="$router.push('/login')"
              >
                Sign In
              </NeoButton>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-8 grid grid-cols-3 gap-4">
          <div class="bg-white border-4 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div class="w-12 h-12 bg-success border-2 border-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-900">Verified</span>
          </div>

          <div class="bg-white border-4 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div class="w-12 h-12 bg-primary border-2 border-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-900">Community</span>
          </div>

          <div class="bg-white border-4 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div class="w-12 h-12 bg-warning border-2 border-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-900">Support</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { NeoButton, NeoInput, NeoRadio, NeoAlert } from '../../components/common/ui';

export default defineComponent({
  name: 'RegisterPage',
  components: {
    NeoButton,
    NeoInput,
    NeoRadio,
    NeoAlert,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '',
        userType: 'student' as 'student' | 'tutor',
      },
      error: null as string | null,
      success: null as string | null,
    };
  },
  computed: {
    loading() {
      const authStore = useAuthStore();
      return authStore.loading;
    },
    passwordMatchError() {
      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
        return 'Passwords do not match';
      }
      return '';
    },
  },
  methods: {
    async handleRegister() {
      this.error = null;
      this.success = null;

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      const authStore = useAuthStore();

      try {
        await authStore.register({
          email: this.form.email,
          password: this.form.password,
          fullName: this.form.fullName,
          phoneNumber: this.form.phoneNumber,
          userType: this.form.userType,
        });

        this.success = 'Registration successful! Please check your email to verify your account.';

        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed. Please try again.';
      }
    },
  },
});
</script>
