<template>
  <nav
    class="fixed left-0 right-0 z-50 px-4 py-3 transition-all duration-300"
    :class="navbarClass"
  >
    <div class="max-w-7xl mx-auto px-12">
      <div class="bg-white rounded-full shadow-lg px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <router-link to="/" class="flex items-center gap-2 pl-2">
            <img :src="logoBox" alt="Bimbly Logo" class="w-8 h-8" />
            <span class="text-xl font-black text-gray-900 hidden sm:block">Bimbly</span>
          </router-link>

          <div class="hidden md:flex items-center">
            <div class="h-6 w-px bg-gray-200 mr-6"></div>
            <div class="flex items-center gap-1">
              <router-link
                v-for="item in navigationItems"
                :key="item.name"
                :to="item.href"
                class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                :class="isActiveRoute(item.href)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all relative"
            @click="$emit('open-notifications')"
          >
            <IconBell size="22" stroke="1.5" />
            <span
              v-if="notificationCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </button>

         <router-link
            to="/chat"
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all relative"
          >
            <IconMessage size="22" stroke="1.5" />
            <span
              v-if="unreadMessages > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ unreadMessages > 9 ? '9+' : unreadMessages }}
            </span>
          </router-link>

          <div class="h-6 w-px bg-gray-200 mx-1"></div>

          <div
            class="relative"
            @mouseenter="showProfileMenu = true"
            @mouseleave="showProfileMenu = false"
          >
            <button
              class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-all"
            >
              <img
                v-if="user?.profileImageUrl"
                :src="user.profileImageUrl"
                :alt="user.fullName"
                class="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div
                v-else
                class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-gray-100"
              >
                <span class="text-blue-600 font-bold text-sm">
                  {{ getUserInitials() }}
                </span>
              </div>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="showProfileMenu"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-bold text-gray-900 truncate">{{ user?.fullName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                </div>

                <div class="py-1">
                  <router-link
                    :to="profileRoute"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <IconUser size="18" stroke="1.5" class="text-gray-400" />
                    My Profile
                  </router-link>

                  <router-link
                    :to="dashboardRoute"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <IconLayoutDashboard size="18" stroke="1.5" class="text-gray-400" />
                    Dashboard
                  </router-link>
                </div>

                <div class="border-t border-gray-100 pt-1">
                  <button
                    class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    @click="handleLogout"
                  >
                    <IconLogout size="18" stroke="1.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <button
            class="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
            @click="showMobileMenu = !showMobileMenu"
          >
            <IconMenu2 v-if="!showMobileMenu" size="22" stroke="1.5" />
            <IconX v-else size="22" stroke="1.5" />
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="showMobileMenu"
          class="md:hidden mt-2 bg-white rounded-3xl shadow-lg p-4"
        >
          <div class="flex flex-col gap-1">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              class="px-4 py-3 rounded-xl text-base font-semibold transition-all"
              :class="isActiveRoute(item.href)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'"
              @click="showMobileMenu = false"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import logoBox from '@assets/images/logo/logo-box-2.png'
import { useAuthStore } from '../../../stores/auth.store';
import {
  IconBell,
  IconMessage,
  IconUser,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconX,
} from '@tabler/icons-vue';

export interface NavigationItem {
  name: string;
  href: string;
}

export default defineComponent({
  name: 'AppNavbar',
  components: {
    IconBell,
    IconMessage,
    IconUser,
    IconLayoutDashboard,
    IconLogout,
    IconMenu2,
    IconX,
  },
  props: {
    notificationCount: {
      type: Number,
      default: 0,
    },
    unreadMessages: {
      type: Number,
      default: 0,
    },
  },
  emits: ['logout', 'open-notifications', 'open-chat'],
  data() {
    return {
      showProfileMenu: false,
      showMobileMenu: false,
      logoBox,
      scrollY: 0
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.user;
    },
    userType(): string {
      return this.user?.userType || 'student';
    },
    navigationItems(): NavigationItem[] {
      const baseItems: NavigationItem[] = [
        { name: 'Find Tutors', href: '/tutors' },
      ];

      const roleBasedItems: Record<string, NavigationItem[]> = {
        student: [
          { name: 'Quizzes', href: '/student/quizzes' },
          { name: 'Meetings', href: '/student/meetings' },
        ],
        tutor: [
          { name: 'Quizzes', href: '/tutor/quizzes' },
          { name: 'Meetings', href: '/tutor/meetings' },
        ],
        admin: [
          { name: 'Users', href: '/admin/users' },
          { name: 'Applications', href: '/admin/tutor-applications' },
        ],
      };

      return [...baseItems, ...(roleBasedItems[this.userType] || [])];
    },
    profileRoute(): string {
      const routes: Record<string, string> = {
        student: '/student/profile',
        tutor: '/tutor/profile',
        admin: '/admin/dashboard',
      };
      return routes[this.userType] || '/';
    },
    dashboardRoute(): string {
      const routes: Record<string, string> = {
        student: '/student/dashboard',
        tutor: '/tutor/dashboard',
        admin: '/admin/dashboard',
      };
      return routes[this.userType] || '/';
    },
    navbarMeta(): { show: boolean; hideOnTop: boolean } {
      const meta = this.$route.meta as { navbar?: { show?: boolean; hideOnTop?: boolean } };
      return {
        show: meta?.navbar?.show ?? true,
        hideOnTop: meta?.navbar?.hideOnTop ?? false,
      };
    },
    navbarClass(): string {
      if (!this.navbarMeta.show) return '-top-full';
      if (this.navbarMeta.hideOnTop && this.scrollY === 0) return '-top-full';
      return 'top-0';
    }
  },
  methods: {
    handleScroll(): void {
      this.scrollY = window.scrollY;
    },
    isActiveRoute(href: string): boolean {
      const route = useRoute();
      return route.path === href || route.path.startsWith(href + '/');
    },
    getUserInitials(): string {
      if (!this.user?.fullName) return '?';
      return this.user.fullName
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    },
    handleLogout(): void {
      this.showProfileMenu = false;
      this.$emit('logout');
    },
  },
});
</script>
