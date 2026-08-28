"use client"

import { motion } from "framer-motion"

interface TabSwitcherProps {
    activeTab: "login" | "signup"
    onTabChange: (tab: "login" | "signup") => void
}

const tabs = [
    { id: "login" as const, label: "Sign In" },
    { id: "signup" as const, label: "Sign Up" },
]

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
    return (
        <div className="flex gap-1 p-1 bg-white/[0.06] rounded-full mb-6 backdrop-blur-xl border border-white/[0.08]">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors z-10"
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="auth-tab"
                            className="absolute inset-0 bg-white rounded-full shadow-lg shadow-black/20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <span
                        className={`relative z-10 ${
                            activeTab === tab.id ? "text-black" : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
