<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-6 lg:px-12">
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
                  class="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center"
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
                <h2 class="text-xl font-black text-gray-900 mb-1">{{ form.fullName || 'Tutor' }}</h2>
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
              <h3 class="text-3xl font-black text-gray-900">Professional Information</h3>
            </div>

            <div class="space-y-8">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Bio (200-1000 characters)</label>
              <textarea
                v-model="form.bio"
                rows="4"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.bio,
                  'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.bio
                }"
                class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900 resize-none"
                placeholder="Tell students about yourself, your teaching philosophy, and what makes you a great tutor..."
              ></textarea>
              <p v-if="fieldErrors.bio" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.bio }}
              </p>
              <p class="text-sm text-gray-500 font-medium mt-1">{{ form.bio.length }} / 1000 characters</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Education Background</label>
                <textarea
                  v-model="form.educationBackground"
                  rows="3"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.educationBackground,
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.educationBackground
                  }"
                  class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900 resize-none"
                  placeholder="e.g., Bachelor's in Mathematics, University of Indonesia"
                ></textarea>
                <p v-if="fieldErrors.educationBackground" class="text-sm text-red-600 font-medium mt-1">
                  {{ fieldErrors.educationBackground }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Teaching Experience (Years)</label>
                <input
                  v-model.number="form.teachingExperienceYears"
                  type="text"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.teachingExperienceYears,
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.teachingExperienceYears
                  }"
                  class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                  placeholder="Years of teaching experience"
                />
                <p v-if="fieldErrors.teachingExperienceYears" class="text-sm text-red-600 font-medium mt-1">
                  {{ fieldErrors.teachingExperienceYears }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Subjects (1-5)</label>
                <input
                  v-model="subjectsInput"
                  type="text"
                  placeholder="e.g., Matematika, Fisika, Kimia"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.subjects,
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.subjects
                  }"
                  class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                />
                <p v-if="fieldErrors.subjects" class="text-sm text-red-600 font-medium mt-1">
                  {{ fieldErrors.subjects }}
                </p>
                <p class="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Grade Levels</label>
                <input
                  v-model="gradeLevelsInput"
                  type="text"
                  placeholder="e.g., 10, 11, 12"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.gradeLevels,
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.gradeLevels
                  }"
                  class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                />
                <p v-if="fieldErrors.gradeLevels" class="text-sm text-red-600 font-medium mt-1">
                  {{ fieldErrors.gradeLevels }}
                </p>
                <p class="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">Teaching Methods</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 transition-all">
                  <input
                    v-model="form.teachingMethods"
                    type="checkbox"
                    value="online"
                    class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="font-bold text-gray-700">Online</span>
                </label>
                <label class="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 transition-all">
                  <input
                    v-model="form.teachingMethods"
                    type="checkbox"
                    value="offline"
                    class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="font-bold text-gray-700">Offline</span>
                </label>
              </div>
              <p v-if="fieldErrors.teachingMethods" class="text-sm text-red-600 font-medium mt-1">
                {{ fieldErrors.teachingMethods }}
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Hourly Rate (Rp)</label>
                <input
                  v-model.number="form.hourlyRate"
                  type="text"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.hourlyRate,
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.hourlyRate
                  }"
                  class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                  placeholder="100000"
                />
                <p v-if="fieldErrors.hourlyRate" class="text-sm text-red-600 font-medium mt-1">
                  {{ fieldErrors.hourlyRate }}
                </p>
                <p class="text-xs text-gray-400 mt-1">Rp 50,000 - 1,000,000</p>
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
                <input
                  v-model="form.province"
                  type="text"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-100': fieldErrors.province,
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !fieldErrors.province
                  }"
                  class="w-full px-5 py-3 border-2 rounded-2xl focus:ring-4 transition-all font-medium text-gray-900"
                  placeholder="Enter your province"
                />
                <p v-if="fieldErrors.province" class="text-sm text-red-600 font-medium mt-1">
                  {{ fieldErrors.province }}
                </p>
              </div>
            </div>
          </div>
          </div>

          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-16 py-6 rounded-full text-xl font-black hover:from-blue-700 hover:to-blue-600 hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    </div>
  </div>
</template>

<script>
import { tutorService } from '@/services/tutorService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';

