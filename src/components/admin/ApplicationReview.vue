<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-50 rounded-lg border border-gray-200 p-5">
        <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Personal Information</h4>
        <div class="space-y-2 text-sm">
          <div class="flex">
            <span class="font-medium text-gray-500 w-24 flex-shrink-0">Name:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.user.fullName }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-24 flex-shrink-0">Email:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-all">{{ application.tutorProfile.user.email }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-24 flex-shrink-0">Phone:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.user.phoneNumber }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-24 flex-shrink-0">City:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.user?.city }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-24 flex-shrink-0">Province:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.user?.province }}</span>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg border border-gray-200 p-5">
        <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Teaching Details</h4>
        <div class="space-y-2 text-sm">
          <div class="flex">
            <span class="font-medium text-gray-500 w-32 flex-shrink-0">Experience:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.teachingExperienceYears }} years</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-32 flex-shrink-0">Subjects:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.subjects?.join(', ') }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-32 flex-shrink-0">Grade Levels:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.gradeLevels?.join(', ') }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-32 flex-shrink-0">Methods:</span>
            <span class="text-gray-900 flex-1 min-w-0 break-words">{{ application.tutorProfile.teachingMethods?.join(', ') }}</span>
          </div>
          <div class="flex">
            <span class="font-medium text-gray-500 w-32 flex-shrink-0">Hourly Rate:</span>
            <span class="font-semibold text-green-600 flex-1 min-w-0 break-words">Rp {{ formatNumber(application.tutorProfile.hourlyRate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Education Background</h4>
      <p class="text-sm text-gray-900 break-words">{{ application.tutorProfile.educationBackground }}</p>
    </div>

    <div class="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Bio</h4>
      <p class="text-sm text-gray-900 leading-relaxed break-words">{{ application.tutorProfile.bio }}</p>
    </div>

    <div v-if="application.tutorProfile.certifications && application.tutorProfile.certifications.length > 0" class="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Certifications</h4>
      <div class="space-y-2">
        <div
          v-for="(cert, index) in application.tutorProfile.certifications"
          :key="index"
          class="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-gray-200"
        >
          <span class="text-sm font-medium text-gray-900 flex-1 min-w-0 break-words">{{ cert.name }}</span>
          <a :href="`http://localhost:3000${cert.fileUrl}`" target="_blank" class="px-4 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors ease-in-out cursor-pointer flex-shrink-0">View File</a>
        </div>
      </div>
    </div>

    <div v-if="application.additionalInfoRequested" class="bg-yellow-50 border border-yellow-300 rounded-lg p-5">
      <h4 class="text-sm font-semibold text-yellow-900 uppercase tracking-wide mb-3">Additional Information Requested</h4>
      <div class="bg-white rounded-lg border border-yellow-200 p-4 mb-4">
        <p class="text-xs text-gray-500 font-medium mb-2">Your Request:</p>
        <p class="text-sm text-gray-900 mb-2 break-words">{{ application.requestMessage }}</p>
        <p class="text-xs text-gray-400">{{ formatDate(application.requestedAt) }}</p>
      </div>
      <div v-if="isProfileUpdatedAfterRequest" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-sm font-medium text-green-900 mb-1">✓ Tutor has updated their profile</p>
        <p class="text-xs text-green-700">Updated: {{ formatDate(application.tutorProfile.updatedAt) }}</p>
        <p class="text-xs text-green-700 mt-2">Review the changes and make your decision below.</p>
      </div>
    </div>

    <div class="pt-4 border-t border-gray-200">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          v-if="application.status === 'pending'"
          @click="$emit('approve', application.id)"
          class="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors ease-in-out cursor-pointer"
        >
          Approve Application
        </button>
        <button
          v-if="application.status === 'pending'"
          @click="showRequestInfoForm = true"
          class="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors ease-in-out cursor-pointer"
        >
          Request More Info
        </button>
        <button
          v-if="application.status === 'pending'"
          @click="showRejectForm = true"
          class="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ease-in-out cursor-pointer"
        >
          Reject Application
        </button>
        <button
          @click="$emit('close')"
          class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ease-in-out cursor-pointer"
        >
          Close
        </button>
      </div>

      <div v-if="showRequestInfoForm" class="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-5">
        <label class="text-sm font-semibold text-gray-900 mb-3 block">Request Additional Information</label>
        <textarea
          v-model="requestMessage"
          rows="4"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 transition-all resize-none"
          placeholder="Specify what additional information you need from the tutor (min 20 characters)..."
        ></textarea>
        <div class="mt-3 flex gap-2">
          <button
            :disabled="!requestMessage.trim() || requestMessage.trim().length < 20"
            @click="handleRequestInfo"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Request
          </button>
          <button
            @click="showRequestInfoForm = false; requestMessage = ''"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ease-in-out cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      <div v-if="showRejectForm" class="mt-4 bg-red-50 border border-red-300 rounded-lg p-5">
        <label class="text-sm font-semibold text-gray-900 mb-3 block">Rejection Reason</label>
        <textarea
          v-model="rejectionReason"
          rows="3"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
          placeholder="Enter the reason for rejection..."
        ></textarea>
        <div class="mt-3 flex gap-2">
          <button
            :disabled="!rejectionReason.trim()"
            @click="handleReject"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Rejection
          </button>
          <button
            @click="showRejectForm = false; rejectionReason = ''"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ease-in-out cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApplicationReview',
  props: {
    application: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showRejectForm: false,
      rejectionReason: '',
      showRequestInfoForm: false,
      requestMessage: '',
    };
  },
  computed: {
    isProfileUpdatedAfterRequest() {
      if (!this.application.additionalInfoRequested || !this.application.requestedAt) return false;
      if (!this.application.tutorProfile?.updatedAt) return false;

      const profileUpdated = new Date(this.application.tutorProfile.updatedAt);
      const infoRequested = new Date(this.application.requestedAt);

      console.log('=== Profile Update Check ===');
      console.log('Tutor:', this.application.tutorProfile?.user?.fullName);
      console.log('Profile updatedAt:', this.application.tutorProfile.updatedAt);
      console.log('Request requestedAt:', this.application.requestedAt);
      console.log('Profile Date obj:', profileUpdated);
      console.log('Request Date obj:', infoRequested);
      console.log('Is Updated?:', profileUpdated > infoRequested);
      console.log('==========================');

      return profileUpdated > infoRequested;
    },
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('id-ID').format(num);
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      });
    },
    handleReject() {
      if (this.rejectionReason.trim()) {
        this.$emit('reject', {
          id: this.application.id,
          reason: this.rejectionReason,
        });
        this.showRejectForm = false;
        this.rejectionReason = '';
      }
    },
    handleRequestInfo() {
      if (this.requestMessage.trim() && this.requestMessage.trim().length >= 20) {
        this.$emit('request-info', {
          id: this.application.id,
          message: this.requestMessage,
        });
        this.showRequestInfoForm = false;
        this.requestMessage = '';
      }
    },
  },
};
</script>
