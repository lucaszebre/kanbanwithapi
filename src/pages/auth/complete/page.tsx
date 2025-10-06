import { Icons } from "@/components/common/icons";
import { useUserSession } from "@/hooks/useUserSession";
import { useNavigate } from "react-router";

export const AuthCompletePage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUserSession({ redirectTo: "" });

  if (user && !isLoading) {
    navigate("/");
  }

  return (
    <>
      <title>Kanban - Authentication Complete</title>
      <meta
        name="description"
        content="Your authentication is complete. Redirecting you to your dashboard."
      />
      <div className=" flex-col flex justify-center items-center h-screen w-full ">
        <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
      </div>
    </>
  );
};
