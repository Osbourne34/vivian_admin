import { ReactElement, ReactNode, useState } from 'react'

import { NextPage } from 'next'
import Head from 'next/head'
import { AppProps } from 'next/app'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'

import { theme, createEmotionCache } from '@/shared/theme'

const clientSideEmotionCache = createEmotionCache()

import '@/shared/styles/globals.css'
import { SnackbarProvider } from 'notistack'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfirmDialogProvider } from '@/shared/ui/confirm-dialog/context/confirm-dialog-provider'
import { ModalProvider } from '@/shared/ui/modal/context/modal-rovider'

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type MyAppProps = {
  emotionCache?: EmotionCache
}

type AppPropsWithLayout = AppProps &
  MyAppProps & {
    Component: NextPageWithLayout
  }

export default function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const getLayout = Component.getLayout ?? ((page) => page)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          autoHideDuration={3000}
        >
          <QueryClientProvider client={queryClient}>
            <ConfirmDialogProvider>
              <ModalProvider>
                {getLayout(<Component {...pageProps} />)}
              </ModalProvider>
            </ConfirmDialogProvider>
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
