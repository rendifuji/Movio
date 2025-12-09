import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { LoginResponse } from "@/types/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "";

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

const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("authToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
};

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
      if (!localStorage.getItem("refreshToken")) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

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
        const { data } = await authClient.post<LoginResponse>("/auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        storeTokens(data.accessToken, data.refreshToken);
        processQueue();

        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearTokens();
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
