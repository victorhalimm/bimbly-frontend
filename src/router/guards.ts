import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    if (authStore.isStudent) {
      next('/student/dashboard');
    } else if (authStore.isTutor) {
      next('/tutor/dashboard');
    } else if (authStore.isAdmin) {
      next('/admin/dashboard');
    } else {
      next('/');
    }
    return;
  }

  if (to.meta.roles) {
    const roles = to.meta.roles as string[];
    const userRole = authStore.user?.userType;
    if (!userRole || !roles.includes(userRole)) {
      next('/unauthorized');
      return;
    }
  }

  next();
};
