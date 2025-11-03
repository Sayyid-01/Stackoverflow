import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // ✅ client-safe env
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        const token = JSON.parse(user)?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config; // ✅ must return config
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
