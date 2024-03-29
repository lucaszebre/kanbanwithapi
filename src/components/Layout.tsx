// components/Layout.tsx
import {  useEffect, ReactNode } from "react";
import { useTheme } from '@/state/themecontext';
import React from 'react'

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme} = useTheme();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lightBg = "#E4EBFA";
            const darkBg = "#20212C";
            document.body.style.background = theme === "light" ? lightBg : darkBg;
        }
    }, [theme]);

    return <div>{children}</div>;
};

export default Layout;