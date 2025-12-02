<template>
  <div class="min-h-screen bg-white flex">
    <!-- Left Side - Decorative Content (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden items-center justify-center p-12">
      <!-- Decorative Blobs -->
      <div class="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-3xl animate-blob"></div>
      <div class="absolute bottom-20 left-20 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

      <!-- Floating Dots -->
      <div class="absolute top-1/4 left-10 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-500"></div>
      <div class="absolute bottom-1/3 right-20 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-md">
        <div class="mb-8">
          <h1 class="text-5xl font-black text-gray-900 leading-tight mb-6">
            Welcome back to
            <span class="block mt-2">
              <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Bimbly</span>
            </span>
          </h1>
          <p class="text-xl text-gray-600 leading-relaxed">
            Continue your learning journey with qualified tutors who inspire academic excellence.
          </p>
        </div>

        <!-- Feature Pills -->
        <div class="space-y-4">
          <div class="flex items-center gap-4 bg-white rounded-[2rem] p-4 shadow-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span class="text-2xl">📚</span>
            </div>
            <div>
              <div class="font-bold text-gray-900">Personalized Learning</div>
              <div class="text-sm text-gray-600">One-on-one sessions tailored to you</div>
            </div>
          </div>

          <div class="flex items-center gap-4 bg-white rounded-[2rem] p-4 shadow-lg">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <span class="text-2xl">⭐</span>
            </div>
            <div>
              <div class="font-bold text-gray-900">Qualified Tutors</div>
              <div class="text-sm text-gray-600">Verified experts in their subjects</div>
            </div>
          </div>

          <div class="flex items-center gap-4 bg-white rounded-[2rem] p-4 shadow-lg">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <span class="text-2xl">📈</span>
            </div>
            <div>
              <div class="font-bold text-gray-900">Track Progress</div>
              <div class="text-sm text-gray-600">See your improvement over time</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Logo & Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
            <span class="text-4xl">🎓</span>
          </div>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
            Welcome to
            <span class="text-blue-600" style="font-family: 'Comic Sans MS', cursive; font-style: italic;">Bimbly</span>
          </h2>
          <p class="text-lg text-gray-600">Let's sign you in</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="mb-6 flex items-start gap-3 px-5 py-4 bg-red-50 text-red-900 rounded-xl border-2 border-red-200">
          <svg class="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <p class="font-semibold">{{ error }}</p>
          </div>
          <button @click="error = null" class="text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.email }"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="Enter your password"
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <router-link
              to="/forgot-password"
              class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Login</span>
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t-2 border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500 font-medium">
              Don't have an account?
            </span>
          </div>
        </div>

        <!-- Sign Up Link -->
        <router-link
          to="/register"
          class="block w-full text-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full text-lg font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
        >
          Sign up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

export default defineComponent({
  name: 'LoginPage',
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
      showPassword: false,
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

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.05);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.95);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.02);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
