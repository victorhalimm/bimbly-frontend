<template>
  <div v-if="isOpen" class="fixed inset-0 backdrop-blur-sm bg-gray-900/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-black text-gray-900">Change Password</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IconX size="24" stroke="2" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
          <div class="relative">
            <input
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              :class="{
                'border-red-500 focus:border-red-500 focus:ring-red-100': errors.currentPassword,
                'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !errors.currentPassword
              }"
              class="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 transition-all font-medium text-gray-900 pr-12"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IconEye v-if="!showCurrentPassword" size="20" stroke="2" />
              <IconEyeOff v-else size="20" stroke="2" />
            </button>
          </div>
          <p v-if="errors.currentPassword" class="text-sm text-red-600 font-medium mt-1">
            {{ errors.currentPassword }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">New Password</label>
          <div class="relative">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              :class="{
                'border-red-500 focus:border-red-500 focus:ring-red-100': errors.newPassword,
                'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !errors.newPassword
              }"
              class="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 transition-all font-medium text-gray-900 pr-12"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IconEye v-if="!showNewPassword" size="20" stroke="2" />
              <IconEyeOff v-else size="20" stroke="2" />
            </button>
          </div>
          <p v-if="errors.newPassword" class="text-sm text-red-600 font-medium mt-1">
            {{ errors.newPassword }}
          </p>
          <p class="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :class="{
                'border-red-500 focus:border-red-500 focus:ring-red-100': errors.confirmPassword,
                'border-gray-200 focus:border-blue-500 focus:ring-blue-100': !errors.confirmPassword
              }"
              class="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 transition-all font-medium text-gray-900 pr-12"
              placeholder="Re-enter your new password"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IconEye v-if="!showConfirmPassword" size="20" stroke="2" />
              <IconEyeOff v-else size="20" stroke="2" />
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-sm text-red-600 font-medium mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            :disabled="submitting"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all ease-in-out shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { IconX, IconEye, IconEyeOff } from '@tabler/icons-vue';
import { authService } from '@/services/auth.service';
import { useToast } from '@/composables/useToast';

export default {
  name: 'ChangePasswordModal',
  components: {
    IconX,
    IconEye,
    IconEyeOff,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'success'],
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      submitting: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      errors: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    closeModal() {
      if (!this.submitting) {
        this.resetForm();
        this.$emit('close');
      }
    },
    resetForm() {
      this.form = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      this.errors = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
    },
    validateForm() {
      this.errors = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      let isValid = true;

      if (!this.form.currentPassword) {
        this.errors.currentPassword = 'Current password is required';
        isValid = false;
      }

      if (!this.form.newPassword) {
        this.errors.newPassword = 'New password is required';
        isValid = false;
      } else if (this.form.newPassword.length < 8) {
        this.errors.newPassword = 'Password must be at least 8 characters';
        isValid = false;
      }

      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your new password';
        isValid = false;
      } else if (this.form.newPassword !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      if (this.form.currentPassword && this.form.newPassword && this.form.currentPassword === this.form.newPassword) {
        this.errors.newPassword = 'New password must be different from current password';
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        this.toast.error('Validation Failed', 'Please check the highlighted fields');
        return;
      }

      try {
        this.submitting = true;

        await authService.resetPassword(
          this.form.currentPassword,
          this.form.newPassword
        );

        this.toast.success('Password Changed!', 'Your password has been updated successfully');
        this.resetForm();
        this.$emit('success');
        this.$emit('close');
      } catch (err) {
        if (err.response?.status === 401) {
          this.errors.currentPassword = 'Current password is incorrect';
          this.toast.error('Incorrect Password', 'Please check your current password');
        } else {
          this.toast.error('Change Failed', err.response?.data?.message || 'Failed to change password');
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
