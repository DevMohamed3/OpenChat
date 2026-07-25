"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@openchat/lib/validations/auth"
import type { SignupInput } from "@openchat/lib/validations/auth"
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react"
import { api } from "@openchat/lib"
import Link from "next/link"
import { AuthInput } from "./AuthInput"
import { AlertBanner } from "./AlertBanner"

interface SignupFormProps {
    onSuccess: () => Promise<void>
}

export function SignupForm({ onSuccess }: SignupFormProps) {
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, touchedFields, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    })

    const password = watch("password", "")

    const passwordStrength = useMemo(() => {
        if (!password) return 0
        let score = 0
        if (password.length >= 8) score++
        if (password.length >= 12) score++
        if (/[A-Z]/.test(password)) score++
        if (/[a-z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        return score
    }, [password])

    const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"]
    const strengthColors = [
        "bg-red-500",
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-emerald-500",
    ]

    const onSubmit = async (data: SignupInput) => {
        setError("")
        try {
            const { confirmPassword: _, ...registerData } = data
            const res = await api("/auth/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || "Registration failed")
                return
            }

            await onSuccess()
        } catch {
            setError("Connection error. Please try again.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AlertBanner type="error" message={error} />

            <div className="grid grid-cols-2 gap-4">
                <AuthInput
                    label="Full Name"
                    icon={User}
                    placeholder="John Doe"
                    error={errors.name?.message}
                    touched={touchedFields.name}
                    {...register("name")}
                />
                <AuthInput
                    label="Username"
                    icon={User}
                    prefix="@"
                    placeholder="johndoe"
                    error={errors.username?.message}
                    touched={touchedFields.username}
                    {...register("username", {
                        onChange: (e) => {
                            e.target.value = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_]/g, "")
                        },
                    })}
                />
            </div>

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
                <AuthInput
                    label="Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    touched={touchedFields.password}
                    {...register("password")}
                />

                {password && passwordStrength > 0 && (
                    <div className="mt-3">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                        level <= passwordStrength
                                            ? strengthColors[passwordStrength]
                                            : "bg-white/10"
                                    }`}
                                />
                            ))}
                        </div>
                        <p
                            className={`text-xs ${
                                passwordStrength <= 2
                                    ? "text-red-400"
                                    : passwordStrength <= 3
                                      ? "text-yellow-400"
                                      : "text-emerald-400"
                            }`}
                        >
                            {strengthLabels[passwordStrength]}
                        </p>
                    </div>
                )}
            </div>

            <AuthInput
                label="Confirm Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                touched={touchedFields.confirmPassword}
                {...register("confirmPassword")}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Create Account
                    </>
                )}
            </button>

            <p className="text-xs text-zinc-500 text-center leading-relaxed">
                By signing up, you agree to our{" "}
                <Link
                    href="/terms"
                    className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
                >
                    Privacy Policy
                </Link>
            </p>
        </form>
    )
}
