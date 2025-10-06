import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { axiosInstance } from "./common/instance";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    if (response && response.data && response.data.accessToken) {
      console.log(response.data);
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);
      // Authentication successful

      return response.data;
    } else {
      // Authentication failed
      console.error("auth failed");
      return null;
    }
  } catch (error) {
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

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/api/refresh-token");

    if (response && response.data && response.data.accessToken) {
      Cookies.set("accessToken", response.data.accessToken);

      return response.data;
    } else {
      // Authentication failed
      console.error("auth failed");
      return null;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Authentication failed
      toast.error("Invalid refresh token");
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
    const response = await axiosInstance.post("/register", {
      email,
      password,
      name,
    });

    if (response && response.data && response.data.accessToken) {
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
    await axiosInstance.post("/api/logout");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  } catch (error) {
    console.error(error);
  }
};

export const authApiServices = {
  login,
  register,
  logout,
  refreshToken,
};
