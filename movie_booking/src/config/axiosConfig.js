import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "./baseUrl";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    // Show a toast notification for other API errors
    if (error.response && error.response.status !== 401) {
      const message = error.response.data?.message || "Something went wrong";
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } else if (!error.response) {
      // Network error or server is down
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Network error. Please try again later.",
        showConfirmButton: false,
        timer: 3000,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
