import { Html, Head, Main, NextScript } from 'next/document'
import { ThemeProvider } from "@/components/theme-provider"
import React from 'react'
import { Toaster } from "@/components/ui/toaster"

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
      <body style={{background:'white'}}>
        <Main />
        <Toaster />
        <NextScript />
      </body>
    </Html>
    </ThemeProvider>
  )
}
