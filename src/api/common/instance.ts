import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:5000/",
  withCredentials: true,
});
