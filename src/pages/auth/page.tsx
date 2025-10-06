import { Auth } from "@/components/auth/auth";
import ErrorBoundary from "@/components/common/errorPage"; // Import your ErrorBoundary component
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export const AuthPage = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Auth />
        </ErrorBoundary>
      </QueryClientProvider>
    </>
  );
};
