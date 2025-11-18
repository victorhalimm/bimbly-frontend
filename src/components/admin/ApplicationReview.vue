<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <neo-card variant="elevated" class="bg-gradient-to-br from-blue-50 to-cyan-50">
        <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-400 border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
            <span class="text-base sm:text-xl">👤</span>
          </div>
          <h4 class="text-base sm:text-lg font-black text-gray-900">Personal Information</h4>
        </div>
        <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[80px] mb-1 sm:mb-0">Name:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.user.fullName }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[80px] mb-1 sm:mb-0">Email:</span>
            <span class="font-bold text-gray-700 break-all">{{ application.tutorProfile.user.email }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[80px] mb-1 sm:mb-0">Phone:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.user.phoneNumber }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[80px] mb-1 sm:mb-0">City:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.city }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[80px] mb-1 sm:mb-0">Province:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.province }}</span>
          </div>
        </div>
      </neo-card>

      <neo-card variant="elevated" class="bg-gradient-to-br from-purple-50 to-pink-50">
        <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-400 border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
            <span class="text-base sm:text-xl">📚</span>
          </div>
          <h4 class="text-base sm:text-lg font-black text-gray-900">Teaching Details</h4>
        </div>
        <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[100px] mb-1 sm:mb-0">Experience:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.teachingExperienceYears }} years</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[100px] mb-1 sm:mb-0">Subjects:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.subjects?.join(', ') }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[100px] mb-1 sm:mb-0">Grade Levels:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.gradeLevels?.join(', ') }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[100px] mb-1 sm:mb-0">Methods:</span>
            <span class="font-bold text-gray-700">{{ application.tutorProfile.teachingMethods?.join(', ') }}</span>
          </div>
          <div class="flex items-start flex-col sm:flex-row">
            <span class="font-black text-gray-900 sm:min-w-[100px] mb-1 sm:mb-0">Hourly Rate:</span>
            <span class="font-bold text-green-600">Rp {{ formatNumber(application.tutorProfile.hourlyRate) }}</span>
          </div>
        </div>
      </neo-card>
    </div>

    <neo-card variant="elevated" class="bg-gradient-to-br from-green-50 to-emerald-50">
      <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-400 border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
          <span class="text-base sm:text-xl">🎓</span>
        </div>
        <h4 class="text-base sm:text-lg font-black text-gray-900">Education Background</h4>
      </div>
      <p class="text-xs sm:text-sm font-bold text-gray-700">{{ application.tutorProfile.educationBackground }}</p>
    </neo-card>

    <neo-card variant="elevated" class="bg-gradient-to-br from-yellow-50 to-orange-50">
      <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
          <span class="text-base sm:text-xl">✍️</span>
        </div>
        <h4 class="text-base sm:text-lg font-black text-gray-900">Bio</h4>
      </div>
      <p class="text-xs sm:text-sm font-bold text-gray-700">{{ application.tutorProfile.bio }}</p>
    </neo-card>

    <neo-card v-if="application.tutorProfile.certifications && application.tutorProfile.certifications.length > 0" variant="elevated" class="bg-gradient-to-br from-indigo-50 to-purple-50">
      <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-400 border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
          <span class="text-base sm:text-xl">🏆</span>
        </div>
        <h4 class="text-base sm:text-lg font-black text-gray-900">Certifications</h4>
      </div>
      <div class="space-y-2 sm:space-y-3">
        <div
          v-for="(cert, index) in application.tutorProfile.certifications"
          :key="index"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white border-2 sm:border-4 border-black rounded-lg shadow-md hover:-translate-y-1 transition-transform"
        >
          <span class="text-xs sm:text-sm font-black text-gray-900">{{ cert.name }}</span>
          <a :href="cert.fileUrl" target="_blank" class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-500 border-2 border-black rounded-lg hover:bg-indigo-600 transition-colors w-full sm:w-auto text-center">View</a>
        </div>
      </div>
    </neo-card>

    <div class="pt-4 sm:pt-6 border-t-4 border-black">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <neo-button
          v-if="application.status === 'pending'"
          variant="success"
          size="md"
          class="flex-1 w-full sm:w-auto"
          @click="$emit('approve', application.id)"
        >
          Approve Application
        </neo-button>
        <neo-button
          v-if="application.status === 'pending'"
          variant="danger"
          size="md"
          class="flex-1 w-full sm:w-auto"
          @click="showRejectForm = true"
        >
          Reject Application
        </neo-button>
        <neo-button
          variant="secondary"
          size="md"
          class="w-full sm:w-auto"
          @click="$emit('close')"
        >
          Close
        </neo-button>
      </div>

      <neo-card v-if="showRejectForm" variant="elevated" class="mt-4 sm:mt-6 bg-gradient-to-br from-red-50 to-pink-50">
        <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 border-2 sm:border-4 border-black rounded-lg flex items-center justify-center">
            <span class="text-base sm:text-xl">❌</span>
          </div>
          <label class="text-base sm:text-lg font-black text-gray-900">Rejection Reason</label>
        </div>
        <textarea
          v-model="rejectionReason"
          rows="3"
          class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 sm:border-4 border-black rounded-lg focus:ring-4 focus:ring-black focus:ring-opacity-25 font-medium"
          placeholder="Enter the reason for rejection..."
        ></textarea>
        <div class="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-3">
          <neo-button
            variant="danger"
            size="sm"
            :disabled="!rejectionReason.trim()"
            @click="handleReject"
            class="w-full sm:w-auto"
          >
            Confirm Rejection
          </neo-button>
          <neo-button
            variant="secondary"
            size="sm"
            @click="showRejectForm = false; rejectionReason = ''"
            class="w-full sm:w-auto"
          >
            Cancel
          </neo-button>
        </div>
      </neo-card>
    </div>
  </div>
</template>

<script>
import NeoButton from '@/components/common/ui/NeoButton.vue';
import NeoCard from '@/components/common/ui/NeoCard.vue';

export default {
  name: 'ApplicationReview',
  components: {
    NeoButton,
    NeoCard,
  },
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
    };
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('id-ID').format(num);
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
  },
};
</script>
