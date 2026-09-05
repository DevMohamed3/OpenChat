import { getCurrentUser } from '@/lib/getCurrentUser'
import { redirect } from 'next/navigation'
import ClientProviders from '../providers/ClientProviders'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <ClientProviders initialUser={user}>
      <div className="min-h-screen bg-sidebar text-foreground">
        {children}
      </div>
    </ClientProviders>
  )
}
