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
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-[#020617]/30" />

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

                    <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-6 leading-tight">
                        Where conversations
                        <br />
                        come alive
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
                        Join zones, chat in real time, and build meaningful
                        connections — all in one place.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
