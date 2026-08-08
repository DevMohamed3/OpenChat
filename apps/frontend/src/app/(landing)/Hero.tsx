'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'packages/ui'
import { useUserStore } from '@/app/stores/user-store'

export default function Hero() {
    const user = useUserStore((s) => s.user)

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-40 pb-24 overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(120,80,255,0.08),transparent)]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        {/* Headline */}
                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal tracking-tight text-white leading-[1.02] mb-8 max-w-4xl mx-auto">
                            The chat app that
                            <br className="hidden sm:block" />
                            respects you.
                        </h1>

                        {/* Sub */}
                        <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
                            Open-source, self-hosted, and built for people who care
                            about privacy.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
                            <Button
                                asChild
                                size="lg"
                                className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-sm font-semibold border-0 shadow-lg shadow-black/20"
                            >
                                <Link href={user ? '/zone' : '/auth'}>
                                    Get started
                                    <ArrowRight className="ml-2" size={16} />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="h-12 px-8 rounded-full border-white/15 text-white hover:bg-white/5 text-sm font-semibold"
                            >
                                <Link
                                    href="https://github.com/DevMuhammed3/ZeroZone"
                                    target="_blank"
                                >
                                    <Github className="mr-2" size={16} />
                                    View on GitHub
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* App screenshot — real product */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        className="w-full max-w-6xl"
                    >
                        <Image
                            src="/form-zone-for-landing-page.png"
                            alt="ZeroZone app screenshot"
                            width={2880}
                            height={1970}
                            priority
                            className="w-full h-auto rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/50"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
