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

          <!-- User Profile & Menu -->
          <div class="relative flex items-center">
            <!-- Clickable Profile Avatar - redirects to profile page -->
            <router-link
              :to="profileRoute"
              class="flex items-center"
            >
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="h-9 w-9 rounded-full object-cover ring-2 ring-primary-100 hover:ring-primary-300 transition-all"
              >
              <div
                v-else
                class="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-primary-100 hover:ring-primary-300 transition-all"
              >
                <span class="text-primary-600 font-medium text-sm">
                  {{ getUserInitials() }}
                </span>
              </div>
            </router-link>

            <!-- Dropdown Toggle Button -->
            <button
              @click="toggleUserMenu"
              class="ml-1 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              @click.stop
            >
              <div class="py-1">
                <router-link
                  :to="profileRoute"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="showUserMenu = false"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  My Profile
                </router-link>
                <router-link
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.href"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="showUserMenu = false"
                >
                  <svg v-if="item.icon === 'dashboard'" class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <svg v-else-if="item.icon === 'settings'" class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ item.name }}
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
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
        <div class="border-t border-gray-200 my-2"></div>
        <router-link
          :to="profileRoute"
          class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
          :class="{ 'bg-primary-50 text-primary-700': isActiveRoute(profileRoute) }"
          @click="showMobileMenu = false"
        >
          <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          My Profile
        </router-link>
        <button
          @click="handleLogout"
          class="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import type { NavigationItem, HeaderUser } from '@/types/common';

export default defineComponent({
  name: 'BHeader',
  props: {
    user: {
      type: Object as () => HeaderUser,
      required: true,
    },
  },
  emits: ['logout'],
  setup(props, { emit }) {
    const route = useRoute();
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);

    const navigationItems = computed((): NavigationItem[] => {
      const baseItems = [
        { name: 'Find Tutors', href: '/tutors' },
      ];

      const roleBasedItems: Record<string, NavigationItem[]> = {
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

    const profileRoute = computed((): string => {
      const routes: Record<string, string> = {
        student: '/student/profile',
        tutor: '/tutor/profile',
        admin: '/admin/dashboard',
      };
      return routes[props.user.role] || '/';
    });

    const userMenuItems = computed((): (NavigationItem & { icon?: string })[] => {
      const roleSpecificItems: Record<string, (NavigationItem & { icon?: string })[]> = {
        tutor: [
          { name: 'Dashboard', href: '/tutor/dashboard', icon: 'dashboard' },
        ],
        student: [
          { name: 'Dashboard', href: '/student/dashboard', icon: 'dashboard' },
        ],
      };

      return [...(roleSpecificItems[props.user.role] || [])];
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
      profileRoute,
      isActiveRoute,
      getUserInitials,
      toggleUserMenu,
      toggleMobileMenu,
      handleLogout,
    };
  },
});
</script>