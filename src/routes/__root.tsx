import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { RouterSpinner } from '@/components/spinner'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import TranslateButton from '@/components/TranslateButton'


export const Route = createRootRoute({
  component: () => (
    <>
     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterSpinner />
      <Navbar />
      <Outlet />
      <Footer />
      <TanStackRouterDevtools position="bottom-right" />
      <Toaster richColors position="top-right" />
      <TranslateButton />
     </ThemeProvider>
    </>
  ),
})
