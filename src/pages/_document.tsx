import { ThemeProvider } from "@/components/layout/theme-provider";
import { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Document() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Html lang="en">
        <Head />
        <body style={{ background: "white" }}>
          <Main />
          <Toaster />
          <NextScript />
        </body>
      </Html>
    </ThemeProvider>
  );
}
