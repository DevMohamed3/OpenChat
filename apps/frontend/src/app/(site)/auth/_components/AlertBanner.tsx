"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface AlertBannerProps {
    type: "error" | "success"
    message: string
}

export function AlertBanner({ type, message }: AlertBannerProps) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 overflow-hidden"
                >
                    <div
                        className={`p-4 rounded-xl flex items-center gap-3 ${
                            type === "error"
                                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        }`}
                    >
                        {type === "error" ? (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                        )}
                        <span className="text-sm">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
