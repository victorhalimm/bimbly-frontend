<template>
  <div class="min-h-screen bg-amber-50">
    <nav class="bg-white border-b-4 border-black shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 sm:h-20">
          <div class="flex items-center space-x-4 sm:space-x-8">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">🎓 <span class="hidden sm:inline">Bimbly</span> Admin</h1>
            <div class="hidden md:flex space-x-2">
              <router-link
                to="/admin/dashboard"
                class="px-4 py-2 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md hover:-translate-y-1 transition-transform"
              >
                Dashboard
              </router-link>
              <router-link
                to="/admin/users"
                class="px-4 py-2 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md hover:-translate-y-1 transition-transform"
              >
                Users
              </router-link>
              <router-link
                to="/admin/tutor-applications"
                class="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white border-4 border-black shadow-md hover:-translate-y-1 transition-transform"
              >
                Applications
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <span class="hidden sm:inline text-sm font-bold text-gray-900">{{ userName }}</span>
            <neo-button variant="danger" size="sm" @click="handleLogout" class="hidden sm:inline-flex">
              Logout
            </neo-button>
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden w-10 h-10 bg-primary border-4 border-black rounded-lg flex items-center justify-center hover:-translate-y-1 transition-transform"
              aria-label="Toggle menu"
            >
              <span class="text-white text-xl font-black">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>

        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t-4 border-black mt-4 pt-4 space-y-2">
          <router-link
            to="/admin/dashboard"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md"
          >
            Dashboard
          </router-link>
          <router-link
            to="/admin/users"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold text-gray-900 border-4 border-black bg-white shadow-md"
          >
            Users
          </router-link>
          <router-link
            to="/admin/tutor-applications"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-bold bg-primary text-white border-4 border-black shadow-md"
          >
            Applications
          </router-link>
          <div class="pt-2 border-t-2 border-gray-300 mt-2">
            <p class="text-sm font-bold text-gray-700 px-4 py-2">{{ userName }}</p>
            <neo-button variant="danger" size="sm" @click="handleLogout" class="w-full">
              Logout
            </neo-button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6 sm:mb-8">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-1 sm:w-2 h-8 sm:h-12 bg-primary border-2 border-black"></div>
          <div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">Tutor Applications</h2>
            <p class="text-xs sm:text-sm font-bold text-gray-700 mt-1">Review and manage tutor applications</p>
          </div>
        </div>
      </div>

      <neo-card variant="elevated" class="bg-white overflow-hidden">
        <div class="border-b-4 border-black bg-gradient-to-r from-purple-50 to-pink-50">
          <nav class="flex overflow-x-auto">
            <button
              @click="activeTab = 'pending'"
              class="flex-1 sm:flex-initial px-4 sm:px-8 py-3 sm:py-4 border-b-4 font-black text-xs sm:text-sm transition-all whitespace-nowrap"
              :class="activeTab === 'pending' ? 'border-orange-500 bg-orange-100 text-orange-900' : 'border-transparent text-gray-600 hover:bg-white hover:text-gray-900'"
            >
              Pending
              <span v-if="pendingCount > 0" class="ml-1 sm:ml-2 px-2 sm:px-3 py-1 text-xs font-black bg-orange-500 text-white rounded-lg border-2 border-black shadow-md">
                {{ pendingCount }}
              </span>
            </button>
            <button
              @click="activeTab = 'approved'"
              class="flex-1 sm:flex-initial px-4 sm:px-8 py-3 sm:py-4 border-b-4 font-black text-xs sm:text-sm transition-all whitespace-nowrap"
              :class="activeTab === 'approved' ? 'border-green-500 bg-green-100 text-green-900' : 'border-transparent text-gray-600 hover:bg-white hover:text-gray-900'"
            >
              Approved
            </button>
            <button
              @click="activeTab = 'rejected'"
              class="flex-1 sm:flex-initial px-4 sm:px-8 py-3 sm:py-4 border-b-4 font-black text-xs sm:text-sm transition-all whitespace-nowrap"
              :class="activeTab === 'rejected' ? 'border-red-500 bg-red-100 text-red-900' : 'border-transparent text-gray-600 hover:bg-white hover:text-gray-900'"
            >
              Rejected
            </button>
          </nav>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-black border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-lg font-bold text-gray-900">Loading applications...</p>
          </div>
        </div>

        <div v-else-if="currentApplications.length === 0" class="p-8 sm:p-12 text-center">
          <span class="text-4xl sm:text-6xl mb-4 block">📋</span>
          <p class="text-lg sm:text-xl font-black text-gray-900">No {{ activeTab }} applications</p>
        </div>

        <div v-else class="divide-y-4 divide-gray-200">
          <div v-for="app in currentApplications" :key="app.id" class="p-4 sm:p-6 hover:bg-amber-50 transition-colors">
            <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div class="flex-1 w-full">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 class="text-base sm:text-xl font-black text-gray-900">{{ app.tutorProfile?.user?.fullName }}</h3>
                  <span
                    class="px-2 sm:px-3 py-1 text-xs font-black rounded-lg border-2 border-black shadow-md"
                    :class="{
                      'bg-orange-400 text-white': app.status === 'pending',
                      'bg-green-400 text-white': app.status === 'approved',
                      'bg-red-400 text-white': app.status === 'rejected'
                    }"
                  >
                    {{ app.status }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm font-bold text-gray-600 mb-2 sm:mb-3">{{ app.tutorProfile?.user?.email }}</p>
                <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  <span class="px-2 sm:px-3 py-1 bg-blue-100 border-2 border-black rounded-lg">{{ app.tutorProfile?.teachingExperienceYears }} years exp</span>
                  <span class="px-2 sm:px-3 py-1 bg-purple-100 border-2 border-black rounded-lg truncate max-w-[200px]">{{ app.tutorProfile?.subjects?.join(', ') }}</span>
                </div>
                <p class="text-xs font-bold text-gray-500 mt-2">Submitted: {{ formatDate(app.submittedAt) }}</p>
                <p v-if="app.reviewedAt" class="text-xs font-bold text-gray-500">Reviewed: {{ formatDate(app.reviewedAt) }}</p>
                <p v-if="app.rejectionReason" class="text-xs sm:text-sm font-bold text-red-600 mt-2 p-2 bg-red-50 border-2 border-red-300 rounded-lg">Reason: {{ app.rejectionReason }}</p>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <neo-button
                  variant="secondary"
                  size="sm"
                  @click="selectedApp = app"
                  class="w-full sm:w-auto"
                >
                  View Details
                </neo-button>
                <neo-button
                  v-if="app.status === 'pending'"
                  variant="success"
                  size="sm"
                  @click="handleQuickApprove(app.id)"
                  class="w-full sm:w-auto"
                >
                  Approve
                </neo-button>
                <neo-button
                  v-if="app.status === 'pending'"
                  variant="danger"
                  size="sm"
                  @click="showRejectModal(app)"
                  class="w-full sm:w-auto"
                >
                  Reject
                </neo-button>
              </div>
            </div>
          </div>
        </div>
      </neo-card>
    </main>

    <div v-if="rejectModalVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <neo-card variant="elevated" class="bg-white max-w-md w-full mx-4">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-red-500 border-4 border-black rounded-lg flex items-center justify-center">
            <span class="text-2xl">❌</span>
          </div>
          <h3 class="text-2xl font-black text-gray-900">Reject Application</h3>
        </div>
        <p class="text-sm font-bold text-gray-700 mb-4">Please provide a reason for rejecting this application:</p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full px-4 py-3 border-4 border-black rounded-lg focus:ring-4 focus:ring-black focus:ring-opacity-25 font-medium"
          placeholder="Enter rejection reason..."
        ></textarea>
        <div class="mt-6 flex justify-end space-x-3">
          <neo-button variant="secondary" size="sm" @click="closeRejectModal">
            Cancel
          </neo-button>
          <neo-button
            variant="danger"
            size="sm"
            :disabled="!rejectionReason.trim()"
            @click="handleReject"
          >
            Confirm Reject
          </neo-button>
        </div>
      </neo-card>
    </div>

    <div v-if="selectedApp" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm p-2 sm:p-4">
      <neo-card variant="elevated" class="bg-white max-w-4xl w-full my-4 sm:my-8">
        <div class="flex justify-between items-start mb-4 sm:mb-6">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="w-8 h-8 sm:w-12 sm:h-12 bg-primary border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
              <span class="text-lg sm:text-2xl">📋</span>
            </div>
            <h3 class="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">Application Details</h3>
          </div>
          <button @click="selectedApp = null" class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 border-2 sm:border-4 border-black rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center flex-shrink-0">
            <span class="text-xl sm:text-2xl font-black">&times;</span>
          </button>
        </div>
        <application-review :application="selectedApp" @approve="handleApprove" @reject="handleRejectFromDetail" @close="selectedApp = null" />
      </neo-card>
    </div>
  </div>
</template>

<script>
import { adminService } from '@/services/adminService';
import { useAuthStore } from '@/stores/auth.store';
import ApplicationReview from '@/components/admin/ApplicationReview.vue';
import NeoButton from '@/components/common/ui/NeoButton.vue';
import NeoCard from '@/components/common/ui/NeoCard.vue';

export default {
  name: 'TutorApplications',
  components: {
    ApplicationReview,
    NeoButton,
    NeoCard,
  },
  data() {
    return {
      loading: true,
      mobileMenuOpen: false,
      activeTab: 'pending',
      applications: [],
      selectedApp: null,
      rejectModalVisible: false,
      appToReject: null,
      rejectionReason: '',
    };
  },
  computed: {
    userName() {
      return useAuthStore().userName;
    },
    currentApplications() {
      return this.applications.filter((app) => app.status === this.activeTab);
    },
    pendingCount() {
      return this.applications.filter((app) => app.status === 'pending').length;
    },
  },
  async mounted() {
    await this.loadApplications();
  },
  methods: {
    async loadApplications() {
      try {
        this.loading = true;
        this.applications = await adminService.getAllApplications();
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        this.loading = false;
      }
    },
    showRejectModal(app) {
      this.appToReject = app;
      this.rejectionReason = '';
      this.rejectModalVisible = true;
    },
    closeRejectModal() {
      this.rejectModalVisible = false;
      this.appToReject = null;
      this.rejectionReason = '';
    },
    async handleQuickApprove(id) {
      if (confirm('Are you sure you want to approve this application?')) {
        try {
          await adminService.approveApplication(id);
          await this.loadApplications();
        } catch (error) {
          console.error('Failed to approve application:', error);
          alert('Failed to approve application');
        }
      }
    },
    async handleApprove(id) {
      try {
        await adminService.approveApplication(id);
        this.selectedApp = null;
        await this.loadApplications();
      } catch (error) {
        console.error('Failed to approve application:', error);
        alert('Failed to approve application');
      }
    },
    async handleReject() {
      try {
        await adminService.rejectApplication(this.appToReject.id, this.rejectionReason);
        this.closeRejectModal();
        await this.loadApplications();
      } catch (error) {
        console.error('Failed to reject application:', error);
        alert('Failed to reject application');
      }
    },
    async handleRejectFromDetail({ id, reason }) {
      try {
        await adminService.rejectApplication(id, reason);
        this.selectedApp = null;
        await this.loadApplications();
      } catch (error) {
        console.error('Failed to reject application:', error);
        alert('Failed to reject application');
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    async handleLogout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    },
  },
};
</script>
