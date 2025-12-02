<template>
  <transition name="toast">
    <div
      v-if="show"
      class="fixed top-6 right-6 z-50 max-w-md"
      @click="close"
    >
      <div
        :class="[
          'flex items-start gap-4 p-5 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-300',
          typeClasses
        ]"
      >
        <div class="flex-shrink-0">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', iconBgClass]">
            <svg v-if="type === 'success'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else-if="type === 'error'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else-if="type === 'warning'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <p :class="['font-black text-base mb-1', titleColorClass]">{{ title }}</p>
          <p v-if="message" :class="['text-sm font-medium', messageColorClass]">{{ message }}</p>
        </div>

        <button
          @click.stop="close"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      show: false,
      timer: null,
    };
  },
  computed: {
    typeClasses() {
      const classes = {
        success: 'bg-green-50 border-2 border-green-200',
        error: 'bg-red-50 border-2 border-red-200',
        warning: 'bg-yellow-50 border-2 border-yellow-200',
        info: 'bg-blue-50 border-2 border-blue-200',
      };
      return classes[this.type];
    },
    iconBgClass() {
      const classes = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
      };
      return classes[this.type];
    },
    titleColorClass() {
      const classes = {
        success: 'text-green-900',
        error: 'text-red-900',
        warning: 'text-yellow-900',
        info: 'text-blue-900',
      };
      return classes[this.type];
    },
    messageColorClass() {
      const classes = {
        success: 'text-green-700',
        error: 'text-red-700',
        warning: 'text-yellow-700',
        info: 'text-blue-700',
      };
      return classes[this.type];
    },
  },
  mounted() {
    this.show = true;
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    close() {
      this.show = false;
      setTimeout(() => {
        this.$emit('close');
      }, 300);
    },
  },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
</style>
