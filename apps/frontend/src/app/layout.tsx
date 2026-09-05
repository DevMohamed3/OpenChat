// root layout (server) — slim shell only; app/landing specifics live in nested layouts
import '../globals.css'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: {
    default: 'ZeroZone — Open Source Real-Time Chat & Voice',
    template: '%s | ZeroZone',
  },
  description:
    'ZeroZone is a self-hosted, open-source platform for real-time chat, voice calls, and community building. Privacy-first, no ads, no tracking.',
  keywords: ['chat', 'voice calls', 'open source', 'self-hosted', 'real-time', 'community', 'privacy'],
  openGraph: {
    title: 'ZeroZone — Open Source Real-Time Chat & Voice',
    description:
      'Self-hosted, open-source platform for real-time chat, voice calls, and community building. Privacy-first with no ads or tracking.',
    type: 'website',
    siteName: 'ZeroZone',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroZone — Open Source Real-Time Chat & Voice',
    description:
      'Self-hosted, open-source platform for real-time chat, voice calls, and community building. Privacy-first with no ads or tracking.',
  },
  icons: {
    icon: '/icon.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-main antialiased">
        <link
          rel="preload"
          href="/fonts/sesame-serif.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  )
}
