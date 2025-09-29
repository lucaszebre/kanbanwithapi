import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { axiosInstance } from "../common/instance";

// Auth route constants
const AUTH_ROUTE = "api/auth";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    if (response && response.data && response.data.token) {
      Cookies.set("key", response.data.token);
      // Authentication successful
      window.location.reload();

      return response.data;
    } else {
      // Authentication failed
      console.error("auth failed");
      return null;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Authentication failed
      toast.error("Invalid credentials. Please try again.");
    } else {
      // Other error occurred
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again later.");
    }
    return null;
  }
};

const register = async (email: string, password: string, name: string) => {
  try {
    const response = await axiosInstance.post("/api/register", {
      email,
      password,
      name,
    });

    if (response && response.data && response.data.token) {
      // Authentication successful
      return response.data;
    } else {
      // Authentication failed
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const logout = async () => {
  try {
    Cookies.remove("key");
  } catch (error) {
    console.error(error);
  }
};

export const authApiServices = {
  login,
  register,
  logout,
};
