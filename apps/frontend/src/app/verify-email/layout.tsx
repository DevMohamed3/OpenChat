import { AppQueryProvider } from '@/lib/query/provider'

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppQueryProvider>{children}</AppQueryProvider>
}