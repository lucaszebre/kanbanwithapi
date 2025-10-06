import { Board } from "@/components/board/board";
import ErrorBoundary from "@/components/common/errorPage"; // Import your ErrorBoundary component
import { Icons } from "@/components/common/icons";
import { useUserSession } from "@/hooks/useUserSession";

export const Home = () => {
  const { user } = useUserSession({ redirectTo: "/auth" });

  if (user) {
    return (
      <ErrorBoundary>
        <Board />
      </ErrorBoundary>
    );
  }

  return (
    <div className=" flex-col flex justify-center items-center h-screen w-full ">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  );
};
