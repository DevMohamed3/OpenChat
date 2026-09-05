// (site) shell — light: theme only.
// No auth, no realtime/socket, no LiveKit, no react-query, no toaster — keeps public routes fully static.
import { AppThemeProvider } from '../providers/theme-provider'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <AppThemeProvider>{children}</AppThemeProvider>
}