<template>
  <div class="min-h-screen bg-amber-50">
    <nav class="bg-white border-b-4 border-black shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 sm:h-20">
          <div class="flex items-center space-x-4 sm:space-x-8">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">🎓 <span class="hidden sm:inline">Bimbly</span> Admin</h1>
            <div class="hidden md:flex space-x-2">
              <router-link
                to="/admin/dashboard"
                class="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white border-4 border-black shadow-md hover:-translate-y-1 transition-transform"
              >
                Dashboard
              </router-link>
              <router-link
                to="/admin/users"
                class="px-4 py-2 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md hover:-translate-y-1 transition-transform"
              >
                Users
              </router-link>
              <router-link
                to="/admin/tutor-applications"
                class="px-4 py-2 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md hover:-translate-y-1 transition-transform"
              >
                Applications
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <span class="hidden sm:inline text-sm font-bold text-gray-900">{{ userName }}</span>
            <neo-button variant="danger" size="sm" @click="handleLogout" class="hidden sm:inline-flex">
              Logout
            </neo-button>
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden w-10 h-10 bg-primary border-4 border-black rounded-lg flex items-center justify-center hover:-translate-y-1 transition-transform"
              aria-label="Toggle menu"
            >
              <span class="text-white text-xl font-black">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>

        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t-4 border-black mt-4 pt-4 space-y-2">
          <router-link
            to="/admin/dashboard"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold bg-primary text-white border-4 border-black shadow-md"
          >
            Dashboard
          </router-link>
          <router-link
            to="/admin/users"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md"
          >
            Users
          </router-link>
          <router-link
            to="/admin/tutor-applications"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md"
          >
            Applications
          </router-link>
          <div class="pt-2 border-t-2 border-gray-300 mt-2">
            <p class="text-sm font-bold text-gray-700 px-4 py-2">{{ userName }}</p>
            <neo-button variant="danger" size="sm" @click="handleLogout" class="w-full">
              Logout
            </neo-button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-black border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-lg font-bold text-gray-900">Loading...</p>
        </div>
      </div>

      <div v-else class="space-y-6 sm:space-y-8">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-1 sm:w-2 h-8 sm:h-12 bg-primary border-2 border-black"></div>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">Platform Statistics</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <neo-card variant="elevated" class="bg-gradient-to-br from-blue-400 to-blue-500 text-white">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-xs sm:text-sm font-bold uppercase tracking-wide opacity-90">Total Users</p>
                <p class="text-3xl sm:text-4xl lg:text-5xl font-black mt-2">{{ stats.totalUsers }}</p>
              </div>
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/30 flex items-center justify-center transform rotate-6">
                <span class="text-3xl sm:text-4xl lg:text-5xl">👥</span>
              </div>
            </div>
          </neo-card>

          <neo-card variant="elevated" class="bg-gradient-to-br from-green-400 to-green-500 text-white">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-xs sm:text-sm font-bold uppercase tracking-wide opacity-90">Students</p>
                <p class="text-3xl sm:text-4xl lg:text-5xl font-black mt-2">{{ stats.totalStudents }}</p>
              </div>
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/30 flex items-center justify-center transform -rotate-6">
                <span class="text-3xl sm:text-4xl lg:text-5xl">🎓</span>
              </div>
            </div>
          </neo-card>

          <neo-card variant="elevated" class="bg-gradient-to-br from-purple-400 to-purple-500 text-white">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-xs sm:text-sm font-bold uppercase tracking-wide opacity-90">Tutors</p>
                <p class="text-3xl sm:text-4xl lg:text-5xl font-black mt-2">{{ stats.totalTutors }}</p>
                <p class="text-xs font-bold mt-1 sm:mt-2 opacity-90">{{ stats.approvedTutors }} approved</p>
              </div>
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/30 flex items-center justify-center transform rotate-6">
                <span class="text-3xl sm:text-4xl lg:text-5xl">👨‍🏫</span>
              </div>
            </div>
          </neo-card>

          <neo-card variant="elevated" class="bg-gradient-to-br from-orange-400 to-orange-500 text-white">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-xs sm:text-sm font-bold uppercase tracking-wide opacity-90">Pending Apps</p>
                <p class="text-3xl sm:text-4xl lg:text-5xl font-black mt-2">{{ stats.pendingApplications }}</p>
              </div>
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white/30 flex items-center justify-center transform -rotate-6">
                <span class="text-3xl sm:text-4xl lg:text-5xl">📋</span>
              </div>
            </div>
          </neo-card>
        </div>

        <neo-card variant="elevated" class="bg-white">
          <div class="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div class="w-1 sm:w-2 h-6 sm:h-8 bg-primary border-2 border-black"></div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900">Quick Actions</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <router-link
              to="/admin/users"
              class="group relative p-4 sm:p-6 border-4 border-black rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all"
            >
              <div class="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400 border-2 sm:border-4 border-black rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span class="text-xl sm:text-2xl">👥</span>
              </div>
              <h4 class="text-lg sm:text-xl font-black text-gray-900 mb-1 sm:mb-2 pr-12">Manage Users</h4>
              <p class="text-xs sm:text-sm font-bold text-gray-700">View and manage all users</p>
            </router-link>

            <router-link
              to="/admin/tutor-applications"
              class="group relative p-4 sm:p-6 border-4 border-black rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all"
            >
              <div class="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-pink-400 border-2 sm:border-4 border-black rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span class="text-xl sm:text-2xl">📋</span>
              </div>
              <h4 class="text-lg sm:text-xl font-black text-gray-900 mb-1 sm:mb-2 pr-12">Review Applications</h4>
              <p class="text-xs sm:text-sm font-bold text-gray-700">Approve or reject tutor applications</p>
            </router-link>

            <div class="relative p-4 sm:p-6 border-4 border-black rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg opacity-60 cursor-not-allowed">
              <div class="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 border-2 sm:border-4 border-black rounded-full flex items-center justify-center">
                <span class="text-xl sm:text-2xl">⚙️</span>
              </div>
              <h4 class="text-lg sm:text-xl font-black text-gray-900 mb-1 sm:mb-2 pr-12">Platform Settings</h4>
              <p class="text-xs sm:text-sm font-bold text-gray-700">Coming soon</p>
            </div>
          </div>
        </neo-card>
      </div>
    </main>
  </div>
</template>

<script>
import { adminService } from '@/services/adminService';
import { useAuthStore } from '@/stores/auth.store';
import NeoButton from '@/components/common/ui/NeoButton.vue';
import NeoCard from '@/components/common/ui/NeoCard.vue';

export default {
  name: 'AdminDashboard',
  components: {
    NeoButton,
    NeoCard,
  },
  data() {
    return {
      loading: true,
      mobileMenuOpen: false,
      stats: {
        totalUsers: 0,
        totalStudents: 0,
        totalTutors: 0,
        approvedTutors: 0,
        pendingApplications: 0,
        totalBookings: 0,
        totalRevenue: 0,
      },
    };
  },
  computed: {
    userName() {
      return useAuthStore().userName;
    },
  },
  async mounted() {
    await this.loadStats();
  },
  methods: {
    async loadStats() {
      try {
        this.loading = true;
        this.stats = await adminService.getStats();
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        this.loading = false;
      }
    },
    async handleLogout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    },
  },
};
</script>
