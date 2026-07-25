"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Mail, Lock } from "lucide-react"
import { useGoogleLogin } from "@react-oauth/google"
import Link from "next/link"
import { api } from "@openchat/lib"
import { Checkbox, Label } from "@openchat/ui"
import { AuthInput } from "./AuthInput"
import { AlertBanner } from "./AlertBanner"

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
    onSuccess: () => Promise<void>
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [error, setError] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    })

    const onSubmit = async (data: LoginFormData) => {
        setError("")
        try {
            const res = await api("/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, rememberMe }),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || "Invalid email or password")
                return
            }

            await onSuccess()
        } catch {
            setError("Connection error. Please try again.")
        }
    }

    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                setError("")
                const res = await api("/auth/google", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: codeResponse.code }),
                })

                if (!res.ok) {
                    setError("Google login failed. Please try again.")
                    return
                }

                await onSuccess()
            } catch {
                setError("Something went wrong. Please try again.")
            }
        },
        onError: () => {
            setError("Google login failed")
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AlertBanner type="error" message={error} />

            <AuthInput
                label="Email"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                touched={touchedFields.email}
                {...register("email")}
            />

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-zinc-300">
                        Password
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>
                <AuthInput
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    touched={touchedFields.password}
                    {...register("password")}
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label
                    htmlFor="remember"
                    className="text-sm text-zinc-400 cursor-pointer select-none"
                >
                    Remember me
                </Label>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    "Sign In"
                )}
            </button>

            <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-4 bg-[#020617] text-sm text-zinc-500">
                    or
                </span>
            </div>

            <button
                type="button"
                onClick={() => login()}
                disabled={isSubmitting}
                className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:border-white/20 active:scale-[0.98]"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>
        </form>
    )
}
