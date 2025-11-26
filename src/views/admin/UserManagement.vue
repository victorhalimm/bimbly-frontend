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
                class="px-4 py-2 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md hover:-translate-y-1 transition-transform"
              >
                Dashboard
              </router-link>
              <router-link
                to="/admin/users"
                class="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white border-4 border-black shadow-md hover:-translate-y-1 transition-transform"
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
            class="block px-4 py-3 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md"
          >
            Dashboard
          </router-link>
          <router-link
            to="/admin/users"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold bg-primary text-white border-4 border-black shadow-md"
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

    <main class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6 sm:mb-8">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-1 sm:w-2 h-8 sm:h-12 bg-primary border-2 border-black"></div>
          <div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">User Management</h2>
            <p class="text-xs sm:text-sm font-bold text-gray-700 mt-1">View and manage all platform users</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-black border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-lg font-bold text-gray-900">Loading users...</p>
        </div>
      </div>

      <neo-card v-else variant="elevated" class="bg-white overflow-hidden">
        <div class="p-4 sm:p-6 border-b-4 border-black bg-gradient-to-r from-blue-50 to-purple-50">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <neo-input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="flex-1"
            />
            <select
              v-model="filterType"
              class="px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold border-4 border-black rounded-lg focus:ring-4 focus:ring-black focus:ring-opacity-25 bg-white shadow-md transition-all"
            >
              <option value="">All Types</option>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="min-w-full divide-y-4 divide-black">
            <thead class="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">User</th>
                <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Type</th>
                <th class="hidden lg:table-cell px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Phone</th>
                <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Status</th>
                <th class="hidden sm:table-cell px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y-2 divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-amber-50 transition-colors">
                <td class="px-3 sm:px-6 py-3 sm:py-4">
                  <div>
                    <div class="text-sm sm:text-base font-black text-gray-900">{{ user.fullName }}</div>
                    <div class="text-xs sm:text-sm font-bold text-gray-600">{{ user.email }}</div>
                  </div>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span
                    class="px-2 sm:px-3 py-1 text-xs font-black rounded-lg border-2 border-black shadow-md"
                    :class="{
                      'bg-green-400 text-white': user.userType === 'student',
                      'bg-blue-400 text-white': user.userType === 'tutor',
                      'bg-purple-400 text-white': user.userType === 'admin'
                    }"
                  >
                    {{ user.userType }}
                  </span>
                </td>
                <td class="hidden lg:table-cell px-6 py-4 text-sm font-bold text-gray-900">{{ user.phoneNumber }}</td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span
                    class="px-2 sm:px-3 py-1 text-xs font-black rounded-lg border-2 border-black shadow-md"
                    :class="user.isEmailVerified ? 'bg-green-400 text-white' : 'bg-yellow-400 text-gray-900'"
                  >
                    {{ user.isEmailVerified ? 'Verified' : 'Unverified' }}
                  </span>
                </td>
                <td class="hidden sm:table-cell px-6 py-4 text-sm font-bold text-gray-700">
                  {{ formatDate(user.createdAt) }}
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-3 sm:px-6 py-8 sm:py-12 text-center">
                  <div class="text-center">
                    <span class="text-6xl mb-4 block">🔍</span>
                    <p class="text-xl font-black text-gray-900">No users found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </neo-card>
    </main>
  </div>
</template>

<script>
import { adminService } from '@/services/adminService';
import { useAuthStore } from '@/stores/auth.store';
import NeoButton from '@/components/common/ui/NeoButton.vue';
import NeoCard from '@/components/common/ui/NeoCard.vue';
import NeoInput from '@/components/common/ui/NeoInput.vue';

export default {
  name: 'UserManagement',
  components: {
    NeoButton,
    NeoCard,
    NeoInput,
  },
  data() {
    return {
      loading: true,
      mobileMenuOpen: false,
      users: [],
      searchQuery: '',
      filterType: '',
    };
  },
  computed: {
    userName() {
      return useAuthStore().userName;
    },
    filteredUsers() {
      let filtered = this.users;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.fullName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      if (this.filterType) {
        filtered = filtered.filter((user) => user.userType === this.filterType);
      }

      return filtered;
    },
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true;
        this.users = await adminService.getAllUsers();
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    async handleLogout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    },
  },
};
</script>
