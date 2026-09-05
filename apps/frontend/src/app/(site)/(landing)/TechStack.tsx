'use client'

import { SectionBackdrop } from './SectionBackdrop'
import { Reveal } from './Reveal'

const tech = [
  { name: 'Next.js', file: 'nextjs.svg' },
  { name: 'TypeScript', file: 'typescript.svg' },
  { name: 'Tailwind', file: 'tailwind.svg' },
  { name: 'Socket.io', file: 'socketio.svg' },
  { name: 'Express', file: 'express.svg' },
  { name: 'Prisma', file: 'prisma.svg' },
  { name: 'PostgreSQL', file: 'postgresql.svg' },
]

export default function TechStack() {
  return (
    <section className="relative py-28 px-6 bg-background overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <Reveal className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-6">
            Built with care
          </h2>
          <p className="text-zinc-400 text-base max-w-md mx-auto">
            A modern, open-source stack you can audit and self-host.
          </p>
        </Reveal>

        <Reveal delay={150} className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {tech.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/${t.file}`}
                alt={t.name}
                className="w-6 h-6 opacity-40 group-hover:opacity-70 transition-opacity filter brightness-0 invert"
              />
              <span className="text-sm font-medium">{t.name}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
