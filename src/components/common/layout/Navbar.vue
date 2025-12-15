<template>
  <nav
    class="fixed left-0 right-0 z-50 px-4 py-3 transition-all duration-300"
    :class="navbarClass"
  >
    <div class="max-w-7xl mx-auto px-12">
      <div class="bg-white rounded-full shadow-lg px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <router-link :to="homeRoute" class="flex items-center gap-2 pl-2">
            <img :src="logoBox" alt="Bimbly Logo" class="w-8 h-8" />
            <span class="text-xl font-black text-gray-900 hidden sm:block">Bimbly</span>
          </router-link>

          <div class="hidden md:flex items-center">
            <div class="h-6 w-px bg-gray-200 mr-6"></div>
            <div class="flex items-center gap-1">
              <template v-for="item in navigationItems" :key="item.name">
                <div
                  v-if="item.hasDropdown"
                  class="relative"
                  @mouseenter="showQuizzesDropdown = true"
                  @mouseleave="showQuizzesDropdown = false"
                >
                  <button
                    class="px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1"
                    :class="isQuizzesRouteActive()
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                  >
                    {{ item.name }}
                    <IconChevronDown size="16" stroke="2" class="transition-transform" :class="showQuizzesDropdown ? 'rotate-180' : ''" />
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
                      v-if="showQuizzesDropdown"
                      class="absolute left-0 top-full pt-2 w-48 z-50"
                    >
                      <div class="bg-white rounded-b-2xl shadow-xl py-2">
                        <router-link
                          v-for="subItem in item.children"
                          :key="subItem.name"
                          :to="subItem.href"
                          class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          :class="isActiveRoute(subItem.href) ? 'bg-gray-50 text-blue-600' : ''"
                          @click="showQuizzesDropdown = false"
                        >
                          <component :is="subItem.icon" size="18" stroke="1.5" class="text-gray-400" />
                          {{ subItem.name }}
                        </router-link>
                      </div>
                    </div>
                  </Transition>
                </div>

                <router-link
                  v-else
                  :to="item.href"
                  class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  :class="isActiveRoute(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                >
                  {{ item.name }}
                </router-link>
              </template>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div
            v-if="showPendingApprovalChip"
            class="relative group"
          >
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold cursor-help">
              <IconClock size="14" stroke="2" />
              <span>Pending Approval</span>
            </div>
            <div class="absolute right-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-lg">
              Your tutor application is being reviewed by our team. You will be notified once approved.
              <div class="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>

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
                class="absolute right-0 top-full w-56 bg-white rounded-b-2xl shadow-xl py-2 z-50"
              >
                <template v-if="isLoggedIn">
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
                      v-if="userType === 'student'"
                      to="/student/academic-progress"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <IconChartBar size="18" stroke="1.5" class="text-gray-400" />
                      Academic Progress
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
                </template>

                <template v-else>
                  <div class="py-1">
                    <router-link
                      to="/login"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <IconLogin size="18" stroke="1.5" class="text-gray-400" />
                      Sign In
                    </router-link>
                  </div>
                </template>
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
import { useTutorStore } from '../../../stores/tutor.store';
import {
  IconBell,
  IconMessage,
  IconUser,
  IconChartBar,
  IconLogout,
  IconMenu2,
  IconX,
  IconLogin,
  IconChevronDown,
  IconBook,
  IconClipboardCheck,
  IconClock,
} from '@tabler/icons-vue';
import { useToast } from '@/composables/useToast';

interface NavigationChild {
  name: string;
  href: string;
  icon: string;
}

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  children?: NavigationChild[];
}

export default defineComponent({
  name: 'AppNavbar',
  components: {
    IconBell,
    IconMessage,
    IconUser,
    IconChartBar,
    IconLogout,
    IconMenu2,
    IconX,
    IconLogin,
    IconChevronDown,
    IconBook,
    IconClipboardCheck,
    IconClock,
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
  setup() {
    const authStore = useAuthStore();
    const tutorStore = useTutorStore();
    const toast = useToast();
    return { toast, authStore, tutorStore };
  },
  emits: ['open-notifications', 'open-chat'],
  data() {
    return {
      showProfileMenu: false,
      showMobileMenu: false,
      showQuizzesDropdown: false,
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
    isLoggedIn(): boolean {
      return this.authStore.isAuthenticated;
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
          { name: 'Bookings', href: '/student/bookings' },
        ],
        tutor: [
          {
            name: 'Quizzes',
            href: '/tutor/quizzes',
            hasDropdown: true,
            children: [
              { name: 'Quiz Library', href: '/tutor/quizzes', icon: 'IconBook' },
              { name: 'Grading Center', href: '/tutor/assignments', icon: 'IconClipboardCheck' },
            ],
          },
          { name: 'Bookings', href: '/tutor/bookings' },
        ],
        admin: [
          { name: 'Users', href: '/admin/users' },
          { name: 'Applications', href: '/admin/tutor-applications' },
        ],
      };

      return [...baseItems, ...(roleBasedItems[this.userType] || [])];
    },
    currentUserTutorProfile() {
      return this.tutorStore.currentUserProfile;
    },
    showPendingApprovalChip(): boolean {
      return this.userType === 'tutor' &&
             this.currentUserTutorProfile !== null &&
             !this.currentUserTutorProfile.isApproved;
    },
    profileRoute(): string {
      const routes: Record<string, string> = {
        student: '/student/profile',
        tutor: '/tutor/profile',
        admin: '/admin/dashboard',
      };
      return routes[this.userType] || '/';
    },
    homeRoute(): string {
      const routes: Record<string, string> = {
        student: '/tutors',
        tutor: '/tutors',
        admin: '/admin/dashboard',
      }
      return this.isLoggedIn ? routes[this.userType] : '/'
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
    isQuizzesRouteActive(): boolean {
      const route = useRoute();
      return route.path.startsWith('/tutor/quizzes') || route.path.startsWith('/tutor/assignments');
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
      this.toast.success("Successfully logged out from account")
      this.authStore.logout()
      this.$router.push("/")
    },
  },
});
</script>
