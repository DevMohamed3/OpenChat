'use client'

// ZeroZone branded loading indicator: the product mark inside a thin
// spinning ring. Used for full-surface loads so waiting feels on-brand
// instead of generic.
export default function ZeroLoader({ size = 48 }: { size?: number }) {
    return (
        <div
            className="relative"
            style={{ width: size, height: size }}
            role="status"
            aria-label="Loading"
        >
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/iconX2.png"
                alt=""
                className="absolute inset-0 m-auto w-[42%] h-[42%] object-contain opacity-90 select-none pointer-events-none"
            />
        </div>
    )
}
