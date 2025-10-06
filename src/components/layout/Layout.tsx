import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lightBg = "#E4EBFA";
      const darkBg = "#20212C";
      document.body.style.background = theme === "light" ? lightBg : darkBg;
    }
  }, [theme]);

  return <div>{children}</div>;
};
