import { useAuth as useAuthCore } from '../store/authStore';

export function useAuth() {
  return useAuthCore();
}