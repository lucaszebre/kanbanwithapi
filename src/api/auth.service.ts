import Cookies from "js-cookie";
import { axiosInstance } from "./common/instance";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    if (response && response.data && response.data.accessToken) {
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);
      // Authentication successful
    }

    if (response.status === 401) {
      throw Error("Invalid credentials. Please try again.");
    }
    // Authentication failed
    return response;
  } catch (error) {
    console.error(error);
    throw Error("An error occurred. Please try again later.");
  }
};

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/api/refresh-token");

    if (response && response.data && response.data.accessToken) {
      Cookies.set("accessToken", response.data.accessToken);

      return response.data;
    }

    if (response.status === 401) {
      throw Error("Invalid refresh token");
    }
    return null;
  } catch (error) {
    console.error("An error occurred:", error);
    throw Error("An error occurred. Please try again later.");
  }
};

const register = async (email: string, password: string, name: string) => {
  try {
    const response = await axiosInstance.post("/register", {
      email,
      password,
      name,
    });

    return response;
  } catch {
    throw Error("An error occurred. Please try again later.");
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
