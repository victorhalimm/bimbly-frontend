<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <div class="py-12 pt-24 px-6 lg:px-12 max-w-7xl mx-auto">
    <div class="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-96 h-96 bg-yellow-100 rounded-full opacity-15 blur-3xl"></div>

    <div class="relative z-10">
      <div v-if="loading" class="bg-white rounded-[2.5rem] shadow-xl p-12 text-center">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside class="lg:col-span-3">
          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 sticky top-8">
            <div class="flex flex-col items-center text-center">
              <div class="relative mb-6">
                <div class="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden shadow-xl">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-blue-400">
                    <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <button
                  type="button"
                  @click="$refs.avatarInput.click()"
                  class="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all ease-in-out flex items-center justify-center cursor-pointer"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
                <input
                  type="file"
                  ref="avatarInput"
                  accept="image/jpeg,image/png"
                  @change="handleAvatarChange"
                  class="hidden"
                />
              </div>

              <p class="text-xs text-gray-400 mt-4 mb-6">JPG or PNG, max 5MB</p>

              <div class="w-full pt-6 border-t-2 border-gray-100">
                <h2 class="text-xl font-black text-gray-900 mb-1">{{ form.fullName || 'Student' }}</h2>
                <p class="text-sm text-gray-500 font-medium">{{ form.email }}</p>
              </div>
            </div>
          </div>
        </aside>

        <main class="lg:col-span-9">
          <form @submit.prevent="handleSubmit" class="space-y-8">

          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12">
            <div class="flex items-center gap-4 mb-8 pb-6 border-b-2 border-blue-50">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-3xl font-black text-gray-900">Personal Information</h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                v-model="form.fullName"
                type="text"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.fullName,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.fullName
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                placeholder="Enter your full name"
              />
              <p v-if="fieldErrors.fullName" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.fullName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                v-model="form.email"
                type="email"
                disabled
                class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                placeholder="your@email.com"
              />
              <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              <button
                type="button"
                @click="showChangePasswordModal = true"
                class="w-full mt-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all ease-in-out shadow-lg cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd"/>
                </svg>
                Change Password
              </button>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                v-model="form.phoneNumber"
                type="text"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.phoneNumber,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.phoneNumber
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                placeholder="081234567890"
              />
              <p v-if="fieldErrors.phoneNumber" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.phoneNumber }}
              </p>
            </div>
          </div>
          </div>

          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12">
            <div class="flex items-center gap-4 mb-8 pb-6 border-b-2 border-yellow-50">
              <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h3 class="text-3xl font-black text-gray-900">Academic Information</h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Current Grade</label>
              <select
                v-model.number="form.currentGrade"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.currentGrade,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.currentGrade
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
              >
                <option value="">Select your grade</option>
                <option v-for="grade in 12" :key="grade" :value="grade">Grade {{ grade }}</option>
              </select>
              <p v-if="fieldErrors.currentGrade" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.currentGrade }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">School Name</label>
              <input
                v-model="form.schoolName"
                type="text"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.schoolName,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.schoolName
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                placeholder="Enter your school name"
              />
              <p v-if="fieldErrors.schoolName" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.schoolName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">City</label>
              <input
                v-model="form.city"
                type="text"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.city,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.city
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                placeholder="Enter your city"
              />
              <p v-if="fieldErrors.city" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.city }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Province</label>
              <select
                v-model="form.province"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.province,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.province
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
              >
                <option value="">Select your province</option>
                <option v-for="province in provinces" :key="province.name" :value="province.name">{{ province.label }}</option>
              </select>
              <p v-if="fieldErrors.province" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.province }}
              </p>
            </div>

            <div class="lg:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
              <textarea
                v-model="form.address"
                rows="4"
                class="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900 resize-none"
                placeholder="Enter your complete address"
              ></textarea>
            </div>
          </div>
          </div>

          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-16 py-6 rounded-full text-xl font-black hover:from-blue-700 hover:to-blue-600 transition-all ease-in-out shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{{ saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile') }}</span>
              <div v-if="!saving" class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </button>
          </div>
          </form>
        </main>
      </div>

      <ChangePasswordModal
        :isOpen="showChangePasswordModal"
        @close="showChangePasswordModal = false"
      />
    </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.store';
import { useStudentStore } from '@/stores/student.store';
import { useToast } from '@/composables/useToast';
import { PROVINCES } from '@/config/provinces.config';
import ChangePasswordModal from '@/components/common/ChangePasswordModal.vue';

export default {
  name: 'StudentProfilePage',
  components: {
    ChangePasswordModal,
  },
  setup() {
    const authStore = useAuthStore();
    const studentStore = useStudentStore();
    const toast = useToast();

    return { authStore, studentStore, toast };
  },
  data() {
    return {
      loading: true,
      saving: false,
      showChangePasswordModal: false,
      profile: null,
      avatarPreview: null,
      avatarFile: null,
      provinces: PROVINCES,
      form: {
        fullName: '',
        email: '',
        phoneNumber: '',
        currentGrade: '',
        schoolName: '',
        city: '',
        province: '',
        address: '',
      },
      fieldErrors: {
        fullName: '',
        phoneNumber: '',
        currentGrade: '',
        schoolName: '',
        city: '',
        province: '',
      },
    };
  },
  async mounted() {
    await this.loadProfile();
  },
  methods: {
    async loadProfile() {
      try {
        this.loading = true;

        if (this.authStore.user) {
          this.form.fullName = this.authStore.user.fullName || '';
          this.form.email = this.authStore.user.email || '';
          this.form.phoneNumber = this.authStore.user.phoneNumber || '';
          this.form.city = this.authStore.user.city || '';
          this.form.province = this.authStore.user.province || '';
          if (this.authStore.user.profileImageUrl) {
            this.avatarPreview = this.authStore.user.profileImageUrl;
          }
        }

        await this.studentStore.fetchCurrentUserProfile();
        this.profile = this.studentStore.currentUserProfile;

        if (this.profile) {
          this.form.currentGrade = this.profile.currentGrade || 10;
          this.form.schoolName = this.profile.schoolName || '';
          this.form.address = this.profile.address || '';
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          this.toast.error('Load Failed', err.response?.data?.message || 'Failed to load profile');
        }
      } finally {
        this.loading = false;
      }
    },
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('File Too Large', 'File size must be less than 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.toast.error('Invalid File Type', 'Only JPG and PNG files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target.result;
        this.avatarFile = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    clearFieldErrors() {
      this.fieldErrors = {
        fullName: '',
        phoneNumber: '',
        currentGrade: '',
        schoolName: '',
        city: '',
        province: '',
      };
    },
    validateForm() {
      this.clearFieldErrors();
      let isValid = true;

      if (!this.form.fullName || this.form.fullName.trim().length === 0) {
        this.fieldErrors.fullName = 'Full name is required';
        isValid = false;
      } else if (this.form.fullName.trim().length < 3) {
        this.fieldErrors.fullName = 'Full name must be at least 3 characters';
        isValid = false;
      } else if (this.form.fullName.trim().length > 100) {
        this.fieldErrors.fullName = 'Full name must not exceed 100 characters';
        isValid = false;
      }

      if (!this.form.phoneNumber || this.form.phoneNumber.trim().length === 0) {
        this.fieldErrors.phoneNumber = 'Phone number is required';
        isValid = false;
      } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(this.form.phoneNumber.trim())) {
        this.fieldErrors.phoneNumber = 'Please enter a valid Indonesian phone number';
        isValid = false;
      }

      if (!this.form.currentGrade) {
        this.fieldErrors.currentGrade = 'Current grade is required';
        isValid = false;
      } else {
        const grade = parseInt(this.form.currentGrade);
        if (isNaN(grade) || grade < 1 || grade > 12) {
          this.fieldErrors.currentGrade = 'Grade must be between 1 and 12';
          isValid = false;
        }
      }

      if (!this.form.schoolName || this.form.schoolName.trim().length === 0) {
        this.fieldErrors.schoolName = 'School name is required';
        isValid = false;
      } else if (this.form.schoolName.trim().length < 3) {
        this.fieldErrors.schoolName = 'School name must be at least 3 characters';
        isValid = false;
      } else if (this.form.schoolName.trim().length > 100) {
        this.fieldErrors.schoolName = 'School name must not exceed 100 characters';
        isValid = false;
      }

      if (!this.form.city || this.form.city.trim().length === 0) {
        this.fieldErrors.city = 'City is required';
        isValid = false;
      } else if (this.form.city.trim().length < 2) {
        this.fieldErrors.city = 'City must be at least 2 characters';
        isValid = false;
      } else if (this.form.city.trim().length > 50) {
        this.fieldErrors.city = 'City must not exceed 50 characters';
        isValid = false;
      }

      if (!this.form.province || this.form.province.trim().length === 0) {
        this.fieldErrors.province = 'Province is required';
        isValid = false;
      } else if (this.form.province.trim().length < 2) {
        this.fieldErrors.province = 'Province must be at least 2 characters';
        isValid = false;
      } else if (this.form.province.trim().length > 50) {
        this.fieldErrors.province = 'Province must not exceed 50 characters';
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      this.clearFieldErrors();

      if (!this.validateForm()) {
        this.toast.error('Validation Failed', 'Please check the highlighted fields');
        return;
      }

      try {
        this.saving = true;

        const payload = {
          fullName: this.form.fullName,
          phoneNumber: this.form.phoneNumber,
          currentGrade: this.form.currentGrade,
          schoolName: this.form.schoolName,
          city: this.form.city,
          province: this.form.province,
          address: this.form.address,
        };

        if (this.avatarFile) {
          payload.profileImageUrl = this.avatarFile;
        }

        await this.studentStore.updateProfile(payload);

        this.toast.success(
          this.profile ? 'Profile Updated!' : 'Profile Created!',
          'Your information has been saved successfully'
        );

        await this.authStore.fetchCurrentUser();
        this.profile = this.studentStore.currentUserProfile;
      } catch (err) {
        this.toast.error('Save Failed', err.response?.data?.message || 'An error occurred while saving');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
