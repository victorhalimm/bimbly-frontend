<template>
  <div class="min-h-screen bg-gray-50">
    <div class="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 pt-28 pb-16 px-4 overflow-hidden">
      <div class="absolute top-12 right-16 w-36 h-36 bg-blue-200 rounded-full opacity-40 blur-3xl animate-blob"></div>
      <div class="absolute bottom-24 left-12 w-44 h-44 bg-purple-200 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>

      <div class="absolute top-1/3 left-20 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
      <div class="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-float animation-delay-500"></div>
      <div class="absolute bottom-1/3 right-16 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute top-2/3 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-1500"></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <button @click="$router.push('/tutor/profile')"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors hover:cursor-pointer">
          <IconArrowLeft size="20" stroke="2" />
          <span class="font-medium">Back to Profile</span>
        </button>

        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          Application
          <span class="relative inline-block px-1">
            <span class="relative z-20">Status</span>
            <svg class="absolute -bottom-1 left-0 w-full h-3 z-10" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
              <path d="M2,8 Q25,2 50,8 T98,6" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" opacity="0.4" />
              <path d="M5,6 Q30,10 55,4 T95,8" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" opacity="0.3" />
            </svg>
          </span>
        </h1>

        <p class="text-gray-600 text-lg mt-4">Track your tutor application progress</p>
      </div>

      <svg class="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
        <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#f9fafb" />
      </svg>
    </div>

    <div class="max-w-lg mx-auto px-4 py-8">
      <div v-if="loading" class="bg-white rounded-3xl shadow-lg p-12 text-center">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading application status...</p>
      </div>

      <div v-else-if="!application" class="bg-white rounded-3xl shadow-lg p-12 text-center">
        <div class="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <IconClipboardList size="40" stroke="1.5" class="text-gray-400" />
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3">No Application Submitted</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Complete your profile and submit your application to become an approved tutor on the platform.
        </p>
        <button
          @click="$router.push('/tutor/profile')"
          class="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
        >
          Complete Profile
          <IconArrowRight size="20" stroke="2" />
        </button>
      </div>

      <div v-else class="bg-white rounded-3xl shadow-lg p-8 md:p-10">
        <h2 class="text-2xl font-black text-gray-900 mb-8">Application Status</h2>

        <div class="space-y-0">
          <div class="flex items-start gap-4">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600">
                <IconCheck size="20" stroke="3" />
              </div>
              <div class="h-16 border-l-2 border-dashed" :style="{ borderColor: step2BorderHex }"></div>
            </div>
            <div class="flex-1 pb-8">
              <h3 class="text-lg font-bold text-gray-900">Application Submitted</h3>
              <p class="text-gray-500 text-sm mt-1">
                Your application has been submitted successfully.
              </p>
              <p class="text-gray-400 text-xs mt-2">{{ formatDate(application.submittedAt) }}</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                :class="step2CircleClass"
              >
                <IconCheck v-if="application.status === 'approved'" size="20" stroke="3" />
                <IconX v-else-if="application.status === 'rejected'" size="20" stroke="3" />
                <span v-else>2</span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900">{{ step2Title }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ step2Description }}</p>
              <p v-if="application.status !== 'pending'" class="text-gray-400 text-xs mt-2">
                {{ formatDate(application.reviewedAt) }}
              </p>
            </div>
            <button
              v-if="application.status === 'pending' || application.status === 'rejected'"
              @click="toggleDetails"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <IconChevronDown
                size="20"
                stroke="2"
                class="transition-transform duration-200"
                :class="{ 'rotate-180': showDetails }"
              />
            </button>
          </div>
        </div>

        <transition name="slide-down">
        <div
          v-if="showDetails && application.status === 'pending' && !application.additionalInfoRequested"
          class="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-100"
        >
          <p class="text-gray-700 mb-4">
            Our team is reviewing your application. This usually takes 1-3 business days.
            We'll notify you once a decision has been made.
          </p>
          <div class="flex items-center gap-2 text-sm text-blue-600">
            <IconClock size="16" stroke="2" />
            <span>Expected review time: 1-3 business days</span>
          </div>
        </div>
        </transition>

        <transition name="slide-down">
        <div
          v-if="showDetails && application.status === 'pending' && application.additionalInfoRequested"
          class="mt-6 space-y-4"
        >
          <div class="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
            <div class="flex items-start gap-3 mb-4">
              <IconAlertTriangle size="20" stroke="2" class="text-yellow-600 mt-0.5" />
              <div>
                <p class="font-bold text-gray-900">Admin's Request</p>
                <p class="text-gray-700 mt-2">{{ application.requestMessage }}</p>
                <p class="text-gray-400 text-xs mt-3">Requested on {{ formatDate(application.requestedAt) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6">
            <p class="text-sm font-bold text-gray-900 mb-3">What to do next:</p>
            <ol class="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Go to your profile page</li>
              <li>Update the requested information</li>
              <li>Save your changes</li>
              <li>The admin will be notified automatically</li>
            </ol>
          </div>

          <button
            @click="$router.push('/tutor/profile')"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full font-bold transition-all shadow-lg cursor-pointer inline-flex items-center justify-center gap-2"
          >
            Update Profile
            <IconArrowRight size="20" stroke="2" />
          </button>
        </div>
        </transition>

        <transition name="slide-down">
        <div
          v-if="showDetails && application.status === 'rejected'"
          class="mt-6 space-y-4"
        >
          <div class="bg-red-50 rounded-2xl p-6 border border-red-200">
            <div class="flex items-start gap-3 mb-4">
              <IconCircleX size="20" stroke="2" class="text-red-600 mt-0.5" />
              <div>
                <p class="font-bold text-gray-900">Reason for Rejection</p>
                <p class="text-gray-700 mt-2">{{ application.rejectionReason }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6">
            <p class="text-sm font-bold text-gray-900 mb-3">What you can do:</p>
            <ul class="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Address the issues mentioned above</li>
              <li>Update your profile with the required information</li>
              <li>Submit a new application when ready</li>
            </ul>
          </div>

          <div class="flex gap-3">
            <button
              @click="$router.push('/tutor/profile')"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full font-bold transition-all shadow-lg cursor-pointer inline-flex items-center justify-center gap-2"
            >
              Resubmit Application
              <IconArrowRight size="20" stroke="2" />
            </button>
            <button
              @click="contactSupport"
              class="px-6 py-4 rounded-full font-bold transition-all cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Contact Support
            </button>
          </div>
        </div>
        </transition>

        <div
          v-if="application.status === 'approved'"
          class="mt-6 bg-green-50 rounded-2xl p-6 border border-green-200"
        >
          <div class="flex items-start gap-3 mb-4">
            <IconCircleCheck size="20" stroke="2" class="text-green-600 mt-0.5" />
            <div>
              <p class="font-bold text-gray-900">Congratulations!</p>
              <p class="text-gray-700 mt-2">
                Your tutor application has been approved. You can now accept booking requests from students.
              </p>
            </div>
          </div>
          <button
            @click="$router.push('/tutor/bookings')"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full font-bold transition-all shadow-lg cursor-pointer inline-flex items-center justify-center gap-2 mt-4"
          >
            Go to Bookings
            <IconArrowRight size="20" stroke="2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IconArrowLeft,
  IconArrowRight,
  IconClipboardList,
  IconClock,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconCheck,
  IconX,
  IconChevronDown
} from '@tabler/icons-vue';
import { tutorService } from '@/services/tutor.service';

export default defineComponent({
  name: 'ApplicationStatus',
  components: {
    IconArrowLeft,
    IconArrowRight,
    IconClipboardList,
    IconClock,
    IconAlertTriangle,
    IconCircleCheck,
    IconCircleX,
    IconCheck,
    IconX,
    IconChevronDown,
  },
  data() {
    return {
      loading: true,
      application: null as any,
      showDetails: true,
    };
  },
  computed: {
    step2Title(): string {
      if (this.application?.status === 'approved') return 'Application Approved';
      if (this.application?.status === 'rejected') return 'Application Rejected';
      if (this.application?.additionalInfoRequested) return 'Action Required';
      return 'Under Review';
    },
    step2Description(): string {
      if (this.application?.status === 'approved') return 'Your application has been approved.';
      if (this.application?.status === 'rejected') return 'Your application was not approved.';
      if (this.application?.additionalInfoRequested) return 'Additional information is needed.';
      return 'Our team is reviewing your application.';
    },
    step2CircleClass(): string {
      if (this.application?.status === 'approved') return 'bg-green-500 text-white';
      if (this.application?.status === 'rejected') return 'bg-red-500 text-white';
      if (this.application?.additionalInfoRequested) return 'bg-yellow-500 text-white';
      return 'bg-blue-600 text-white';
    },
    step2BorderHex(): string {
      if (this.application?.status === 'approved') return '#22c55e';
      if (this.application?.status === 'rejected') return '#ef4444';
      if (this.application?.additionalInfoRequested) return '#eab308';
      return '#2563eb';
    },
  },
  async mounted() {
    await this.fetchApplicationStatus();
  },
  methods: {
    async fetchApplicationStatus() {
      try {
        this.loading = true;
        this.application = await tutorService.getApplicationStatus();
      } catch (error: any) {
        if (error.response?.status === 404) {
          this.application = null;
        } else {
          console.error('Error fetching application status:', error);
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(date: string) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      });
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    contactSupport() {
      window.location.href = 'mailto:bimbly.edu@gmail.com';
    }
  }
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.03);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.97);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.01);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
