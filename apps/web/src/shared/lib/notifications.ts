import { toast } from 'vue-sonner';

export const notify = {
  success(message: string): void {
    toast.success(message);
  },
  error(message: string): void {
    toast.error(message);
  },
};
