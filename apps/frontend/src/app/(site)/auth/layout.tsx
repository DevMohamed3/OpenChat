// /auth only — Google OAuth provider (lazy, client-only)
'use client'
import dynamic from 'next/dynamic'

const GoogleOAuthProvider = dynamic(
  () => import('@react-oauth/google').then((m) => m.GoogleOAuthProvider),
  { ssr: false }
)

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  )
}