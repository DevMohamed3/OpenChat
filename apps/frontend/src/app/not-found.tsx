"use client"

import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "packages/ui"
import Navbar from "packages/ui/ui/Navbar"
import Footer from "./(landing)/Footer"
import { useUserStore } from "./stores/user-store"

export default function NotFound() {
  const user = useUserStore(s => s.user)
  const router = useRouter()

  // history.back() is a silent no-op when the 404 was opened directly
  // (no in-app history), so fall back to navigating home instead.
  const goBack = () => {
    const hasInAppHistory =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin) &&
      window.history.length > 1

    if (hasInAppHistory) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-7xl md:text-8xl font-normal tracking-tight text-white mb-6">
            Page not found.
          </h1>
          <p className="text-zinc-400 text-base max-w-md mx-auto mb-12 leading-relaxed">
            The resource you are looking for has been moved, deleted, or never existed in the ZeroZone protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="h-12 px-8 rounded-full bg-white text-black border-0 shadow-lg shadow-black/20 hover:bg-zinc-200 transition-all cursor-pointer">
              <Link href="/">
                <Home size={18} className="mr-2" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-8 rounded-full border-white/15 text-white hover:bg-white/5 transition-all cursor-pointer">
              <button onClick={goBack}>
                <ArrowLeft size={18} className="mr-2" />
                Go Back
              </button>
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
