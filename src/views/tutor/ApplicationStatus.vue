<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-6">
    <div class="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-96 h-96 bg-yellow-100 rounded-full opacity-15 blur-3xl"></div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button
          @click="$router.push('/tutor/profile')"
          class="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all ease-in-out cursor-pointer hover:bg-gray-50"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-4xl font-black text-gray-900">Application Status</h1>
      </div>

      <div v-if="loading" class="bg-white rounded-[2.5rem] shadow-xl p-12 text-center">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading application status...</p>
      </div>

      <div v-else-if="!application" class="bg-white rounded-[2.5rem] shadow-xl p-12 text-center">
        <div class="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3">No Application Submitted</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Complete your profile and submit your application to become an approved tutor on the platform.
        </p>
        <button
          @click="$router.push('/tutor/profile')"
          class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all ease-in-out shadow-lg cursor-pointer"
        >
          Complete Profile
        </button>
      </div>

      <div v-else>
        <div v-if="application.status === 'pending' && !application.additionalInfoRequested"
             class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-[2.5rem] p-10 mb-6 shadow-xl">
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-black text-blue-900 mb-3">Under Review</h2>
              <p class="text-blue-800 mb-6 text-lg">
                Your application is currently being reviewed by our admin team.
                We'll notify you once a decision has been made.
              </p>
              <div class="bg-white rounded-2xl p-6 text-base shadow-inner">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-gray-600 font-medium">Submitted:</span>
                  <span class="font-bold text-gray-900">{{ formatDate(application.submittedAt) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Expected review time:</span>
                  <span class="font-bold text-gray-900">1-3 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="application.status === 'pending' && application.additionalInfoRequested"
             class="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-[2.5rem] p-10 mb-6 shadow-xl">
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-black text-yellow-900 mb-3">Additional Information Requested</h2>
              <p class="text-yellow-800 mb-6 text-lg">
                The admin team needs more information before they can approve your application.
              </p>

              <div class="bg-white rounded-2xl p-8 mb-6 border-l-4 border-yellow-500 shadow-lg">
                <p class="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">Admin's Request:</p>
                <p class="text-gray-900 font-semibold text-xl mb-4 leading-relaxed">
                  {{ application.requestMessage }}
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span>Requested on {{ formatDate(application.requestedAt) }}</span>
                </div>
              </div>

              <div class="bg-yellow-100 rounded-2xl p-6 mb-6">
                <p class="text-sm font-black text-yellow-900 mb-3">What to do next:</p>
                <ol class="text-sm text-yellow-900 space-y-2 list-decimal list-inside font-medium">
                  <li>Go to your profile page</li>
                  <li>Update the requested information</li>
                  <li>Save your changes</li>
                  <li>The admin will be notified automatically</li>
                </ol>
              </div>

              <button
                @click="$router.push('/tutor/profile')"
                class="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-5 rounded-2xl font-black text-lg transition-all ease-in-out shadow-xl cursor-pointer"
              >
                Update Profile & Provide Information
              </button>
            </div>
          </div>
        </div>

        <div v-if="application.status === 'approved'"
             class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-[2.5rem] p-10 mb-6 shadow-xl">
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-black text-green-900 mb-3">Application Approved!</h2>
              <p class="text-green-800 mb-6 text-lg">
                Congratulations! Your tutor application has been approved.
                You can now accept booking requests from students.
              </p>
              <div class="bg-white rounded-2xl p-6 text-base shadow-inner">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-gray-600 font-medium">Submitted:</span>
                  <span class="font-bold text-gray-900">{{ formatDate(application.submittedAt) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Approved:</span>
                  <span class="font-bold text-gray-900">{{ formatDate(application.reviewedAt) }}</span>
                </div>
              </div>
              <button
                @click="$router.push('/tutor/dashboard')"
                class="mt-6 w-full bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all ease-in-out shadow-lg cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div v-if="application.status === 'rejected'"
             class="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-[2.5rem] p-10 mb-6 shadow-xl">
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-black text-red-900 mb-3">Application Not Approved</h2>
              <p class="text-red-800 mb-6 text-lg">
                Unfortunately, your tutor application was not approved at this time.
              </p>

              <div class="bg-white rounded-2xl p-8 mb-6 border-l-4 border-red-500 shadow-lg">
                <p class="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">Reason for Rejection:</p>
                <p class="text-gray-900 font-semibold text-xl mb-4 leading-relaxed">
                  {{ application.rejectionReason }}
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span>Reviewed on {{ formatDate(application.reviewedAt) }}</span>
                </div>
              </div>

              <div class="bg-red-100 rounded-2xl p-6 mb-6">
                <p class="text-sm font-black text-red-900 mb-3">What you can do:</p>
                <ul class="text-sm text-red-900 space-y-2 list-disc list-inside font-medium">
                  <li>Address the issues mentioned above</li>
                  <li>Update your profile with the required information</li>
                  <li>Submit a new application when ready</li>
                  <li>Contact support if you have questions</li>
                </ul>
              </div>

              <div class="flex gap-4">
                <button
                  @click="$router.push('/tutor/profile')"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all ease-in-out shadow-lg cursor-pointer"
                >
                  Resubmit Application
                </button>
                <button
                  @click="contactSupport"
                  class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-2xl font-bold text-lg transition-all ease-in-out shadow-lg cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tutorService } from '@/services/tutor.service';

export default {
  name: 'ApplicationStatus',
  data() {
    return {
      loading: true,
      application: null,
    };
  },
  async mounted() {
    await this.fetchApplicationStatus();
  },
  methods: {
    async fetchApplicationStatus() {
      try {
        this.loading = true;
        this.application = await tutorService.getApplicationStatus();
      } catch (error) {
        if (error.response?.status === 404) {
          this.application = null;
        } else {
          console.error('Error fetching application status:', error);
        }
      } finally {
        this.loading = false;
      }
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
    contactSupport() {
      window.location.href = 'mailto:bimbly.edu@gmail.com';
    }
  }
};
</script>
