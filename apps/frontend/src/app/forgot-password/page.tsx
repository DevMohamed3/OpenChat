"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    forgotPasswordSchema,
    resetPasswordSchema,
} from "@openchat/lib/validations/auth"
import type {
    ForgotPasswordInput,
    ResetPasswordInput,
} from "@openchat/lib/validations/auth"
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@openchat/lib"
import Image from "next/image"

type Step = "email" | "reset"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>("email")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const emailForm = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onBlur",
    })

    const resetForm = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onBlur",
        defaultValues: { email: "", code: "", newPassword: "" },
    })

    const onEmailSubmit = async (data: ForgotPasswordInput) => {
        setError("")
        setSuccess("")
        try {
            const res = await api("/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || "Something went wrong")
                return
            }

            setEmail(data.email)
            resetForm.setValue("email", data.email)
            setSuccess("Code sent — check your inbox")
            setStep("reset")
        } catch {
            setError("Connection error. Please try again.")
        }
    }

    const onResetSubmit = async (data: ResetPasswordInput) => {
        setError("")
        setSuccess("")
        try {
            const res = await api("/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || "Something went wrong")
                return
            }

            setSuccess("Password updated — redirecting to sign in")
            setTimeout(() => router.push("/auth"), 2000)
        } catch {
            setError("Connection error. Please try again.")
        }
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
                    <AnimatePresence mode="wait">
                        {step === "email" ? (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <KeyRound className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">
                                            Reset your password
                                        </h1>
                                        <p className="text-sm text-zinc-400">
                                            We&apos;ll send a 6-digit code to your email
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <span className="text-sm">{success}</span>
                                    </div>
                                )}

                                <form
                                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                            <input
                                                type="email"
                                                {...emailForm.register("email")}
                                                placeholder="you@example.com"
                                                className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] transition-all ${
                                                    emailForm.formState.errors.email
                                                        ? "border-red-500 focus:ring-red-500/30"
                                                        : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
                                                }`}
                                            />
                                        </div>
                                        {emailForm.formState.errors.email && (
                                            <p className="text-xs text-red-400">
                                                {emailForm.formState.errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={emailForm.formState.isSubmitting}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
                                    >
                                        {emailForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Reset Code"
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reset"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={() => {
                                            setStep("email")
                                            setError("")
                                            setSuccess("")
                                        }}
                                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                                    </button>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">
                                            Create a new password
                                        </h1>
                                        <p className="text-sm text-zinc-400">
                                            Enter the code from your email and set a new password
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <span className="text-sm">{success}</span>
                                    </div>
                                )}

                                <form
                                    onSubmit={resetForm.handleSubmit(onResetSubmit)}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            Reset Code
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            {...resetForm.register("code")}
                                            placeholder="000000"
                                            className={`w-full h-12 px-4 bg-white/5 border rounded-xl text-white text-center text-2xl tracking-[0.4em] placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] transition-all ${
                                                resetForm.formState.errors.code
                                                    ? "border-red-500 focus:ring-red-500/30"
                                                    : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
                                            }`}
                                        />
                                        {resetForm.formState.errors.code && (
                                            <p className="text-xs text-red-400">
                                                {resetForm.formState.errors.code.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                            <input
                                                type="password"
                                                {...resetForm.register("newPassword")}
                                                placeholder="••••••••"
                                                className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] transition-all ${
                                                    resetForm.formState.errors.newPassword
                                                        ? "border-red-500 focus:ring-red-500/30"
                                                        : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
                                                }`}
                                            />
                                        </div>
                                        {resetForm.formState.errors.newPassword && (
                                            <p className="text-xs text-red-400">
                                                {resetForm.formState.errors.newPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={resetForm.formState.isSubmitting}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
                                    >
                                        {resetForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Resetting...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
