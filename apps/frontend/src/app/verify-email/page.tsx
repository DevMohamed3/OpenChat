"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { api } from "@zerozone/lib"
import { useQueryClient } from "@tanstack/react-query"
import { userKeys } from "@/features/user/queries"
import type { AppUser } from "@/features/user/types"
import { Loader2, CheckCircle2, AlertCircle, Mail, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VerifyEmail() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"success" | "error" | "info" | null>(null)
    const [resending, setResending] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        api(`/auth/me?t=${Date.now()}`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then((data) => {
                if (data.user?.emailVerified) {
                    router.replace("/zone")
                } else {
                    setChecking(false)
                }
            })
            .catch(() => {
                router.replace("/auth")
            })
    }, [router])

    async function handleVerify() {
        if (code.length !== 6) return
        setLoading(true)
        setMessage("")
        setMessageType(null)

        const res = await api("/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        })

        const data = await res.json()
        setLoading(false)

        if (res.ok) {
            setMessage("You're all set! Redirecting...")
            setMessageType("success")

            setTimeout(() => {
                queryClient.setQueryData<AppUser | null>(userKeys.current(), (current) => {
                    if (!current) return current
                    return { ...current, emailVerified: true }
                })
                queryClient.invalidateQueries({ queryKey: userKeys.current() })
                router.push("/zone")
            }, 1500)
        } else {
            setMessage(data.message || "Invalid code")
            setMessageType("error")
        }
    }

    async function handleResend() {
        setResending(true)
        setMessage("")
        setMessageType(null)

        const res = await api("/auth/resend-email", {
            method: "POST",
        })

        const data = await res.json()
        setResending(false)

        if (res.ok) {
            setMessage("Code resent — check your inbox")
            setMessageType("info")
        } else {
            setMessage(data.message || "Something went wrong")
            setMessageType("error")
        }
    }

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
            <div className="absolute inset-0 bg-dots opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex items-center justify-center gap-3 mb-8">
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

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white">
                            Check your inbox
                        </h1>
                        <p className="text-sm text-zinc-400 mt-2">
                            We sent a 6-digit verification code to your email.
                            <br />
                            Enter it below to continue.
                        </p>
                    </div>

                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                                messageType === "success"
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                    : messageType === "error"
                                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                                      : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                            }`}
                        >
                            {messageType === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            {messageType === "error" && <AlertCircle className="w-5 h-5 shrink-0" />}
                            {messageType === "info" && <Mail className="w-5 h-5 shrink-0" />}
                            <span className="text-sm">{message}</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.4em] placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] focus:border-primary/50 focus:ring-primary/30 transition-all"
                        />

                        <button
                            onClick={handleVerify}
                            disabled={loading || code.length !== 6}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Email"
                            )}
                        </button>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <span className="relative px-4 bg-[#020617] text-sm text-zinc-500">
                                or
                            </span>
                        </div>

                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:border-white/20 active:scale-[0.98]"
                        >
                            {resending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Copy className="w-5 h-5" />
                            )}
                            {resending ? "Sending..." : "Resend code"}
                        </button>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/auth"
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        Back to sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
