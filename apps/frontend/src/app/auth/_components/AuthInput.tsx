"use client"

import { forwardRef, useState } from "react"
import { Eye, EyeOff, type LucideIcon } from "lucide-react"
import { cn } from "@openchat/components/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    icon: LucideIcon
    error?: string
    touched?: boolean
    prefix?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    function AuthInput(
        {
            label,
            icon: Icon,
            type = "text",
            placeholder,
            error,
            touched,
            disabled,
            prefix,
            className,
            ...inputProps
        },
        ref
    ) {
        const [showPassword, setShowPassword] = useState(false)
        const isPassword = type === "password"
        const inputType = isPassword && showPassword ? "text" : type
        const hasError = touched && error

        return (
            <div className={cn("space-y-2", className)}>
                {label && (
                    <label className="block text-sm font-medium text-zinc-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {prefix ? (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
                            {prefix}
                        </span>
                    ) : (
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            "w-full h-12 bg-white/5 border rounded-xl text-white placeholder:text-zinc-500",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] transition-all",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            prefix ? "pl-10" : "pl-12",
                            isPassword ? "pr-12" : "pr-4",
                            hasError
                                ? "border-red-500 focus:ring-red-500/30"
                                : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
                        )}
                        {...inputProps}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
                {hasError && (
                    <p className="text-xs text-red-400 mt-1.5">{error}</p>
                )}
            </div>
        )
    }
)
