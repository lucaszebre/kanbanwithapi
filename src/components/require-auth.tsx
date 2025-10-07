import { useUserSession } from "@/hooks/useUserSession";
import React from "react";
import { Navigate, useLocation } from "react-router";
import { Icons } from "./common/icons";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const pathname = useLocation().pathname;

  const { user, isLoading } = useUserSession({ redirectTo: "/auth" });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  return user ? (
    children
  ) : (
    <Navigate to="/auth" replace state={{ path: pathname }} />
  );
};
