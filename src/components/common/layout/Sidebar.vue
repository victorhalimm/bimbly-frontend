<template>
  <nav class="bg-white shadow-sm border-r border-gray-200 h-full">
    <div class="px-4 py-6">
      <!-- Logo for mobile -->
      <div class="md:hidden flex items-center justify-center mb-8">
        <h1 class="text-xl font-bold text-primary-600">Bimbly</h1>
      </div>

      <!-- User Profile Section -->
      <div v-if="showProfile" class="mb-8">
        <div class="flex items-center space-x-3">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="h-10 w-10 rounded-full object-cover"
          >
          <div
            v-else
            class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <span class="text-primary-600 font-medium">
              {{ getUserInitials() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user.name }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ getRoleLabel() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Items -->
      <ul class="space-y-2">
        <li v-for="item in navigationItems" :key="item.name">
          <router-link
            :to="item.href"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="item.current
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
          >
            <component
              :is="getIconComponent(item.icon)"
              class="mr-3 h-5 w-5"
              :class="item.current
                ? 'text-primary-500'
                : 'text-gray-400 group-hover:text-gray-500'"
            />
            {{ item.name }}

            <span
              v-if="item.badge"
              class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getBadgeClasses(item.badge.type)"
            >
              {{ item.badge.text }}
            </span>
          </router-link>
        </li>
      </ul>

      <!-- Bottom Section -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <ul class="space-y-2">
          <li v-for="item in bottomItems" :key="item.name">
            <router-link
              :to="item.href"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <component
                :is="getIconComponent(item.icon)"
                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              />
              {{ item.name }}
            </router-link>
          </li>
          <li>
            <button
              @click="$emit('logout')"
              class="group w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { NavigationItem, SidebarUser } from '@/types/common';

const HomeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
    </svg>
  `,
};

const UserIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  `,
};

const CalendarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  `,
};

const BookIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
    </svg>
  `,
};

const ChartBarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
  `,
};

const CogIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  `,
};

export default defineComponent({
  name: 'BSidebar',
  components: {
    HomeIcon,
    UserIcon,
    CalendarIcon,
    BookIcon,
    ChartBarIcon,
    CogIcon,
  },
  props: {
    user: {
      type: Object as () => SidebarUser,
      required: true,
    },
    showProfile: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['logout'],
  setup(props) {
    const route = useRoute();

    const navigationItems = computed((): NavigationItem[] => {
      const studentItems = [
        { name: 'Dashboard', href: '/student/dashboard', icon: 'HomeIcon', current: false },
        { name: 'Find Tutors', href: '/tutors', icon: 'UserIcon', current: false },
        { name: 'My Bookings', href: '/student/bookings', icon: 'CalendarIcon', current: false },
        { name: 'Progress', href: '/student/progress', icon: 'ChartBarIcon', current: false },
      ];

      const tutorItems = [
        { name: 'Dashboard', href: '/tutor/dashboard', icon: 'HomeIcon', current: false },
        { name: 'My Sessions', href: '/tutor/sessions', icon: 'CalendarIcon', current: false },
        { name: 'Profile', href: '/tutor/profile', icon: 'UserIcon', current: false },
        { name: 'Reports', href: '/tutor/reports', icon: 'ChartBarIcon', current: false },
      ];

      const adminItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'HomeIcon', current: false },
        { name: 'Users', href: '/admin/users', icon: 'UserIcon', current: false },
        { name: 'Tutors', href: '/admin/tutors', icon: 'UserIcon', current: false },
        { name: 'Bookings', href: '/admin/bookings', icon: 'CalendarIcon', current: false },
        { name: 'Reports', href: '/admin/reports', icon: 'ChartBarIcon', current: false },
      ];

      const items = {
        student: studentItems,
        tutor: tutorItems,
        admin: adminItems,
      };

      return items[props.user.role]?.map(item => ({
        ...item,
        current: route.path === item.href || route.path.startsWith(item.href + '/'),
      })) || [];
    });

    const bottomItems = computed((): NavigationItem[] => {
      const commonItems = [
        { name: 'Settings', href: '/settings', icon: 'CogIcon' },
      ];

      const roleSpecificItems: Record<string, NavigationItem[]> = {
        tutor: [
          { name: 'My Profile', href: '/tutor/profile', icon: 'UserIcon' },
        ],
        student: [
          { name: 'Help Center', href: '/help', icon: 'BookIcon' },
        ],
      };

      return [...(roleSpecificItems[props.user.role] || []), ...commonItems];
    });

    const getUserInitials = (): string => {
      return props.user.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };

    const getRoleLabel = (): string => {
      const labels = {
        student: 'Student',
        tutor: 'Tutor',
        admin: 'Administrator',
      };
      return labels[props.user.role] || 'User';
    };

    const getIconComponent = (iconName: string | undefined) => {
      const icons: Record<string, any> = {
        HomeIcon,
        UserIcon,
        CalendarIcon,
        BookIcon,
        ChartBarIcon,
        CogIcon,
      };
      return iconName ? icons[iconName] || HomeIcon : HomeIcon;
    };

    const getBadgeClasses = (type: string): string => {
      const classes: Record<string, string> = {
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        info: 'bg-primary-100 text-primary-800',
      };
      return classes[type] || classes.info;
    };

    return {
      navigationItems,
      bottomItems,
      getUserInitials,
      getRoleLabel,
      getIconComponent,
      getBadgeClasses,
    };
  },
});
</script>