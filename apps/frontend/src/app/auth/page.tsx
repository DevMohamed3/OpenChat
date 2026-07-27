"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { api } from "@zerozone/lib"
import { MessageSquare, Users, Zap } from "lucide-react"
import { BrandPanel } from "./_components/BrandPanel"
import { TabSwitcher } from "./_components/TabSwitcher"
import { LoginForm } from "./_components/LoginForm"
import { SignupForm } from "./_components/SignupForm"
import Link from "next/link"

const features = [
    { icon: MessageSquare, label: "Real-time messaging" },
    { icon: Users, label: "Public & private zones" },
    { icon: Zap, label: "Instant notifications" },
]

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
    }

    return (
        <div className="min-h-screen flex bg-[#020617]">
            <BrandPanel />

            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`w-full max-w-md ${shake ? "animate-shake" : ""}`}
                >
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Image
                                src="/iconX2.png"
                                width={24}
                                height={24}
                                alt="Zone logo"
                            />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                            Zone
                        </span>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            {activeTab === "login" ? "Welcome back" : "Create your account"}
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">
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

                    <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {features.map((feat) => (
                                <div key={feat.label} className="flex flex-col items-center gap-2 text-center">
                                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                                        <feat.icon className="w-4 h-4 text-zinc-400" />
                                    </div>
                                    <span className="text-[11px] text-zinc-500 leading-tight">
                                        {feat.label}
                                    </span>
                                </div>
                            ))}
                        </div>

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
                </motion.div>
            </div>
        </div>
    )
}
