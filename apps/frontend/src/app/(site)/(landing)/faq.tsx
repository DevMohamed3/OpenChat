"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "packages/ui"
import { SectionBackdrop } from "./SectionBackdrop"
import { Reveal } from "./Reveal"

const faqs = [
  {
    question: "Is ZeroZone really free? What's the catch?",
    answer:
      "No catch. ZeroZone is 100% free and open-source. We don't sell your data, show ads, or charge hidden fees. The code is public — you can verify everything yourself.",
  },
  {
    question: "Do I need a phone number to sign up?",
    answer:
      "Nope. Just an email address. We don't ask for your phone number, real name, or any personal info you're not comfortable sharing.",
  },
  {
    question: "Can I create a community like a Discord server?",
    answer:
      "Yes. You can create your own space with multiple channels and groups, invite people, and manage everything — all from your phone.",
  },
  {
    question: "Who can read my messages?",
    answer:
      "Only you and the people you're talking to. Not us, not advertisers, not anyone. Your conversations are encrypted and private by default.",
  },
  {
    question: "Can I use ZeroZone on my phone?",
    answer:
      "Yes. ZeroZone is designed mobile-first — fast, simple, and works great on any device.",
  },
  {
    question: "Can I self-host ZeroZone?",
    answer:
      "Yes. ZeroZone is fully open-source and designed for self-hosting. Deploy it on your own infrastructure with full control over your data and privacy.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="relative py-32 px-6 overflow-hidden bg-background">
      <SectionBackdrop variant="minimal" />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
            Everything you need to know about ZeroZone, privacy, and how it works under the hood.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <Accordion
            type="single"
            collapsible
            className="w-full border-y border-white/10 divide-y divide-white/10"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-none"
              >
                <AccordionTrigger className="text-left text-base font-medium text-white hover:text-white py-5 transition-colors hover:no-underline">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
