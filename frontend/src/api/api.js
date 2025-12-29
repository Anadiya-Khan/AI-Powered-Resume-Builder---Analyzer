import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api" ,
  withCredentials: true,   // needed for refresh token cookie
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Save new access token when backend refreshes it
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-access-token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