export default {
  name: 'TutorProfilePage',
  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    return { authStore, toast };
  },
  data() {
    return {
      loading: true,
      saving: false,
      profile: null,
      avatarPreview: null,
      avatarFile: null,
      form: {
        fullName: '',
        email: '',
        phoneNumber: '',
        bio: '',
        educationBackground: '',
        teachingExperienceYears: 0,
        subjects: [],
        gradeLevels: [],
        teachingMethods: [],
        hourlyRate: 100000,
        city: '',
        province: '',
      },
      subjectsInput: '',
      gradeLevelsInput: '',
      fieldErrors: {
        fullName: '',
        phoneNumber: '',
        bio: '',
        educationBackground: '',
        teachingExperienceYears: '',
        subjects: '',
        gradeLevels: '',
        teachingMethods: '',
        hourlyRate: '',
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
        this.error = null;

        if (this.authStore.user) {
          this.form.fullName = this.authStore.user.fullName || '';
          this.form.email = this.authStore.user.email || '';
          this.form.phoneNumber = this.authStore.user.phoneNumber || '';
          if (this.authStore.user.profileImageUrl) {
            this.avatarPreview = this.authStore.user.profileImageUrl;
          }
        }

        this.profile = await tutorService.getProfile();

        if (this.profile) {
          this.form.bio = this.profile.bio || '';
          this.form.educationBackground = this.profile.educationBackground || '';
          this.form.teachingExperienceYears = parseInt(this.profile.teachingExperienceYears) || 0;
          this.form.subjects = this.profile.subjects || [];
          this.form.gradeLevels = this.profile.gradeLevels || [];
          this.form.teachingMethods = this.profile.teachingMethods || [];
          this.form.hourlyRate = parseInt(this.profile.hourlyRate) || 100000;
          this.form.city = this.profile.city || '';
          this.form.province = this.profile.province || '';
          this.subjectsInput = this.form.subjects.join(', ');
          this.gradeLevelsInput = this.form.gradeLevels.join(', ');
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          this.toast.error('Load Failed', err.response?.data?.message || 'Failed to load profile');
        }
      } finally {
        this.loading = false;
      }
    },
    clearFieldErrors() {
      this.fieldErrors = {
        fullName: '',
        phoneNumber: '',
        bio: '',
        educationBackground: '',
        teachingExperienceYears: '',
        subjects: '',
        gradeLevels: '',
        teachingMethods: '',
        hourlyRate: '',
        city: '',
        province: '',
      };
    },
    validateForm() {
      let isValid = true;

      if (!this.form.fullName.trim()) {
        this.fieldErrors.fullName = 'Full name is required';
        isValid = false;
      } else if (this.form.fullName.trim().length < 3 || this.form.fullName.trim().length > 100) {
        this.fieldErrors.fullName = 'Full name must be between 3 and 100 characters';
        isValid = false;
      }

      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!this.form.phoneNumber.trim()) {
        this.fieldErrors.phoneNumber = 'Phone number is required';
        isValid = false;
      } else if (!phoneRegex.test(this.form.phoneNumber.trim())) {
        this.fieldErrors.phoneNumber = 'Invalid Indonesian phone number format (e.g., 081234567890)';
        isValid = false;
      }

      if (!this.form.bio.trim()) {
        this.fieldErrors.bio = 'Bio is required';
        isValid = false;
      } else if (this.form.bio.trim().length < 200 || this.form.bio.trim().length > 1000) {
        this.fieldErrors.bio = 'Bio must be between 200 and 1000 characters';
        isValid = false;
      }

      if (!this.form.educationBackground.trim()) {
        this.fieldErrors.educationBackground = 'Education background is required';
        isValid = false;
      } else if (this.form.educationBackground.trim().length < 10) {
        this.fieldErrors.educationBackground = 'Education background must be at least 10 characters';
        isValid = false;
      }

      const years = Number(this.form.teachingExperienceYears);
      if (isNaN(years)) {
        this.fieldErrors.teachingExperienceYears = 'Teaching experience must be a valid number';
        isValid = false;
      } else if (years < 0 || years > 50) {
        this.fieldErrors.teachingExperienceYears = 'Teaching experience must be between 0 and 50 years';
        isValid = false;
      }

      if (this.form.subjects.length === 0) {
        this.fieldErrors.subjects = 'At least one subject is required';
        isValid = false;
      } else if (this.form.subjects.length > 5) {
        this.fieldErrors.subjects = 'Maximum 5 subjects allowed';
        isValid = false;
      }

      if (this.form.gradeLevels.length === 0) {
        this.fieldErrors.gradeLevels = 'At least one grade level is required';
        isValid = false;
      }

      if (this.form.teachingMethods.length === 0) {
        this.fieldErrors.teachingMethods = 'At least one teaching method is required';
        isValid = false;
      }

      const rate = Number(this.form.hourlyRate);
      if (isNaN(rate)) {
        this.fieldErrors.hourlyRate = 'Hourly rate must be a valid number';
        isValid = false;
      } else if (rate < 50000 || rate > 1000000) {
        this.fieldErrors.hourlyRate = 'Hourly rate must be between Rp 50,000 and Rp 1,000,000';
        isValid = false;
      }

      if (!this.form.city.trim()) {
        this.fieldErrors.city = 'City is required';
        isValid = false;
      } else if (this.form.city.trim().length < 2 || this.form.city.trim().length > 50) {
        this.fieldErrors.city = 'City must be between 2 and 50 characters';
        isValid = false;
      }

      if (!this.form.province.trim()) {
        this.fieldErrors.province = 'Province is required';
        isValid = false;
      } else if (this.form.province.trim().length < 2 || this.form.province.trim().length > 50) {
        this.fieldErrors.province = 'Province must be between 2 and 50 characters';
        isValid = false;
      }

      return isValid;
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
    async handleSubmit() {
      this.clearFieldErrors();

      this.form.subjects = this.subjectsInput.split(',').map(s => s.trim()).filter(Boolean);
      this.form.gradeLevels = this.gradeLevelsInput.split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g));

      if (!this.validateForm()) {
        this.toast.error('Validation Failed', 'Please check the highlighted fields');
        return;
      }

      try {
        this.saving = true;

        const payload = {
          fullName: this.form.fullName,
          phoneNumber: this.form.phoneNumber,
          bio: this.form.bio,
          educationBackground: this.form.educationBackground,
          teachingExperienceYears: parseInt(this.form.teachingExperienceYears) || 0,
          subjects: this.form.subjects,
          gradeLevels: this.form.gradeLevels,
          teachingMethods: this.form.teachingMethods,
          hourlyRate: parseInt(this.form.hourlyRate) || 100000,
          city: this.form.city,
          province: this.form.province,
        };

        if (this.avatarFile) {
          payload.profileImageUrl = this.avatarFile;
        }

        await userService.updateProfile(payload);

        this.toast.success(
          this.profile ? 'Profile Updated!' : 'Profile Created!',
          'Your teaching profile has been saved successfully'
        );

        await this.authStore.fetchCurrentUser();
        await this.loadProfile();
      } catch (err) {
        this.toast.error('Save Failed', err.response?.data?.message || 'An error occurred while saving');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
