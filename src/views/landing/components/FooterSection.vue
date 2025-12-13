<template>
  <footer class="relative bg-gradient-to-b from-transparent via-blue-50 to-blue-100 overflow-hidden pt-32 pb-12" :class="footerMeta.show ? '' : 'hidden'">
    <div class="absolute w-full h-full top-0" :style="{ backgroundColor: footerMeta.backgroundColor }"></div>

    <div class="absolute top-1/4 left-20 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
    <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-500"></div>
    <div class="absolute bottom-1/3 right-32 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>
    <div class="absolute top-1/2 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-float animation-delay-1500"></div>

    <div class="absolute top-32 left-1/4 w-32 h-32 opacity-20 animate-pulse-slow" style="background: radial-gradient(circle, #3b82f6 0%, transparent 70%); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;"></div>
    <div class="absolute bottom-32 right-1/3 w-24 h-24 opacity-15 animate-pulse-slow animation-delay-1000" style="background: radial-gradient(circle, #eab308 0%, transparent 70%); border-radius: 30% 70% 70% 30% / 30% 60% 40% 70%;"></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <div class="bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-xl p-10 lg:p-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div class="lg:col-span-4 flex flex-col justify-between">
            <div>
              <img :src="logo" class="w-52"/>
            </div>
            <div class="mt-8 lg:mt-0">
              <p class="text-sm font-medium text-gray-500">
                © 2025 Bimbly. All rights reserved.
              </p>
            </div>
          </div>

          <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-black text-gray-900 mb-4">Learn</h3>
              <ul class="space-y-3">
                <li>
                  <a href="#courses" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    All courses
                  </a>
                </li>
                <li>
                  <a href="#tutors" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Browse Tutors
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    How it works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-black text-gray-900 mb-4">Company</h3>
              <ul class="space-y-3">
                <li>
                  <a href="#about" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#careers" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-black text-gray-900 mb-4">Support</h3>
              <ul class="space-y-3">
                <li>
                  <a href="#help" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#terms" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Terms of use
                  </a>
                </li>
                <li>
                  <a href="#privacy" class="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Privacy policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t-2 border-gray-200 flex justify-end">
          <div class="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-md"
              aria-label="Facebook"
            >
              <IconBrandFacebook :size="22" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-500 hover:text-white transition-all hover:scale-110 shadow-md"
              aria-label="Twitter"
            >
              <IconBrandTwitter :size="22" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all hover:scale-110 shadow-md"
              aria-label="Instagram"
            >
              <IconBrandInstagram :size="22" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all hover:scale-110 shadow-md"
              aria-label="YouTube"
            >
              <IconBrandYoutube :size="22" />
            </a>
            <button
              class="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:scale-110 shadow-lg ml-2"
              aria-label="Chat with us"
            >
              <IconMessageCircle :size="22" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import logo from '@/assets/images/logo/logo-text.png'
import { defineComponent } from 'vue';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
  IconMessageCircle
} from '@tabler/icons-vue';

export default defineComponent({
  name: 'FooterSection',
  components: {
    IconBrandFacebook,
    IconBrandTwitter,
    IconBrandInstagram,
    IconBrandYoutube,
    IconMessageCircle,
  },
  data() {
    return {
      logo
    }
  },
  computed: {
    footerMeta(): { backgroundColor: string, show: boolean } {
      const meta = this.$route.meta as { footer?: { backgroundColor?: string, show?: boolean } };
      console.log(meta?.footer?.backgroundColor)
      return {
        backgroundColor: meta?.footer?.backgroundColor ?? '#ffffff',
        show: meta?.footer?.show ?? true
      };
    }
  }
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.05);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.95);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.02);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
