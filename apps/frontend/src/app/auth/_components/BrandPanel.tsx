"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function BrandPanel() {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <Image
                src="/auth-bg.png"
                fill
                alt=""
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-[#020617]/60" />

            <div className="relative z-10 flex flex-col justify-center px-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-2.5 mb-12">
                        <Image
                            src="/iconX2.png"
                            width={30}
                            height={30}
                            alt="Zone logo"
                        />
                        <span className="text-3xl font-bold text-white tracking-tight">
                            Zone
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Where conversations
                        <br />
                        <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                            come alive
                        </span>
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
                        Join zones, chat in real time, and build meaningful
                        connections — all in one place.
                    </p>
                </motion.div>
            </div>

            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            />
        </div>
    )
}
