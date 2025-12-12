<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <Header v-if="headerUser" :user="headerUser" @logout="handleLogout" />
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div
        class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden"
        style="height: calc(100vh - 160px)"
      >
        <div class="flex h-full">
          <div
            :class="[
              'border-r border-gray-200 flex-shrink-0 transition-all',
              showMobileChat ? 'hidden lg:block' : 'w-full lg:w-80',
            ]"
            class="lg:w-80"
          >
            <ConversationList
              :conversations="sortedConversations"
              :active-conversation-id="activeConversationId"
              :loading="loading"
              @select="handleSelectConversation"
              @new-chat="handleNewChat"
            />
          </div>

          <div
            :class="[
              'flex-1 min-w-0',
              showMobileChat ? 'block' : 'hidden lg:block',
            ]"
          >
            <ChatWindow
              :conversation="activeConversation"
              :messages="activeMessages"
              :current-user-id="currentUserId"
              :connected="connected"
              :loading-messages="loadingMessages"
              @send="handleSendMessage"
              @load-more="handleLoadMore"
              @back="handleBack"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'pinia';
import { useChatStore } from '../../stores/chat.store';
import { useAuthStore } from '../../stores/auth.store';
import Header from '../../components/common/layout/Header.vue';
import ConversationList from '../../components/chat/ConversationList.vue';
import ChatWindow from '../../components/chat/ChatWindow.vue';

export default defineComponent({
  name: 'ChatPage',
  components: {
    Header,
    ConversationList,
    ChatWindow,
  },
  data() {
    return {
      showMobileChat: false,
      currentPage: 1,
    };
  },
  computed: {
    ...mapState(useChatStore, [
      'connected',
      'activeConversationId',
      'loading',
      'loadingMessages',
    ]),
    ...mapGetters(useChatStore, [
      'activeConversation',
      'activeMessages',
      'sortedConversations',
    ]),
    currentUserId(): string {
      const authStore = useAuthStore();
      return authStore.user?.id || '';
    },
    headerUser() {
      const authStore = useAuthStore();
      if (!authStore.user) return null;
      return {
        name: authStore.user.fullName,
        email: authStore.user.email,
        avatar: authStore.user.profileImageUrl,
        role: authStore.user.userType as 'student' | 'tutor' | 'admin',
      };
    },
  },
  async mounted() {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      this.$router.push('/login');
      return;
    }

    await this.initializeChat();

    const conversationId = this.$route.query.conversation as string;
    if (conversationId) {
      this.handleSelectConversation(conversationId);
    }
  },
  beforeUnmount() {
    this.disconnect();
  },
  methods: {
    ...mapActions(useChatStore, [
      'connect',
      'disconnect',
      'loadConversations',
      'loadMessages',
      'joinConversation',
      'leaveConversation',
      'sendMessage',
      'createConversation',
    ]),
    async initializeChat() {
      this.connect();
      await this.loadConversations();
    },
    async handleSelectConversation(conversationId: string) {
      this.showMobileChat = true;
      this.currentPage = 1;
      this.joinConversation(conversationId);
      await this.loadMessages(conversationId, 1);
    },
    handleSendMessage(text: string) {
      this.sendMessage(text);
    },
    async handleLoadMore() {
      if (this.activeConversationId && !this.loadingMessages) {
        this.currentPage++;
        await this.loadMessages(this.activeConversationId, this.currentPage);
      }
    },
    handleBack() {
      this.showMobileChat = false;
      this.leaveConversation();
    },
    async handleLogout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/login');
    },
    async handleNewChat() {
      const participantId = prompt('Enter user ID to chat with:');
      if (!participantId) return;

      try {
        const conversation = await this.createConversation(participantId);
        this.handleSelectConversation(conversation.id);
      } catch (error) {
        alert('Failed to create conversation. Check the user ID.');
      }
    },
  },
});
</script>
