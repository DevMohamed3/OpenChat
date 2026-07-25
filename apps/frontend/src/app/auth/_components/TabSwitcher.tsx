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
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl mb-8 backdrop-blur-xl border border-white/10">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors z-10"
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="auth-tab"
                            className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/25"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <span
                        className={`relative z-10 ${
                            activeTab === tab.id ? "text-white" : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
