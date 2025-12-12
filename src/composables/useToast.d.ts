export interface Toast {
  success(title: string, message?: string, duration?: number): void;
  error(title: string, message?: string, duration?: number): void;
  warning(title: string, message?: string, duration?: number): void;
  info(title: string, message?: string, duration?: number): void;
}

export function useToast(): Toast;
