'use client'

import {
  MessageCircle,
  Phone,
  RefreshCw,
  Wifi,
  UserCheck,
  Lock,
} from 'lucide-react'
import { SectionBackdrop } from './SectionBackdrop'
import { Reveal } from './Reveal'

const features = [
  {
    icon: MessageCircle,
    title: 'Real-Time Messaging',
    desc: 'Instant delivery, channels, groups, and file sharing.',
    color: 'bg-primary/15 text-primary',
  },
  {
    icon: Phone,
    title: 'Voice & Video',
    desc: 'Crystal-clear calls powered by LiveKit.',
    color: 'bg-cyan-500/15 text-cyan-400',
  },
  {
    icon: RefreshCw,
    title: 'Calls survive refresh',
    desc: 'Active voice calls persist through page reloads and reconnect automatically (server-side call state).',
    color: 'bg-violet-500/15 text-violet-400',
  },
  {
    icon: Wifi,
    title: 'Graceful reconnection',
    desc: 'A 10-second grace period absorbs network drops before ending a call.',
    color: 'bg-amber-500/15 text-amber-400',
  },
  {
    icon: UserCheck,
    title: 'Friend-only presence',
    desc: 'Online/offline status is only broadcast to friends, not the whole system.',
    color: 'bg-sky-500/15 text-sky-400',
  },
  {
    icon: Lock,
    title: 'Open Source',
    desc: 'Audit every line. Self-host on your own server. No black boxes.',
    color: 'bg-emerald-500/15 text-emerald-400',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden bg-background">
      <SectionBackdrop variant="dark" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <Reveal className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-6">
            Everything you need.
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Not a bloated platform. A focused tool that does what matters.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Reveal key={i} className="h-full rounded-2xl bg-white/[0.03] p-8" delay={i * 80}>
              <div className={`w-12 h-12 rounded-full ${f.color} flex items-center justify-center mb-6`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {f.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
