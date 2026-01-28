import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getTokenFromCookies, removeTokenFromCookies } from "../utils/tokenHelper";

const BASE_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:8080";

export const client = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor: Automatically attach token from cookies
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Handle FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Automatically attach token from cookies if not already set
    if (!config.headers.Authorization) {
      const token = getTokenFromCookies();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 and 500 errors globally
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (status === 401) {
      // Clear token from cookies
      removeTokenFromCookies();
      
      // Clear authorization header
      delete client.defaults.headers.Authorization;
      
      // Only redirect if not already on auth page and not retrying
      if (!originalRequest._retry && !window.location.pathname.includes("/auth")) {
        // Store the original URL to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = "/auth";
      }
    }

    // Handle 500 Internal Server Error
    if (status === 500) {
      console.error("Server error:", error.response?.data);
      // Error will be handled by the component's error handler
    }

    return Promise.reject(error);
  }
);
