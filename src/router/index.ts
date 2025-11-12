import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/landing/LandingPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/become-tutor',
    name: 'BecomeTutor',
    component: () => import('../views/tutors/BecomeTutorPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/tutors',
    name: 'Tutors',
    component: () => import('../views/tutors/TutorsPage.vue'),
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('../views/auth/EmailVerification.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPassword.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/auth/ResetPassword.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/student/dashboard',
    name: 'StudentDashboard',
    component: () => import('../views/student/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/profile',
    name: 'StudentProfile',
    component: () => import('../views/student/StudentProfilePage.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/tutor/dashboard',
    name: 'TutorDashboard',
    component: () => import('../views/tutor/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/profile',
    name: 'TutorProfile',
    component: () => import('../views/tutor/TutorProfilePage.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/Unauthorized.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Apply global auth guard
router.beforeEach(authGuard);

export default router;
