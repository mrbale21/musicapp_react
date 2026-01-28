import axios from "axios";

const BASE_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:8080";

export const client = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});
