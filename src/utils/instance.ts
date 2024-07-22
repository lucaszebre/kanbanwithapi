

import axios from "axios";
import Cookies from "js-cookie"; // Assuming you use js-cookie



let token = ""; // Initialize token as an empty string

if (typeof window !== "undefined") {
  // Check if localStorage is available (client-side)
  token = Cookies.get("key") || "";
}


export const axiosInstance = axios.create({
  baseURL: 'https://kanbanapi-4d88529b1e71.herokuapp.com/', // Replace with your API's base URL
  headers: {
    common: {
      Authorization: `Bearer ${token}`,
    },
  },
});


