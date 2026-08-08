'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full bg-[#020617] border-t border-white/5 pt-20 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
                    <div className="lg:col-span-1">
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-6 group"
                        >
                            <Image
                                src="/iconX2.png"
                                width={25}
                                height={25}
                                alt="ZeroZone logo"
                                className="transition-transform group-hover:scale-105"
                            />
                            <span className="font-display text-xl font-normal tracking-tight text-white">
                                Zone
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm max-w-xs leading-relaxed mb-6">
                            The open protocol for sovereign human communication.
                            Privacy is the foundation of our engineering.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://github.com/DevMuhammed3/ZeroZone"
                                target="_blank"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                aria-label="ZeroZone on GitHub"
                            >
                                <Github size={16} />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                            Product
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li>
                                <Link
                                    href="/#features"
                                    className="hover:text-white transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/open-source"
                                    className="hover:text-white transition-colors"
                                >
                                    Open Source
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/docs"
                                    className="hover:text-white transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/solutions"
                                    className="hover:text-white transition-colors"
                                >
                                    Solutions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                            Resources
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li>
                                <Link
                                    href="/infrastructure"
                                    className="hover:text-white transition-colors"
                                >
                                    Infrastructure
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#faq"
                                    className="hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://github.com/DevMuhammed3/ZeroZone"
                                    target="_blank"
                                    className="hover:text-white transition-colors"
                                >
                                    GitHub
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-600 text-xs">
                        © {new Date().getFullYear()} ZeroZone. Distributed under
                        MIT License.
                    </p>
                    <p className="text-zinc-600 text-xs flex items-center gap-1">
                        Built with care by the community
                    </p>
                </div>
            </div>
        </footer>
    )
}
