import { authApiServices } from "@/api/auth.service";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const signin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authApiServices.login(email, password);
      if (data?.status === 200) {
        setIsLoading(false);
        navigate("/auth/complete");
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      toast.error(t("error:invalidCredentials"));
      console.error("could not authentificated", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { signin, isLoading, isError };
};
