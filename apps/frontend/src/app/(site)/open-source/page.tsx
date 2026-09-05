'use client'

import { motion } from 'framer-motion'
import { Shield, Server, Users, Check, Github, Star, GitBranch, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'packages/ui'
import Navbar from 'packages/ui/ui/Navbar'
import Footer from '../(landing)/Footer'
import { useUserStore } from '../../stores/user-store'

export default function OpenSourcePage() {
  const user = useUserStore(s => s.user)
  const GITHUB_URL = "https://github.com/DevMuhammed3/ZeroZone"

  return (
    <div className="dark min-h-screen bg-background selection:bg-primary/30">
      <Navbar user={user} />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-24 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold mb-10 uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% COMMUNITY DRIVEN
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-normal tracking-tight text-white mb-6 leading-tight">
              Privacy as a
              <br className="hidden sm:block" />
              public property.
            </h1>

            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              ZeroZone is built by contributors around the world who believe free speech and privacy should be the default, not an option.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="h-12 px-8 rounded-full bg-white text-black border-0 shadow-lg shadow-black/20 hover:bg-zinc-200 transition-all font-semibold">
                <Link href={GITHUB_URL}>
                  <Github size={18} className="mr-2" />
                  Clone on GitHub
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 rounded-full border-white/15 text-white hover:bg-white/5 transition-all font-semibold">
                <Link href={`${GITHUB_URL}/stargazers`}>
                  <Star size={18} className="mr-2 text-yellow-500" />
                  Star the Project
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Core Pillars */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               {
                 icon: Shield,
                 label: "Total Transparency",
                 desc: "Our entire communication engine, from voice processing to encryption, is public property. No hidden analytics, ever."
               },
               {
                 icon: GitBranch,
                 label: "Freedom to Fork",
                 desc: "The project's AGPL-3.0 license ensures you're free to study, modify, and host your own customized chat environment."
               },
               {
                 icon: Heart,
                 label: "Independently Built",
                 desc: "No venture capital, no corporate control. We are funded by the people who use the protocol every single day."
               }
             ].map((pillar, i) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl border border-white/5 bg-white/[0.03] hover:border-white/10 transition-all group"
                >
                   <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                      <pillar.icon size={20} />
                   </div>
                   <h4 className="text-lg font-semibold text-white mb-3">{pillar.label}</h4>
                   <p className="text-sm text-zinc-400 leading-relaxed">{pillar.desc}</p>
                </motion.div>
             ))}
          </div>
        </section>

        {/* Self-Hosting Benefits Card */}
        <section className="container mx-auto px-6 mb-32">
           <div className="max-w-4xl mx-auto rounded-2xl border border-white/5 bg-white/[0.03] p-8 md:p-16 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                 <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">
                       Sovereignty as a Standard
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-white mb-6 leading-tight">Your server. <br className="hidden sm:block" /> Your community.</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-sm">
                      Self-hosting ZeroZone puts the power back where it belongs. Manage your own keys, database, and voice infrastructure without being tied to a centralized platform.
                    </p>
                    <div className="flex flex-wrap gap-4">
                       {[
                         "Zero-Knowledge Storage",
                         "Custom Instance URLs",
                         "Automatic Updates"
                       ].map(tag => (
                         <div key={tag} className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            <Check size={14} className="text-emerald-500" />
                            {tag}
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="w-full md:w-64 aspect-square rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center shadow-2xl relative">
                    <Server size={64} className="text-cyan-400 mb-6" />
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Node ready</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Contribute Table */}
        <section className="container mx-auto px-6 mb-32">
           <div className="max-w-4xl mx-auto">
               <h2 className="text-center font-display text-3xl md:text-4xl font-normal tracking-tight text-white mb-12">Ways to Contribute</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { label: "Star & Fork", desc: "Show your support and help others find the protocol.", icon: Star },
                   { label: "Report Bugs", desc: "Help us harden the encryption and fix corner cases.", icon: Shield },
                   { label: "Develop Features", desc: "Build new plugins or improve our voice engine.", icon: GitBranch },
                   { label: "Community Support", desc: "Help newcomers set up their sovereign nodes.", icon: Users }
                 ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-4 hover:bg-white/[0.04] hover:border-white/10 transition-all group cursor-pointer"
                    >
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
                         <item.icon size={18} />
                       </div>
                       <div>
                         <h5 className="text-white text-sm font-bold mb-2">{item.label}</h5>
                         <p className="text-zinc-500 text-[11px] leading-relaxed">{item.desc}</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Connect Action */}
        <section className="container mx-auto px-6 text-center">
           <div className="max-w-2xl mx-auto">
               <h2 className="font-display text-4xl font-normal tracking-tight text-white mb-6 leading-tight">Ready to build the future?</h2>
               <p className="text-zinc-400 text-sm mb-12 leading-relaxed">Join our community on GitHub and help us define the next generation of human communication.</p>
               <Button asChild className="h-12 px-10 rounded-full bg-white text-black border-0 shadow-lg shadow-black/20 hover:bg-zinc-200 transition-all font-semibold">
                 <Link href={GITHUB_URL}>
                    Visit the Repository
                 </Link>
              </Button>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
