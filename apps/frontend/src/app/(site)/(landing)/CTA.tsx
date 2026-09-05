'use client'

import { motion } from 'framer-motion'
import { Github, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'packages/ui'
import { SectionBackdrop } from './SectionBackdrop'

export default function CTA() {
    return (
        <section className="py-40 relative overflow-hidden bg-background">
            <SectionBackdrop variant="cta" />

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-6 leading-tight">
                        Ready to build your
                        <br className="hidden sm:block" />
                        community?
                    </h2>

                    <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                        Self-host or use our cloud — your choice.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-sm font-semibold border-0 shadow-lg shadow-black/20"
                        >
                            <Link href="/auth">
                                Start Building Free
                                <ArrowRight className="ml-2" size={16} />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 px-8 rounded-full border-white/15 text-white hover:bg-white/5 text-sm font-semibold"
                        >
                            <Link href="https://github.com/DevMuhammed3/ZeroZone" target="_blank">
                                <Github size={16} className="mr-2" />
                                Star on GitHub
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
