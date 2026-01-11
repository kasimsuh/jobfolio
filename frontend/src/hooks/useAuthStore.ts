import { create } from 'zustand';
import { authAPI, setToken, removeToken } from '@/lib/api';
import type { User, LoginData, RegisterData } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (credentials: LoginData) => {
    console.log('[Auth Store] Login called with:', credentials);
    set({ isLoading: true, error: null });
    try {
      console.log('[Auth Store] Calling authAPI.login...');
      const user = await authAPI.login(credentials);
      console.log('[Auth Store] Login response:', user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('[Auth Store] Login error:', error);
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authAPI.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    console.log('[Auth Store] Logging out...');
    authAPI.logout();
    removeToken();
    set({ user: null, isAuthenticated: false, error: null });
    console.log('[Auth Store] Logged out, isAuthenticated set to false');
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.getMe();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If token is invalid or expired, clear it
      removeToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
