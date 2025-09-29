import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { authApiServices } from "../auth/auth.service";

interface RegisterData {
  email: string;
  password: string;
  fullname: string;
}

const register = async ({ email, password, fullname }: RegisterData) => {
  try {
    const response = await authApiServices.register(email, password, fullname);
    if (response) {
      return response;
    } else {
      throw new AxiosError("Registration failed");
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      toast.error("email already in use");
    }
    console.error(error);
    throw error;
  }
};

export const useRegister = () => {
  return useMutation<any, Error, RegisterData>(register);
};
