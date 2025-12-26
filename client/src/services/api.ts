import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { AuthUser, LoginResponse } from "@/types/auth";

export const BASE_URL = import.meta.env.VITE_API_URL || "/api";

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const authClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

type PendingRequest = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const processQueue = (error?: unknown) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  pendingRequests = [];
};

export const storeToken = (accessToken: string) => {
  localStorage.setItem("authToken", accessToken);
};

export const clearAuth = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authRole");
  localStorage.removeItem("authUser");
};

export const decodeJWT = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role?.toLowerCase() as "user" | "admin",
      picture: payload.picture,
    };
  } catch {
    return null;
  }
};

export const handleAuthSuccess = (token: string): AuthUser | null => {
  storeToken(token);
  const user = decodeJWT(token);
  if (user) {
    localStorage.setItem("authRole", user.role);
    localStorage.setItem("authUser", JSON.stringify(user));
  }
  return user;
};

export const getGoogleAuthUrl = () => `${BASE_URL}/auth/google`;

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: () => resolve(API(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await authClient.post<LoginResponse>("/auth/refresh");

        storeToken(data.data.accessToken);
        processQueue();

        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
