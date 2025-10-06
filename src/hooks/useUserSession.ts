import { authApiServices } from "@/api/auth.service";
import { axiosInstance } from "@/api/common/instance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CURRENT_USER_API = "/api/me";

type Props = {
  redirectTo?: string;
};

export const useUserSession = ({ redirectTo = "" }: Props) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const refreshAcces = async () => {
      try {
        await authApiServices.refreshToken();
      } catch (error) {
        console.error("no refresh token", error);
      }
    };
    const getSession = async () => {
      try {
        setIsLoading(true);
        const currentUser = (await axiosInstance(CURRENT_USER_API)).data;
        setUser(currentUser);
        setIsLoading(false);
      } catch {
        refreshAcces();
        setIsLoading(false);
        setIsError(true);

        if (redirectTo) {
          navigate(redirectTo);
        }
      }
    };
    getSession();
  }, [navigate, redirectTo]);

  return { user, isLoading, isError };
};
