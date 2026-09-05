'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Image as ImageIcon,
    MessageCircle,
    Phone,
    Server,
    type LucideIcon,
} from 'lucide-react'
import { SectionBackdrop } from './SectionBackdrop'

type PreviewTab = 'chat' | 'call' | 'zones'

const previews: {
    key: PreviewTab
    label: string
    icon: LucideIcon
    src: string
    alt: string
    fallback: string
}[] = [
    {
        key: 'chat',
        label: 'Chat',
        icon: MessageCircle,
        // PLACEHOLDER: main chat UI screenshot — src="/screenshots/chat.png"
        // Drop the file at apps/frontend/public/screenshots/chat.png to show it.
        src: '/screenshots/chat.png',
        alt: 'ZeroZone main chat interface with channels and messages',
        fallback: 'Screenshot: chat UI',
    },
    {
        key: 'call',
        label: 'Voice call',
        icon: Phone,
        // PLACEHOLDER: voice call UI screenshot — src="/screenshots/call.png"
        // Drop the file at apps/frontend/public/screenshots/call.png to show it.
        src: '/screenshots/call.png',
        alt: 'ZeroZone voice call interface during an active call',
        fallback: 'Screenshot: call UI',
    },
    {
        key: 'zones',
        label: 'Zones',
        icon: Server,
        // PLACEHOLDER: zones/servers list screenshot — src="/screenshots/zones.png"
        // Drop the file at apps/frontend/public/screenshots/zones.png to show it.
        src: '/screenshots/zones.png',
        alt: 'ZeroZone zones list showing joined servers',
        fallback: 'Screenshot: zones list',
    },
]

export default function ProductPreview() {
    const [active, setActive] = useState<PreviewTab>('chat')
    const [broken, setBroken] = useState<Partial<Record<PreviewTab, boolean>>>({})

    const current = previews.find((p) => p.key === active) ?? previews[0]

    return (
        <section className="relative py-24 px-6 overflow-hidden bg-background">
            <SectionBackdrop variant="product" />
            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Tab switcher */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {previews.map((p) => (
                            <button
                                key={p.key}
                                type="button"
                                onClick={() => setActive(p.key)}
                                aria-pressed={active === p.key}
                                className={`flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
                                    active === p.key
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <p.icon size={14} />
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Browser-window frame */}
                    <div className="rounded-2xl overflow-hidden glass-dark shadow-2xl shadow-black/40">
                        <div className="flex items-center gap-1.5 px-4 h-10 border-b border-white/10 bg-white/[0.03]">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
                            <span className="w-3 h-3 rounded-full bg-[#febc2e]/70" />
                            <span className="w-3 h-3 rounded-full bg-[#28c840]/70" />
                        </div>

                        <div className="relative aspect-video bg-zinc-900/60">
                            {broken[current.key] ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-600">
                                    <ImageIcon size={24} />
                                    <p className="text-sm">{current.fallback}</p>
                                </div>
                            ) : (
                                <Image
                                    src={current.src}
                                    alt={current.alt}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                    className="object-cover object-top"
                                    onError={() =>
                                        setBroken((b) => ({ ...b, [current.key]: true }))
                                    }
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
