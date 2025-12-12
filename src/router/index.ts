import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';

const routes = [
  // ==================== Landing ====================
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/landing/LandingPage.vue'),
  },

  // ==================== Authentication ====================
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
  // ==================== Tutor Discovery ====================
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
    path: '/tutors/search',
    name: 'TutorsSearch',
    component: () => import('../views/tutors/TutorsSearchPage.vue'),
  },
  {
    path: '/tutors/:id',
    name: 'TutorProfilePublic',
    component: () => import('../views/tutors/TutorProfilePublic.vue'),
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

  // ==================== Student - Profiles ====================
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
    path: '/student/academic-progress',
    name: 'StudentAcademicProgress',
    component: () => import('../views/student/StudentAcademicProgress.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },

  // ==================== Student - Quiz System ====================
  {
    path: '/student/quizzes',
    name: 'StudentQuizDashboard',
    component: () => import('../views/student/QuizDashboard.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/quiz/:id',
    name: 'TakeQuiz',
    component: () => import('../views/student/TakeQuiz.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/quiz/:id/results',
    name: 'QuizResults',
    component: () => import('../views/student/QuizResults.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  // ==================== Tutor - Profiles ====================
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

  // ==================== Tutor - Quiz System ====================
  {
    path: '/tutor/application-status',
    name: 'TutorApplicationStatus',
    component: () => import('../views/tutor/ApplicationStatus.vue'),
  },
  {
    path: '/tutor/quizzes',
    name: 'TutorQuizList',
    component: () => import('../views/tutor/TutorQuizList.vue'),
    // meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/quizzes/create',
    name: 'CreateQuiz',
    component: () => import('../views/tutor/CreateQuiz.vue'),
    // meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/quizzes/:id/edit',
    name: 'EditQuiz',
    component: () => import('../views/tutor/EditQuiz.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/quizzes/:id/assign',
    name: 'AssignQuiz',
    component: () => import('../views/tutor/AssignQuiz.vue'),
    // meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/assignments',
    name: 'TutorAssignments',
    component: () => import('../views/tutor/TutorAssignments.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/assignments/:id/grade',
    name: 'GradeQuiz',
    component: () => import('../views/tutor/GradeQuiz.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  // ==================== Admin Panel ====================
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/UserManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/tutor-applications',
    name: 'AdminTutorApplications',
    component: () => import('../views/admin/TutorApplications.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  // ==================== Error Pages ====================
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
