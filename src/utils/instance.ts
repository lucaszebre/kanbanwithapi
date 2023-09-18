import axios from "axios";

let token = ""; // Initialize token as an empty string

if (typeof window !== "undefined") {
  // Check if localStorage is available (client-side)
  token = localStorage.getItem("key") || "";
}

export const axiosInstance = axios.create({
  baseURL: 'https://kanbantaskapi.onrender.com', // Replace with your API's base URL
  headers: {
    common: {
      Authorization: `Bearer ${token}`,
    },
  },
});
