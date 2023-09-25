// _app.tsx
import '@/styles/globals.css'
import 'tailwindcss/tailwind.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { GlobalScrollbarStyle } from '@/utils/Scrollbar'
import { DataProvider } from '@/state/datacontext'
import { ThemeProvidered } from '@/state/themecontext'
import Layout from '@/components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '@/utils/theme';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

function App({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvidered>
    <ThemeProvider theme={ lightTheme}>
      <DataProvider>
            <ChakraProvider>
              <GlobalScrollbarStyle />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
      </DataProvider>
    </ThemeProvider>
    </ThemeProvidered>
    </QueryClientProvider>
  )
}

export default App
