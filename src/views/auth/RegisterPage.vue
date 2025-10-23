<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Success Message -->
        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="text-sm text-green-800">
            {{ success }}
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-800">
            {{ error }}
          </div>
        </div>

        <div class="space-y-4">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              v-model="form.phoneNumber"
              type="tel"
              placeholder="081234567890"
              required
              pattern="08[0-9]{8,11}"
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">Format: 08xxxxxxxxxx</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- User Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              I want to register as
            </label>
            <div class="flex gap-4">
              <label class="inline-flex items-center">
                <input
                  v-model="form.userType"
                  type="radio"
                  value="student"
                  required
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Student</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  v-model="form.userType"
                  type="radio"
                  value="tutor"
                  required
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Tutor</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

export default defineComponent({
  name: 'RegisterPage',
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
