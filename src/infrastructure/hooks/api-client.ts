import axios from "axios";

export const apiHttpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiHttpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
