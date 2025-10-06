import { authApiServices } from "@/api/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const signin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authApiServices.login(email, password);
      setIsLoading(false);
      navigate("/auth/complete");
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error("could authentificated", error);
    }
  };

  return { signin, isLoading, isError };
};
