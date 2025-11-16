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
    path: '/student/academic-reports',
    name: 'AcademicReports',
    component: () => import('../views/student/AcademicReports.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/session-summaries',
    name: 'SessionSummaryView',
    component: () => import('../views/student/SessionSummaryView.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/write-review',
    name: 'WriteReview',
    component: () => import('../views/student/WriteReview.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/quizzes',
    name: 'QuizDashboard',
    component: () => import('../views/student/QuizDashboard.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/take-quiz/:id',
    name: 'TakeQuiz',
    component: () => import('../views/student/TakeQuiz.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/quiz-results/:id',
    name: 'QuizResults',
    component: () => import('../views/student/QuizResults.vue'),
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
    path: '/tutor/create-summary',
    name: 'CreateSummary',
    component: () => import('../views/tutor/CreateSummary.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/problems',
    name: 'ProblemsList',
    component: () => import('../views/tutor/ProblemsList.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/problems/create',
    name: 'CreateProblem',
    component: () => import('../views/tutor/CreateProblem.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/problems/edit/:id',
    name: 'EditProblem',
    component: () => import('../views/tutor/CreateProblem.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/quiz-templates',
    name: 'QuizTemplatesList',
    component: () => import('../views/tutor/QuizTemplatesList.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/quiz-templates/create',
    name: 'CreateQuizTemplate',
    component: () => import('../views/tutor/CreateQuizTemplate.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/quiz-templates/edit/:id',
    name: 'EditQuizTemplate',
    component: () => import('../views/tutor/CreateQuizTemplate.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/assign-quiz',
    name: 'AssignQuiz',
    component: () => import('../views/tutor/AssignQuiz.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/grade-quiz/:id',
    name: 'GradeQuiz',
    component: () => import('../views/tutor/GradeQuiz.vue'),
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
