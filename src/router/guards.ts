import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from '../composables/useToast';

export const authGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();
  const toast = useToast();

  if (!authStore.isAuthenticated) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    toast.warning('Login Required', 'Please log in to access this page');
    next('/login');
    return;
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    if (authStore.isStudent || authStore.isTutor) {
      next('/tutors');
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
