<template>
  <admin-layout page-title="User Management">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="w-12 h-12 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-sm font-medium text-gray-600">Loading users...</p>
      </div>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
            />
          </div>
          <select
            v-model="filterType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      user.userType === 'student' ? 'bg-green-100' :
                      user.userType === 'tutor' ? 'bg-purple-100' :
                      'bg-blue-100'
                    ]"
                  >
                    <span
                      :class="[
                        'text-sm font-semibold',
                        user.userType === 'student' ? 'text-green-700' :
                        user.userType === 'tutor' ? 'text-purple-700' :
                        'text-blue-700'
                      ]"
                    >
                      {{ getInitials(user.fullName) }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ user.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': user.userType === 'student',
                    'bg-purple-100 text-purple-800': user.userType === 'tutor',
                    'bg-blue-100 text-blue-800': user.userType === 'admin'
                  }"
                >
                  {{ user.userType }}
                </span>
              </td>
              <td class="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">{{ user.phoneNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded text-xs font-medium"
                  :class="user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                >
                  {{ user.isBlocked ? 'Blocked' : 'Active' }}
                </span>
              </td>
              <td class="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  v-if="!user.isBlocked"
                  @click="openBlockModal(user)"
                  class="hover: cursor-pointer px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  Block
                </button>
                <button
                  v-else
                  @click="handleUnblockUser(user)"
                  class="hover: cursor-pointer px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                >
                  Unblock
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <p class="mt-2 text-sm font-medium text-gray-900">No users found</p>
                <p class="text-sm text-gray-500">Try adjusting your search or filter.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <confirmation-modal
      :visible="showBlockModal"
      title="Block User"
      description="You are about to block"
      :target-name="selectedUser?.fullName"
      prompt-text="Please provide a reason for blocking this user."
      input-label="Block Reason"
      placeholder="Enter reason for blocking..."
      confirm-text="Confirm Block"
      processing-text="Blocking..."
      :is-processing="blockingUser"
      @confirm="handleBlockUserConfirm"
      @cancel="closeBlockModal"
    />
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAdminStore, type User } from '@/stores/admin.store';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
  name: 'UserManagement',
  components: {
    AdminLayout,
    ConfirmationModal,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      searchQuery: '',
      filterType: '',
      filterStatus: '',
      showBlockModal: false,
      selectedUser: null as User | null,
      blockingUser: false,
    };
  },
  computed: {
    adminStore() {
      return useAdminStore();
    },
    loading() {
      return this.adminStore.loadingUsers;
    },
    users() {
      return this.adminStore.users;
    },
    filteredUsers(): User[] {
      let filtered = this.users;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.fullName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      if (this.filterType) {
        filtered = filtered.filter((user) => user.userType === this.filterType);
      }

      if (this.filterStatus) {
        if (this.filterStatus === 'active') {
          filtered = filtered.filter((user) => !user.isBlocked);
        } else if (this.filterStatus === 'blocked') {
          filtered = filtered.filter((user) => user.isBlocked);
        }
      }

      return filtered;
    },
  },
  async mounted() {
    await this.adminStore.fetchUsers();
  },
  methods: {
    getInitials(name: string) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    formatDate(date: string) {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    },
    openBlockModal(user: User) {
      this.selectedUser = user;
      this.showBlockModal = true;
    },
    closeBlockModal() {
      this.showBlockModal = false;
      this.selectedUser = null;
      this.blockingUser = false;
    },
    async handleBlockUserConfirm(reason: string) {
      if (!this.selectedUser) return;

      try {
        this.blockingUser = true;
        await this.adminStore.blockUser(this.selectedUser.id, reason);
        this.toast.success('User Blocked', `${this.selectedUser.fullName} has been blocked successfully`);
        this.closeBlockModal();
      } catch (error) {
        this.toast.error('Block Failed', 'Failed to block user. Please try again.');
        this.blockingUser = false;
      }
    },
    async handleUnblockUser(user: User) {
      try {
        await this.adminStore.unblockUser(user.id);
        this.toast.success('User Unblocked', `${user.fullName} has been unblocked successfully`);
      } catch (error) {
        this.toast.error('Unblock Failed', 'Failed to unblock user. Please try again.');
      }
    },
  },
});
</script>
