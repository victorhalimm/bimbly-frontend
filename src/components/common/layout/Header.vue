<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center">
            <h1 class="text-xl font-bold text-primary-600">Bimbly</h1>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600': isActiveRoute(item.href) }"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
            >
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="h-8 w-8 rounded-full object-cover"
              >
              <div
                v-else
                class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <span class="text-primary-600 font-medium text-sm">
                  {{ getUserInitials() }}
                </span>
              </div>
              <span class="hidden lg:block">{{ user.name }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              @click.stop
            >
              <div class="py-1">
                <router-link
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.href"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="showUserMenu = false"
                >
                  {{ item.name }}
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1 bg-white">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
          :class="{ 'bg-primary-50 text-primary-700': isActiveRoute(item.href) }"
          @click="showMobileMenu = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface NavigationItem {
  name: string;
  href: string;
}

interface User {
  name: string;
  email?: string;
  avatar?: string;
  role: 'student' | 'tutor' | 'admin';
}

export default defineComponent({
  name: 'BHeader',
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
  },
  emits: ['logout'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);

    const navigationItems = computed((): NavigationItem[] => {
      const baseItems = [
        { name: 'Find Tutors', href: '/tutors' },
      ];

      const roleBasedItems = {
        student: [
          { name: 'My Bookings', href: '/student/bookings' },
          { name: 'Dashboard', href: '/student/dashboard' },
        ],
        tutor: [
          { name: 'My Sessions', href: '/tutor/sessions' },
          { name: 'Dashboard', href: '/tutor/dashboard' },
        ],
        admin: [
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Users', href: '/admin/users' },
        ],
      };

      return [...baseItems, ...(roleBasedItems[props.user.role] || [])];
    });

    const userMenuItems = computed((): NavigationItem[] => {
      const baseItems = [
        { name: 'Profile', href: '/profile' },
        { name: 'Settings', href: '/settings' },
      ];

      const roleSpecificItems = {
        tutor: [
          { name: 'My Profile', href: '/tutor/profile' },
        ],
        student: [
          { name: 'My Progress', href: '/student/progress' },
        ],
      };

      return [...baseItems, ...(roleSpecificItems[props.user.role] || [])];
    });

    const isActiveRoute = (href: string): boolean => {
      return route.path === href || route.path.startsWith(href + '/');
    };

    const getUserInitials = (): string => {
      return props.user.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showMobileMenu.value = false;
    };

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
      showUserMenu.value = false;
    };

    const handleLogout = () => {
      showUserMenu.value = false;
      emit('logout');
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        showUserMenu.value = false;
        showMobileMenu.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showUserMenu,
      showMobileMenu,
      navigationItems,
      userMenuItems,
      isActiveRoute,
      getUserInitials,
      toggleUserMenu,
      toggleMobileMenu,
      handleLogout,
    };
  },
});
</script>