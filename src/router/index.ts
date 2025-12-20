import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';

export interface RouteType {
  path: string,
  name: string,
  component: () => any,
  meta?: {
    requiresAuth?: boolean,
    requiresGuest?: boolean,
    roles?: string[]
    navbar?: { show: boolean, hideOnTop?: boolean }
    footer?: { show?: boolean, backgroundColor?: string }
  }
}

const routes : RouteType[] = [
  // ==================== Landing ====================
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/landing/LandingPage.vue'),
    meta: {
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#eff6ff' },
    },
  },

  // ==================== Authentication ====================
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginPage.vue'),
    meta: {
      requiresGuest: true,
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' }, 
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterPage.vue'),
    meta: {
      requiresGuest: true,
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },
  // ==================== Tutor Discovery ====================
  {
    path: '/become-tutor',
    name: 'BecomeTutor',
    component: () => import('../views/tutors/BecomeTutorPage.vue'),
    meta: {
      requiresGuest: true,
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutors',
    name: 'Tutors',
    component: () => import('../views/tutors/TutorsPage.vue'),
    meta: {
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#eff6ff' },
    },
  },
  {
    path: '/tutors/search',
    name: 'TutorsSearch',
    component: () => import('../views/tutors/TutorsSearchPage.vue'),
    meta: {
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#eff6ff' },
    },
  },
  {
    path: '/tutors/:id',
    name: 'TutorProfilePublic',
    component: () => import('../views/tutors/TutorProfilePublic.vue'),
    meta: {
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#f9fafb' },
    },
  },
  {
    path: '/book/:tutorId',
    name: 'BookSession',
    component: () => import('../views/booking/BookingPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student']
    },
  },
  {
    path: '/tutors/:id/reviews',
    name: 'TutorReviews',
    component: () => import('../views/tutors/TutorReviews.vue'),
    meta: {
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#f9fafb' },
    },
  },

  // ==================== Student - Profiles ====================
  {
    path: '/student/profile',
    name: 'StudentProfile',
    component: () => import('../views/student/StudentProfilePage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#eff6ff' },
    },
  },
  {
    path: '/student/academic-progress',
    name: 'StudentAcademicProgress',
    component: () => import('../views/student/StudentAcademicProgress.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#eff6ff' },
    },
  },

  // ==================== Student - Bookings ====================
  {
    path: '/student/bookings',
    name: 'StudentBookings',
    component: () => import('../views/student/MyBookingsPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: true, hideOnTop: false }
    }
  },
  {
    path: '/student/bookings/:id',
    name: 'StudentBookingDetail',
    component: () => import('../views/student/MyBookingsPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: true, hideOnTop: true }
    }
  },

  // ==================== Student - Payment ====================
  {
    path: '/student/bookings/:bookingId/payment',
    name: 'StudentPayment',
    component: () => import('../views/student/PaymentPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },

  // ==================== Student - Reviews ====================
  {
    path: '/student/reviews/write',
    name: 'WriteReview',
    component: () => import('../views/student/WriteReview.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },

  // ==================== Student - Quiz System ====================
  {
    path: '/student/quizzes',
    name: 'StudentQuizDashboard',
    component: () => import('../views/student/QuizDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/student/quiz/:id',
    name: 'TakeQuiz',
    component: () => import('../views/student/TakeQuiz.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student'],
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/student/quiz/:id/results',
    name: 'QuizResults',
    component: () => import('../views/student/QuizResults.vue'),
    meta: {
      requiresAuth: true,
      roles: ['student', 'tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    }
  },
  // ==================== Chat ====================
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/chat/ChatPage.vue'),
    meta: { 
      requiresAuth: true, 
      roles: ['student', 'tutor'],
      navbar: { show: false, hideOnTop: false },
      footer: { show: false },
    },
  },
  // ==================== Tutor - Profiles ====================
  {
    path: '/tutor/profile',
    name: 'TutorProfile',
    component: () => import('../views/tutor/TutorProfilePage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#eff6ff' },
    },
  },

  // ==================== Tutor - Bookings ====================
  {
    path: '/tutor/bookings',
    name: 'TutorBookings',
    component: () => import('../views/tutor/TutorBookingsPage.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },
  {
    path: '/tutor/bookings/:id',
    name: 'TutorBookingDetail',
    component: () => import('../views/tutor/TutorBookingsPage.vue'),
    meta: { requiresAuth: true, roles: ['tutor'] },
  },

  // ==================== Tutor - Quiz System ====================
  {
    path: '/tutor/application-status',
    name: 'TutorApplicationStatus',
    component: () => import('../views/tutor/ApplicationStatus.vue'),
    meta: {
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutor/quizzes',
    name: 'TutorQuizList',
    component: () => import('../views/tutor/TutorQuizList.vue'),
    meta: {
      // requiresAuth: true, roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutor/quizzes/create',
    name: 'CreateQuiz',
    component: () => import('../views/tutor/CreateQuiz.vue'),
    meta: {
      // requiresAuth: true, roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutor/quizzes/:id/edit',
    name: 'EditQuiz',
    component: () => import('../views/tutor/EditQuiz.vue'),
    meta: {
      requiresAuth: true,
      roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutor/quizzes/:id/assign',
    name: 'AssignQuiz',
    component: () => import('../views/tutor/AssignQuiz.vue'),
    meta: {
      // requiresAuth: true, roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutor/assignments',
    name: 'TutorAssignments',
    component: () => import('../views/tutor/TutorAssignments.vue'),
    meta: {
      requiresAuth: true,
      roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/tutor/assignments/:id/grade',
    name: 'GradeQuiz',
    component: () => import('../views/tutor/GradeQuiz.vue'),
    meta: {
      requiresAuth: true,
      roles: ['tutor'],
      navbar: { show: true, hideOnTop: false },
      footer: { show: true, backgroundColor: '#ffffff' },
    },
  },
  // ==================== Admin Panel ====================
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/UserManagement.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },
  {
    path: '/admin/tutor-applications',
    name: 'AdminTutorApplications',
    component: () => import('../views/admin/TutorApplications.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },
  // ==================== Error Pages ====================
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/Unauthorized.vue'),
    meta: {
      navbar: { show: false, hideOnTop: false },
      footer: { show: false, backgroundColor: '#ffffff' },
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});

// Apply global auth guard
router.beforeEach(authGuard);

export default router;
export { routes }