<template>
  <admin-layout page-title="Dashboard">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-base font-semibold text-gray-600">Loading dashboard...</p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Total Users</p>
          <p class="text-3xl font-black text-gray-900">{{ stats.totalUsers }}</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Students</p>
          <p class="text-3xl font-black text-gray-900">{{ stats.totalStudents }}</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Tutors</p>
          <p class="text-3xl font-black text-gray-900">{{ stats.totalTutors }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ stats.approvedTutors }} approved</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 mb-1">Pending Applications</p>
          <p class="text-3xl font-black text-gray-900">{{ stats.pendingApplications }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <router-link
          to="/admin/users"
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg class="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">User Management</h3>
          <p class="text-sm text-gray-600">View and manage all platform users</p>
        </router-link>

        <router-link
          to="/admin/tutor-applications"
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <svg class="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Review Applications</h3>
          <p class="text-sm text-gray-600">Approve or reject tutor applications</p>
          <div v-if="stats.pendingApplications > 0" class="mt-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              {{ stats.pendingApplications }} pending
            </span>
          </div>
        </router-link>

        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 opacity-60 cursor-not-allowed">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Platform Settings</h3>
          <p class="text-sm text-gray-600">Coming soon</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="p-6 h-full flex flex-col">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex-1/6">Pending Applications</h3>

            <div v-if="loadingApplications" class="text-center flex-4/6 flex justify-center items-center">
              <div class="text-sm text-gray-500">Loading applications...</div>
            </div>

            <div v-else-if="pendingApplications.length === 0" class="text-center flex-4/6 flex justify-center items-center flex-col">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-sm text-gray-500">No pending applications</p>
            </div>

            <div v-else class="space-y-3 flex-4/6">
              <div
                v-for="app in pendingApplications"
                :key="app.id"
                class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-sm font-semibold text-purple-600">{{ getInitials(app.tutorProfile?.user?.fullName) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ app.tutorProfile?.user?.fullName }}</p>
                  <p class="text-xs text-gray-500">{{ app.tutorProfile?.teachingExperienceYears }} years • {{ truncateSubjects(app.tutorProfile?.subjects) }}</p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <button
                    @click="viewApplication(app.id)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View
                  </button>
                  <button
                    @click="approveApplication(app.id)"
                    class="text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-4 text-right flex-1/6 flex items-end justify-end">
              <router-link
                to="/admin/tutor-applications"
                class="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All Applications →
              </router-link>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tutor Overview</h3>

            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Pending</p>
                  <p class="text-xl font-semibold text-gray-900">{{ stats.pendingApplications }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Approved</p>
                  <p class="text-xl font-semibold text-gray-900">{{ stats.approvedTutors }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Rejected</p>
                  <p class="text-xl font-semibold text-gray-900">{{ stats.rejectedApplications }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Tutors</p>
                  <p class="text-xl font-semibold text-gray-900">{{ stats.totalTutors }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Approval Rate</p>
                  <p class="text-xl font-semibold text-gray-900">{{ approvalRate }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { useToast } from '@/composables/useToast';
import AdminLayout from '@/components/admin/AdminLayout.vue';

export default defineComponent({
  name: 'AdminDashboard',
  components: {
    AdminLayout,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    adminStore() {
      return useAdminStore();
    },
    loading() {
      return this.adminStore.loading;
    },
    loadingApplications() {
      return this.adminStore.loadingApplications;
    },
    stats() {
      return this.adminStore.stats;
    },
    pendingApplications() {
      return this.adminStore.pendingApplications.slice(0, 5);
    },
    approvalRate() {
      return this.adminStore.approvalRate;
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      await Promise.all([
        this.adminStore.fetchStats(),
        this.adminStore.fetchApplications(),
      ]);
    },
    getInitials(name: string | undefined) {
      if (!name) return '?';
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    truncateSubjects(subjects: string[] | undefined) {
      if (!subjects || subjects.length === 0) return 'No subjects';
      if (Array.isArray(subjects)) {
        return subjects.slice(0, 2).join(', ');
      }
      return subjects;
    },
    viewApplication(_id: string) {
      this.$router.push(`/admin/tutor-applications`);
    },
    async approveApplication(id: string) {
      if (!confirm('Are you sure you want to approve this application?')) return;

      try {
        await this.adminStore.approveApplication(id);
        this.toast.success('Application Approved', 'The tutor application has been approved successfully');
        await this.adminStore.fetchStats();
      } catch (error) {
        this.toast.error('Approval Failed', 'Failed to approve application. Please try again.');
      }
    },
  },
});
</script>
