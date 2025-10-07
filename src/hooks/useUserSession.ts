import { authApiServices } from "@/api/auth.service";
import { axiosInstance } from "@/api/common/instance";
import { useCallback, useEffect, useState } from "react";
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

  const getSession = useCallback(async () => {
    try {
      const currentUser = (await axiosInstance.get(CURRENT_USER_API)).data;
      setUser(currentUser);
      setIsError(false);
    } catch (error) {
      console.error("Failed to get session:", error);
      throw error; // Re-throw error to be caught by the caller
    }
  }, []);

  useEffect(() => {
    const fetchUserSession = async () => {
      setIsLoading(true);
      try {
        await getSession();
      } catch {
        try {
          // First attempt failed, try to refresh the token
          await authApiServices.refreshToken();
          // If refresh succeeds, try getting the session again
          await getSession();
        } catch (refreshError) {
          // If refreshing or the second getSession fails
          console.error(
            "Failed to refresh token or get session after refresh:",
            refreshError
          );
          setIsError(true);
          setUser(null);
          if (redirectTo) {
            navigate(redirectTo);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSession();
  }, [navigate, redirectTo, getSession]);
  return { user, isLoading, isError };
};
