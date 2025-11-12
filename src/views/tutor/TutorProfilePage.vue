<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Tutor Profile</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div class="flex items-center gap-4">
            <div class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <span class="text-3xl">👤</span>
              </div>
            </div>
            <div>
              <input
                type="file"
                ref="avatarInput"
                accept="image/jpeg,image/png"
                @change="handleAvatarChange"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.avatarInput.click()"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Choose Photo
              </button>
              <p class="text-xs text-gray-500 mt-1">JPG or PNG, max 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bio (200-1000 characters)</label>
          <textarea
            v-model="form.bio"
            rows="4"
            required
            minlength="200"
            maxlength="1000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">{{ form.bio.length }} / 1000 characters</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Education Background</label>
          <textarea
            v-model="form.educationBackground"
            rows="2"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Teaching Experience (Years)</label>
          <input
            v-model.number="form.teachingExperienceYears"
            type="number"
            min="0"
            max="50"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Subjects (1-5)</label>
          <input
            v-model="subjectsInput"
            type="text"
            placeholder="e.g., Matematika, Fisika, Kimia (comma-separated)"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Grade Levels</label>
          <input
            v-model="gradeLevelsInput"
            type="text"
            placeholder="e.g., 10, 11, 12 (comma-separated)"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Teaching Methods</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.teachingMethods"
                type="checkbox"
                value="online"
                class="mr-2"
              />
              Online
            </label>
            <label class="flex items-center">
              <input
                v-model="form.teachingMethods"
                type="checkbox"
                value="offline"
                class="mr-2"
              />
              Offline
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (Rp 50,000 - 1,000,000)</label>
          <input
            v-model.number="form.hourlyRate"
            type="number"
            min="50000"
            max="1000000"
            step="10000"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            v-model="form.city"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Province</label>
          <input
            v-model="form.province"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-800">{{ successMessage }}</p>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { tutorService } from '@/services/tutorService';
import { userService } from '@/services/userService';

export default {
  name: 'TutorProfilePage',
  data() {
    return {
      loading: true,
      saving: false,
      error: null,
      successMessage: null,
      profile: null,
      avatarPreview: null,
      avatarFile: null,
      form: {
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

        const user = await userService.getProfile();
        if (user.profileImageUrl) {
          this.avatarPreview = user.profileImageUrl;
        }

        this.profile = await tutorService.getProfile();

        if (this.profile) {
          this.form = {
            bio: this.profile.bio || '',
            educationBackground: this.profile.educationBackground || '',
            teachingExperienceYears: this.profile.teachingExperienceYears || 0,
            subjects: this.profile.subjects || [],
            gradeLevels: this.profile.gradeLevels || [],
            teachingMethods: this.profile.teachingMethods || [],
            hourlyRate: this.profile.hourlyRate || 100000,
            city: this.profile.city || '',
            province: this.profile.province || '',
          };
          this.subjectsInput = this.form.subjects.join(', ');
          this.gradeLevelsInput = this.form.gradeLevels.join(', ');
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          this.error = err.response?.data?.message || 'Failed to load profile';
        }
      } finally {
        this.loading = false;
      }
    },
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        this.error = 'File size must be less than 5MB';
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.error = 'Only JPG and PNG files are allowed';
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
      try {
        this.saving = true;
        this.error = null;
        this.successMessage = null;

        if (this.avatarFile) {
          await userService.uploadAvatar(this.avatarFile);
        }

        this.form.subjects = this.subjectsInput.split(',').map(s => s.trim()).filter(Boolean);
        this.form.gradeLevels = this.gradeLevelsInput.split(',').map(g => parseInt(g.trim())).filter(Boolean);

        if (this.form.subjects.length === 0) {
          this.error = 'At least one subject is required';
          this.saving = false;
          return;
        }

        if (this.form.gradeLevels.length === 0) {
          this.error = 'At least one grade level is required';
          this.saving = false;
          return;
        }

        if (this.form.teachingMethods.length === 0) {
          this.error = 'At least one teaching method is required';
          this.saving = false;
          return;
        }

        if (this.profile) {
          await tutorService.updateProfile(this.form);
          this.successMessage = 'Profile updated successfully!';
        } else {
          await tutorService.createProfile(this.form);
          this.successMessage = 'Profile created successfully!';
          await this.loadProfile();
        }

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to save profile';
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
