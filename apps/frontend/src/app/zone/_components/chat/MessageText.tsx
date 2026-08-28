'use client'

const URL_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
const URL_EXACT_PATTERN = /^(https?:\/\/[^\s]+|www\.[^\s]+)$/i

function normalizeUrl(url: string) {
  return url.startsWith('www.') ? `https://${url}` : url
}

function isInviteUrl(url: string) {
  return /\/zone\/invite\//.test(url)
}

export default function MessageText({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN)

  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (!part) return null
        if (!URL_EXACT_PATTERN.test(part)) {
          return <span key={`${part}-${index}`}>{part}</span>
        }

        const href = normalizeUrl(part)
        const invite = isInviteUrl(href)

        return (
          <a
            key={`${href}-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={
              invite
                ? "mx-0.5 inline-flex items-center rounded-xl bg-cyan-400/10 px-2.5 py-1 text-cyan-300 ring-1 ring-cyan-400/20 transition hover:bg-cyan-400/15"
                : "mx-0.5 inline-flex items-center rounded-xl bg-cyan-400/10 px-2.5 py-1 text-cyan-300 ring-1 ring-cyan-400/20 transition hover:bg-cyan-400/15"
            }
          >
            {invite ? `Invite: ${part}` : part}
          </a>
        )
      })}
    </span>
  )
}
