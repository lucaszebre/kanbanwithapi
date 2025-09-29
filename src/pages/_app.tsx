// _app.tsx
import { DataProvider } from "@/state/datacontext";
import { ThemeProvidered } from "@/state/themecontext";
import "@/styles/globals.css";
import { GlobalScrollbarStyle } from "@/utils/Scrollbar";
import { lightTheme } from "@/utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvidered>
        <ThemeProvider theme={lightTheme}>
          <DataProvider>
            <GlobalScrollbarStyle />
            <Component {...pageProps} />
            <Toaster />
          </DataProvider>
        </ThemeProvider>
      </ThemeProvidered>
    </QueryClientProvider>
  );
}

export default App;
