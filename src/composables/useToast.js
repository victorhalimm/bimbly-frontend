import { createApp, h } from 'vue';
import Toast from '@/components/common/Toast.vue';

let toastContainer = null;
let toastInstance = null;

export function useToast() {
  const show = (options) => {
    if (toastInstance) {
      toastInstance.unmount();
    }

    if (!toastContainer) {
      toastContainer = document.createElement('div');
      document.body.appendChild(toastContainer);
    }

    toastInstance = createApp({
      render() {
        return h(Toast, {
          ...options,
          onClose: () => {
            if (toastInstance) {
              toastInstance.unmount();
              toastInstance = null;
            }
          },
        });
      },
    });

    toastInstance.mount(toastContainer);
  };

  return {
    success: (title, message = '', duration = 3000) => {
      show({ type: 'success', title, message, duration });
    },
    error: (title, message = '', duration = 3000) => {
      show({ type: 'error', title, message, duration });
    },
    warning: (title, message = '', duration = 3000) => {
      show({ type: 'warning', title, message, duration });
    },
    info: (title, message = '', duration = 3000) => {
      show({ type: 'info', title, message, duration });
    },
  };
}
