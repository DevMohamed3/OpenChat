'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Send, Youtube, type LucideIcon } from 'lucide-react'
import { SectionBackdrop } from './SectionBackdrop'

function DiscordIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.293a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.947 2.419-2.157 2.419Z" />
        </svg>
    )
}

const socials: {
    label: string
    // PLACEHOLDER: replace '#' with the real profile URL once each account is live
    href: string
    icon: LucideIcon | (({ size }: { size?: number }) => React.JSX.Element)
    external?: boolean
}[] = [
    {
        label: 'GitHub',
        href: 'https://github.com/DevMuhammed3/ZeroZone',
        icon: Github,
        external: true,
    },
    { label: 'X (Twitter)', href: '#', icon: Twitter },
    { label: 'Discord', href: '#', icon: DiscordIcon },
    { label: 'Telegram', href: '#', icon: Send },
    { label: 'YouTube', href: '#', icon: Youtube },
]

export default function Footer() {
    return (
        <footer className="w-full bg-background pt-20 pb-8 relative overflow-hidden">
            <SectionBackdrop variant="footer" />
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
                    <div className="lg:col-span-1">
                        <Link
                            href="/"
                            prefetch={false}
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
                            {socials.map((s) => (
                                <Link
                                    key={s.label}
                                    href={s.href}
                                    {...(s.external
                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                        : {})}
                                    aria-disabled={!s.external && s.href === '#'}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                    aria-label={`ZeroZone on ${s.label}`}
                                >
                                    <s.icon size={16} />
                                </Link>
                            ))}
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
                                    prefetch={false}
                                    className="hover:text-white transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/open-source"
                                    prefetch={false}
                                    className="hover:text-white transition-colors"
                                >
                                    Open Source
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/docs"
                                    prefetch={false}
                                    className="hover:text-white transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/solutions"
                                    prefetch={false}
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
                                    prefetch={false}
                                    className="hover:text-white transition-colors"
                                >
                                    Infrastructure
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#faq"
                                    prefetch={false}
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
                                    prefetch={false}
                                    className="hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    prefetch={false}
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
