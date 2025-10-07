import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/navigation/sideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
const queryClient = new QueryClient();

export const HomeLayout = () => {
  return (
    // <RequireAuth>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider className="relative">
        <AppSidebar boards />
        <SidebarInset>
          <div className="min-w-full min-h-full">
            <div className="fixed right-0 top-0 w-full z-10">
              <Header />
            </div>
            <Outlet />
            <Toaster />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
};
