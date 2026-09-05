'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowDown,
    ArrowRight,
    Database,
    Globe,
    Server,
    type LucideIcon,
} from 'lucide-react'
import { SectionBackdrop } from './SectionBackdrop'

const steps: { icon: LucideIcon; title: string; sub: string; color: string }[] = [
    {
        icon: Globe,
        title: 'Frontend',
        sub: 'Next.js',
        color: 'bg-primary/15 text-primary',
    },
    {
        icon: Server,
        title: 'Backend',
        sub: 'Express + Socket.io',
        color: 'bg-cyan-500/15 text-cyan-400',
    },
    {
        icon: Database,
        title: 'PostgreSQL',
        sub: 'via Prisma',
        color: 'bg-emerald-500/15 text-emerald-400',
    },
]

export default function Architecture() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-background">
            <SectionBackdrop variant="orbit" />
            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-6">
                        How it works.
                    </h2>
                    <p className="text-zinc-400 text-base max-w-md mx-auto">
                        Three moving parts — easy to run, easy to audit.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-6"
                >
                    {steps.map((step, i) => (
                        <Fragment key={step.title}>
                            <div className="flex-1 max-w-xs w-full glass-dark rounded-2xl p-8 text-center">
                                <div
                                    className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}
                                >
                                    <step.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-zinc-400">{step.sub}</p>
                            </div>

                            {i < steps.length - 1 && (
                                <>
                                    <ArrowRight
                                        className="hidden md:block text-zinc-500 shrink-0"
                                        size={24}
                                    />
                                    <ArrowDown className="md:hidden mx-auto text-zinc-500 shrink-0" size={24} />
                                </>
                            )}
                        </Fragment>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    {/* PLACEHOLDER: confirm wording of the "see full architecture on GitHub" link */}
                    <a
                        href="https://github.com/DevMuhammed3/ZeroZone"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-400 hover:text-white transition-colors underline-offset-4 hover:underline"
                    >
                        See full architecture on GitHub →
                    </a>
                </motion.p>
            </div>
        </section>
    )
}
