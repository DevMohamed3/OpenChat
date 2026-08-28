"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { api } from "@zerozone/lib"
import { QrCode } from "lucide-react"
import { TabSwitcher } from "./_components/TabSwitcher"
import { LoginForm } from "./_components/LoginForm"
import { SignupForm } from "./_components/SignupForm"
import Link from "next/link"

export default function AuthPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
    const [shake, setShake] = useState(false)

    useEffect(() => {
        api(`/auth/me?t=${Date.now()}`, { credentials: "include" })
            .then((res) => {
                if (res.ok) return res.json()
                throw new Error()
            })
            .then((data) => {
                if (data.user?.emailVerified === false) {
                    router.replace("/verify-email")
                } else {
                    router.replace("/zone")
                }
            })
            .catch(() => {})
    }, [router])

    const redirectToZone = async () => {
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const res = await api("/auth/me", {
                    credentials: "include",
                    cache: "no-store",
                })
                if (res.ok) {
                    const data = await res.json()
                    if (data.user?.emailVerified === false) {
                        window.location.assign("/verify-email")
                    } else {
                        window.location.assign("/zone")
                    }
                    return
                }
            } catch {
                // ignore
            }
            await new Promise((r) => setTimeout(r, 250))
        }
        throw new Error("Session was not established")
    }

    const handleTabChange = (tab: "login" | "signup") => {
        setActiveTab(tab)
        setShake(false)
        // Reset scroll so the switched-to form starts from its heading
        window.scrollTo(0, 0)
    }

    return (
        <div className="dark min-h-screen relative bg-background">
            {/* Full-page cinematic space background — subtly blurred and
                darkened; the card, branding and text stay sharp above it */}
            <div className="fixed inset-0 overflow-hidden" aria-hidden>
                <Image
                    src="/the-auth-bg.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    quality={90}
                    className="object-cover object-center scale-[1.04] blur-[5px]"
                />
                {/* Flat atmospheric veil for contrast */}
                <div className="absolute inset-0 bg-background/35" />
            </div>

            {/* Brand — top-left, independent of the form */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-4 left-4 sm:top-7 sm:left-7 z-20 flex items-center gap-2.5"
            >
                <Image
                    src="/iconX2.png"
                    width={30}
                    height={30}
                    alt="Zone logo"
                />
                <span className="font-display text-2xl font-normal tracking-tight text-white">
                    Zone
                </span>
            </motion.div>

            {/* Unified authentication composition — form and QR teaser share
                one surface, split by an ultra-subtle internal divider */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`w-full max-w-[740px] rounded-3xl border border-white/[0.06] bg-[#030508]/90 backdrop-blur-md shadow-2xl shadow-black/50 flex flex-col lg:flex-row ${shake ? "animate-shake" : ""}`}
                >
                    {/* Form column — primary */}
                    <div className="flex-1 min-w-0 p-6 sm:p-7">
                        <div className="text-center mb-4">
                            <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-white">
                                {activeTab === "login" ? "Welcome back" : "Create your account"}
                            </h2>
                            <p className="text-sm text-zinc-400 mt-1.5">
                                {activeTab === "login"
                                    ? "Sign in to continue to Zone"
                                    : "Join the community and start chatting"}
                            </p>
                        </div>

                        <TabSwitcher
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />

                        <AnimatePresence mode="wait">
                            {activeTab === "login" ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <LoginForm onSuccess={redirectToZone} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SignupForm onSuccess={redirectToZone} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-5 pt-4 border-t border-white/[0.06]">
                            <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                                <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                                    Terms
                                </Link>
                                <span className="text-zinc-700">·</span>
                                <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                                    Privacy
                                </Link>
                                <span className="text-zinc-700">·</span>
                                <Link href="/help" className="hover:text-zinc-300 transition-colors">
                                    Help
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* QR login column — desktop only */}
                    <div className="hidden lg:flex shrink-0 lg:w-[250px] lg:border-l border-white/[0.06] lg:p-8 items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="lg:flex lg:flex-col lg:items-center lg:text-center"
                        >
                            <div className="flex items-center gap-4 lg:flex-col lg:gap-0">
                                {/* Scan-target placeholder — deliberately not a real QR */}
                                <div className="relative w-24 h-24 lg:w-36 lg:h-36 shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2.5 lg:p-3">
                                    <span className="pointer-events-none absolute -top-px -left-px w-4 h-4 rounded-tl-2xl border-t-2 border-l-2 border-violet-400/40" />
                                    <span className="pointer-events-none absolute -top-px -right-px w-4 h-4 rounded-tr-2xl border-t-2 border-r-2 border-violet-400/40" />
                                    <span className="pointer-events-none absolute -bottom-px -left-px w-4 h-4 rounded-bl-2xl border-b-2 border-l-2 border-violet-400/40" />
                                    <span className="pointer-events-none absolute -bottom-px -right-px w-4 h-4 rounded-br-2xl border-b-2 border-r-2 border-violet-400/40" />
                                    <div className="w-full h-full rounded-xl border border-dashed border-white/[0.12] bg-background/40 flex items-center justify-center">
                                        <QrCode className="w-9 h-9 lg:w-12 lg:h-12 text-zinc-600" strokeWidth={1} />
                                    </div>
                                </div>

                                <div className="min-w-0 lg:mt-5 lg:flex-none">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                        QR Code
                                    </p>
                                    <h3 className="text-sm lg:text-base font-semibold text-zinc-100 mt-1">
                                        Sign in with QR Code
                                    </h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed mt-1.5 lg:max-w-[200px] lg:mx-auto">
                                        Scan this with the ZeroZone mobile app to sign in instantly.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center lg:mt-5">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] font-medium text-violet-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
                                    Coming soon
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
