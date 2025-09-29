import Cookies from "js-cookie";
import React, { SetStateAction } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../common/instance";

export const login = async (
  email: string,
  password: string,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true); // Set loading to true when starting to try to login

    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    if (response && response.data && response.data.token) {
      Cookies.set("key", response.data.token);
      // Authentication successful
      window.location.reload();

      setIsLoading(false); // Reset loading when login is successful
      return response.data;
    } else {
      // Authentication failed
      console.error("auth failed");
      setIsLoading(false); // Reset loading when login fails
      return null;
    }
  } catch (error: any) {
    if (error.response!.status === 401) {
      toast.error("Wrong Credentials");
    }

    console.error(error);
    setIsLoading(false); // Ensure loading is reset even on error
    return null;
  }
};
