import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import {
  getTokenFromCookies,
  removeTokenFromCookies,
} from "../utils/tokenHelper";

const BASE_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:8080";

export const client = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Request Interceptor: Menjamin Token terbaru selalu terambil
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getTokenFromCookies();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Menangani error secara global
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Jika 401 (Expired/Invalid), langsung bersihkan dan tendang ke login
    if (status === 401) {
      removeTokenFromCookies();
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/auth";
      }
    }

    // Jika 500, log ke console untuk debugging backend
    if (status === 500) {
      console.error("🔥 Backend Meledak (500):", error.response?.data);
    }

    return Promise.reject(error);
  },
);
