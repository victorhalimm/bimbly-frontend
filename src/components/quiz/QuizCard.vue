<template>
  <div
    class="quiz-card group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    @click="$emit('click')"
  >
    <div
      class="h-28 md:h-40 relative overflow-hidden"
      :class="subjectGradient"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <component
          :is="subjectIcon"
          :size="48"
          :stroke="1.5"
          class="text-white/90"
        />
      </div>
      <div class="absolute top-2 right-2 w-16 h-16 rounded-full opacity-20 bg-white/30"></div>
      <div class="absolute bottom-0 left-4 w-8 h-8 rounded-full opacity-15 bg-white/40"></div>
      <div class="absolute top-4 left-6 w-4 h-4 rounded-full opacity-25 bg-white/50 animate-float"></div>

      <div v-if="badge" class="absolute top-2 left-2">
        <span
          class="px-2 py-1 text-xs font-bold rounded-full"
          :class="badgeClass"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-base font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
        {{ title }}
      </h3>

      <div class="flex flex-wrap gap-1.5 mb-3">
        <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="subjectBadgeClass">
          {{ subject }}
        </span>
        <span v-if="questionCount" class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
          {{ questionCount }} Questions
        </span>
        <span v-if="totalPoints" class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          {{ totalPoints }} pts
        </span>
      </div>

      <div v-if="showStatus" class="mb-3">
        <span
          class="px-2 py-0.5 text-xs font-bold rounded-full"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>

      <div v-if="showMeta" class="flex items-center justify-between text-xs text-gray-400">
        <div v-if="date" class="flex items-center gap-1">
          <IconCalendar :size="14" stroke="2" />
          <span>{{ date }}</span>
        </div>
        <div v-if="score !== null && score !== undefined" class="flex items-center gap-1 text-green-600 font-semibold">
          <IconCheck :size="14" stroke="2" />
          <span>{{ score }}/{{ totalPoints }}</span>
        </div>
      </div>

      <div v-if="showActions" class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IconMath,
  IconAtom,
  IconFlask2,
  IconPlant,
  IconLanguage,
  IconLetterA,
  IconWorld,
  IconCoin,
  IconArticle,
  IconDeviceDesktop,
  IconFriends,
  IconBook,
  IconCalendar,
  IconCheck,
} from '@tabler/icons-vue';

const SUBJECT_CONFIG: Record<string, { icon: string; gradient: string; badgeClass: string }> = {
  Matematika: {
    icon: 'IconMath',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  Fisika: {
    icon: 'IconAtom',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  Kimia: {
    icon: 'IconFlask2',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    badgeClass: 'bg-pink-100 text-pink-700',
  },
  Biologi: {
    icon: 'IconPlant',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    badgeClass: 'bg-green-100 text-green-700',
  },
  'Bahasa Indonesia': {
    icon: 'IconLanguage',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700',
  },
  'Bahasa Inggris': {
    icon: 'IconLetterA',
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  IPA: {
    icon: 'IconAtom',
    gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    badgeClass: 'bg-cyan-100 text-cyan-700',
  },
  IPS: {
    icon: 'IconWorld',
    gradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  Ekonomi: {
    icon: 'IconCoin',
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
  Geografi: {
    icon: 'IconWorld',
    gradient: 'bg-gradient-to-br from-teal-500 to-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700',
  },
  Sejarah: {
    icon: 'IconArticle',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  PKN: {
    icon: 'IconFriends',
    gradient: 'bg-gradient-to-br from-rose-500 to-rose-600',
    badgeClass: 'bg-rose-100 text-rose-700',
  },
  Informatika: {
    icon: 'IconDeviceDesktop',
    gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  default: {
    icon: 'IconBook',
    gradient: 'bg-gradient-to-br from-gray-500 to-gray-600',
    badgeClass: 'bg-gray-100 text-gray-700',
  },
};

export default defineComponent({
  name: 'QuizCard',
  components: {
    IconMath,
    IconAtom,
    IconFlask2,
    IconPlant,
    IconLanguage,
    IconLetterA,
    IconWorld,
    IconCoin,
    IconArticle,
    IconDeviceDesktop,
    IconFriends,
    IconBook,
    IconCalendar,
    IconCheck,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: true,
    },
    questionCount: {
      type: Number,
      default: null,
    },
    totalPoints: {
      type: Number,
      default: null,
    },
    status: {
      type: String as () => 'assigned' | 'in_progress' | 'submitted' | 'graded' | null,
      default: null,
    },
    date: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: null,
    },
    badge: {
      type: String,
      default: '',
    },
    badgeVariant: {
      type: String as () => 'primary' | 'success' | 'warning' | 'danger',
      default: 'primary',
    },
    showStatus: {
      type: Boolean,
      default: false,
    },
    showMeta: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    subjectConfig(): { icon: string; gradient: string; badgeClass: string } {
      return SUBJECT_CONFIG[this.subject] || SUBJECT_CONFIG.default;
    },
    subjectIcon(): string {
      return this.subjectConfig.icon;
    },
    subjectGradient(): string {
      return this.subjectConfig.gradient;
    },
    subjectBadgeClass(): string {
      return this.subjectConfig.badgeClass;
    },
    statusText(): string {
      const statusMap: Record<string, string> = {
        assigned: 'Not Started',
        in_progress: 'In Progress',
        submitted: 'Submitted',
        graded: 'Graded',
      };
      return statusMap[this.status || ''] || '';
    },
    statusClass(): string {
      const classMap: Record<string, string> = {
        assigned: 'bg-gray-200 text-gray-700',
        in_progress: 'bg-yellow-100 text-yellow-700',
        submitted: 'bg-blue-100 text-blue-700',
        graded: 'bg-green-100 text-green-700',
      };
      return classMap[this.status || ''] || '';
    },
    badgeClass(): string {
      const classMap: Record<string, string> = {
        primary: 'bg-blue-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        danger: 'bg-red-500 text-white',
      };
      return classMap[this.badgeVariant];
    },
  },
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
