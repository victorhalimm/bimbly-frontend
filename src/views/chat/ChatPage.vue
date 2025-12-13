<template>
  <div class="h-screen bg-white">
    <div class="h-full flex">
          <div
            :class="[
              'border-r border-gray-200 flex-shrink-0 transition-all',
              showMobileChat ? 'hidden lg:block lg:w-1/4' : 'w-full lg:w-1/4',
            ]"
          >
            <ConversationList
              :conversations="sortedConversations"
              :active-conversation-id="activeConversationId"
              :loading="loading"
              @select="handleSelectConversation"
              @back="handleGoBack"
            />
          </div>

          <div
            :class="[
              'lg:w-3/4 min-w-0',
              showMobileChat ? 'block w-full' : 'hidden lg:block',
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'pinia';
import { useChatStore } from '../../stores/chat.store';
import { useAuthStore } from '../../stores/auth.store';
import ConversationList from '../../components/chat/ConversationList.vue';
import ChatWindow from '../../components/chat/ChatWindow.vue';

export default defineComponent({
  name: 'ChatPage',
  components: {
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
    handleGoBack() {
      this.$router.back();
    },
  },
});
</script>
