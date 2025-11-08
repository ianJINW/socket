import apiClient from './client';
import { useAuthStore } from '../stores/authStore';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', data);
    const result = response.data.data;
    useAuthStore.getState().setAuth(result.user, result.accessToken, result.refreshToken);
    return result;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    useAuthStore.getState().clearAuth();
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', {
      refreshToken,
    });
    const result = response.data.data;
    useAuthStore.getState().updateTokens(result.accessToken, result.refreshToken);
    return result;
  },
};


