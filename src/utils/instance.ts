import axios from "axios";
import Cookies from "js-cookie"; // Assuming you use js-cookie



let token = ""; // Initialize token as an empty string

  // Check if localStorage is available (client-side)
  token = Cookies.get("key") || "";


export const axiosInstance = axios.create({
  baseURL: 'https://kanbantaskapi.onrender.com', // Replace with your API's base URL
  headers: {
    common: {
      Authorization: `Bearer ${token}`,
    },
  },
});