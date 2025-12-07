<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="flex items-center space-x-3 p-6">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-black text-gray-900">Bimbly</h1>
          <p class="text-xs font-medium text-gray-500">Admin Panel</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 mt-4">
        <div class="space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            v-slot="{ isActive }"
            custom
          >
            <div
              @click="$router.push(item.path)"
              :class="[
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath"/>
              </svg>
              <span class="text-sm font-semibold">{{ item.label }}</span>
            </div>
          </router-link>
        </div>
      </nav>

      <div class="p-3 border-t border-gray-200">
        <div class="flex items-center space-x-3 px-3 py-2.5 mb-2">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden bg-white">
      <header class="bg-white border-b border-gray-200 px-8 py-6">
        <h2 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h2>
      </header>

      <main class="flex-1 overflow-y-auto bg-gray-50 p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.store';

export default {
  name: 'AdminLayout',
  props: {
    pageTitle: {
      type: String,
      default: 'Dashboard',
    },
  },
  data() {
    return {
      navigationItems: [
        {
          path: '/admin/dashboard',
          label: 'Dashboard',
          iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
          path: '/admin/users',
          label: 'User Management',
          iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        },
        {
          path: '/admin/tutor-applications',
          label: 'Tutor Applications',
          iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
      ],
    };
  },
  computed: {
    userName() {
      return useAuthStore().userName;
    },
  },
  methods: {
    async handleLogout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    },
  },
};
</script>
