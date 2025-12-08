<template>
  <admin-layout page-title="Tutor Applications">
    <div>
      <div class="flex items-center space-x-2 mb-6">
        <button
          @click="activeTab = 'pending'"
          class="px-4 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer"
          :class="activeTab === 'pending' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          Pending
          <span v-if="pendingCount > 0" class="ml-2 px-2 py-0.5 rounded text-xs font-semibold"
                :class="activeTab === 'pending' ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-700'">
            {{ pendingCount }}
          </span>
        </button>
        <button
          @click="activeTab = 'approved'"
          class="px-4 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer"
          :class="activeTab === 'approved' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          Approved
        </button>
        <button
          @click="activeTab = 'rejected'"
          class="px-4 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer"
          :class="activeTab === 'rejected' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          Rejected
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="w-12 h-12 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-sm font-medium text-gray-600">Loading applications...</p>
        </div>
      </div>

      <div v-else-if="currentApplications.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="mt-2 text-sm font-medium text-gray-900">No {{ activeTab }} applications</p>
      </div>

      <div v-else class="bg-white rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tutor</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
              <th class="hidden xl:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subjects</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in currentApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm font-semibold text-purple-700">{{ getInitials(app.tutorProfile?.user?.fullName) }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-sm font-semibold text-gray-900">{{ app.tutorProfile?.user?.fullName }}</span>
                      <span v-if="app.additionalInfoRequested" class="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded font-medium">
                        📝 Info Requested
                      </span>
                      <span v-if="isProfileUpdatedAfterRequest(app)" class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded font-medium animate-pulse">
                        ✓ Updated
                      </span>
                    </div>
                    <div class="text-sm text-gray-500">{{ app.tutorProfile?.user?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">
                {{ app.tutorProfile?.teachingExperienceYears }} years
              </td>
              <td class="hidden xl:table-cell px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ app.tutorProfile?.subjects?.join(', ') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-orange-100 text-orange-800': app.status === 'pending',
                    'bg-green-100 text-green-800': app.status === 'approved',
                    'bg-red-100 text-red-800': app.status === 'rejected'
                  }"
                >
                  {{ app.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(app.submittedAt) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                <button
                  @click="selectedApp = app"
                  class="text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  View
                </button>
                <button
                  v-if="app.status === 'pending'"
                  @click="handleQuickApprove(app.id)"
                  class="text-green-600 hover:text-green-900 cursor-pointer"
                >
                  Approve
                </button>
                <button
                  v-if="app.status === 'pending'"
                  @click="showRejectModal(app)"
                  class="text-red-600 hover:text-red-900 cursor-pointer"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <confirmation-modal
      :visible="rejectModalVisible"
      title="Reject Application"
      description="You are about to reject the application from"
      :target-name="appToReject?.tutorProfile?.user?.fullName"
      prompt-text="Please provide a reason for rejecting this application."
      input-label="Rejection Reason"
      placeholder="Enter rejection reason..."
      confirm-text="Confirm Reject"
      processing-text="Rejecting..."
      :is-processing="rejectingApplication"
      @confirm="handleRejectConfirm"
      @cancel="closeRejectModal"
    />

    <div v-if="selectedApp" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" @click.self="selectedApp = null">
      <div class="bg-white rounded-lg border border-gray-200 p-6 max-w-5xl w-full my-8 shadow-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Application Review</h3>
          <button @click="selectedApp = null" class="text-gray-400 hover:text-gray-600 transition-colors ease-in-out cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <application-review :application="selectedApp" @approve="handleApprove" @reject="handleRejectFromDetail" @request-info="handleRequestInfo" @close="selectedApp = null" />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import { adminService } from '@/services/admin.service';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import ApplicationReview from '@/components/admin/ApplicationReview.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { useToast } from '@/composables/useToast';

export default {
  name: 'TutorApplications',
  components: {
    AdminLayout,
    ApplicationReview,
    ConfirmationModal,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      loading: true,
      activeTab: 'pending',
      applications: [],
      selectedApp: null,
      rejectModalVisible: false,
      appToReject: null,
      rejectingApplication: false,
    };
  },
  computed: {
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
    getInitials(name) {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    showRejectModal(app) {
      this.appToReject = app;
      this.rejectModalVisible = true;
    },
    closeRejectModal() {
      this.rejectModalVisible = false;
      this.appToReject = null;
      this.rejectingApplication = false;
    },
    async handleQuickApprove(id) {
      try {
        await adminService.approveApplication(id);
        await this.loadApplications();
        this.toast.success('Application Approved', 'The tutor application has been approved successfully');
      } catch (error) {
        console.error('Failed to approve application:', error);
        this.toast.error('Approval Failed', 'Failed to approve application. Please try again.');
      }
    },
    async handleApprove(id) {
      try {
        await adminService.approveApplication(id);
        this.selectedApp = null;
        await this.loadApplications();
        this.toast.success('Application Approved', 'The tutor application has been approved successfully');
      } catch (error) {
        console.error('Failed to approve application:', error);
        this.toast.error('Approval Failed', 'Failed to approve application. Please try again.');
      }
    },
    async handleRejectConfirm(reason) {
      try {
        this.rejectingApplication = true;
        await adminService.rejectApplication(this.appToReject.id, reason);
        this.closeRejectModal();
        await this.loadApplications();
        this.toast.success('Application Rejected', 'The tutor application has been rejected');
      } catch (error) {
        console.error('Failed to reject application:', error);
        this.toast.error('Rejection Failed', 'Failed to reject application. Please try again.');
        this.rejectingApplication = false;
      }
    },
    async handleRejectFromDetail({ id, reason }) {
      try {
        await adminService.rejectApplication(id, reason);
        this.selectedApp = null;
        await this.loadApplications();
        this.toast.success('Application Rejected', 'The tutor application has been rejected');
      } catch (error) {
        console.error('Failed to reject application:', error);
        this.toast.error('Rejection Failed', 'Failed to reject application. Please try again.');
      }
    },
    async handleRequestInfo({ id, message }) {
      try {
        await adminService.requestAdditionalInfo(id, message);
        this.selectedApp = null;
        await this.loadApplications();
        this.toast.success('Request Sent', 'Additional information request has been sent to the tutor');
      } catch (error) {
        console.error('Failed to send request:', error);
        this.toast.error('Request Failed', error.response?.data?.message || 'Failed to send request. Please try again.');
      }
    },
    isProfileUpdatedAfterRequest(app) {
      if (!app.additionalInfoRequested || !app.requestedAt) return false;
      if (!app.tutorProfile?.updatedAt) return false;

      const profileUpdated = new Date(app.tutorProfile.updatedAt);
      const infoRequested = new Date(app.requestedAt);

      console.log('=== List Badge Check ===');
      console.log('Tutor:', app.tutorProfile?.user?.fullName);
      console.log('Profile updatedAt:', app.tutorProfile.updatedAt);
      console.log('Request requestedAt:', app.requestedAt);
      console.log('Is Updated?:', profileUpdated > infoRequested);
      console.log('=======================');

      return profileUpdated > infoRequested;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    },
  },
};
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
</style>
