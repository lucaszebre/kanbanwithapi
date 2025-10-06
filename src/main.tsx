import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import "../i18n";
import i18n from "../i18n";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import "./index.css";
import { HomeLayout } from "./pages/home/layout.tsx";

const routes: RouteObject[] = [
  {
    path: "/auth",
    lazy: () =>
      import("./pages/auth/page.tsx").then((module) => ({
        Component: module.AuthPage,
      })),
    index: true,
  },
  {
    path: "/auth/complete",
    lazy: () =>
      import("./pages/auth/complete/page.tsx").then((module) => ({
        Component: module.AuthCompletePage,
      })),
    index: true,
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        index: true,
        lazy: () =>
          import("./pages/home/page.tsx").then((module) => ({
            Component: module.Home,
          })),
      },
      {
        path: "/boards/:boardId",
        index: true,
        lazy: () =>
          import("./pages/home/page.tsx").then((module) => ({
            Component: module.Home,
          })),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <SidebarProvider className="relative">
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </SidebarProvider>
    </I18nextProvider>
  </StrictMode>
);
