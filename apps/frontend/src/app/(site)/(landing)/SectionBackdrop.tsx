/**
 * SectionBackdrop — the landing page's background lighting system.
 *
 * ONE visual environment: a near-black canvas with slowly evolving
 * atmospheric lighting (violet primary, blue/cyan support), enormous
 * thin-stroke circular geometry, and sparse static stars. Variants only
 * change position/intensity/scale of the same ingredients — never the
 * language itself. The `cta` variant is the strongest expression and the
 * reference for everything else.
 *
 * Pure CSS layers (gradients, borders). No images, no canvas, no animation,
 * so prefers-reduced-motion is respected by design and the cost is one
 * composited layer per section.
 *
 * Place as the first child of a `relative overflow-hidden` section; content
 * wrappers keep `relative z-10` so everything stays behind the UI. Rings are
 * oversized on purpose — the section's overflow-hidden clips them, which
 * also keeps mobile free of horizontal scroll.
 */

function Ring({
    size,
    className = '',
    style,
}: {
    size: number
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${className}`}
            style={{ width: size, height: size, ...style }}
        />
    )
}

export function SectionBackdrop({
    variant,
}: {
    variant:
        | 'hero'
        | 'dark'
        | 'product'
        | 'orbit'
        | 'cta'
        | 'minimal'
        | 'footer'
}) {
    return (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {variant === 'hero' && (
                <>
                    {/* Central atmospheric glow behind the headline */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(139,92,246,0.08),transparent_70%)]" />
                    {/* Base washes */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(120,80,255,0.07),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_25%_at_12%_100%,rgba(34,211,238,0.04),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_25%_at_88%_100%,rgba(59,130,246,0.05),transparent)]" />
                    {/* Enormous barely-visible geometry, echoing the CTA ring */}
                    <Ring size={1150} className="border-white/[0.03]" style={{ top: '42%' }} />
                    <Ring size={780} className="border-violet-300/[0.05]" style={{ top: '42%' }} />
                    <div className="star-field absolute inset-0 opacity-50" />
                </>
            )}

            {variant === 'dark' && (
                <>
                    {/* Darker band so Features feels like a descent — edges stay
                        transparent so adjacent sections blend seamlessly */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,4,10,0.5)_18%,rgba(2,4,10,0.5)_82%,transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_55%,rgba(120,80,255,0.04),transparent)]" />
                    {/* One huge quiet circle drifting off-canvas */}
                    <Ring size={1400} className="border-white/[0.03]" style={{ left: '22%' }} />
                </>
            )}

            {variant === 'product' && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_85%_0%,rgba(59,130,246,0.05),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_10%_100%,rgba(34,211,238,0.04),transparent)]" />
                    {/* Directional arc supporting the lighting */}
                    <Ring size={1050} className="border-white/[0.03]" style={{ left: '78%', top: '60%' }} />
                </>
            )}

            {variant === 'orbit' && (
                <>
                    {/* Concentric arcs echoing the Zone "zero" identity —
                        enormous, thin, mostly outside the viewport */}
                    <Ring size={760} className="border-white/[0.05]" />
                    <Ring size={1180} className="border-violet-300/[0.05]" />
                    <Ring size={1600} className="border-cyan-200/[0.04]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_45%_at_50%_55%,rgba(120,80,255,0.05),transparent)]" />
                </>
            )}

            {variant === 'cta' && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_58%,rgba(139,92,246,0.14),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_35%_at_50%_100%,rgba(37,99,235,0.1),transparent_70%)]" />
                    <div className="star-field absolute inset-0 opacity-50" />
                    <Ring size={920} />
                </>
            )}

            {variant === 'minimal' && (
                /* Quiet valley between Architecture and CTA — symmetric so it
                   never reads as a seam */
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.45)_25%,rgba(2,6,23,0.45)_75%,transparent)]" />
            )}

            {variant === 'footer' && (
                <>
                    {/* Direct continuation of the CTA's lower atmosphere —
                        mirrors its bottom glows so there is no perceivable
                        boundary where the two sections meet */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(37,99,235,0.08),transparent_65%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,rgba(139,92,246,0.05),transparent_60%)]" />
                    {/* Slow dissolve into near-black by the page end */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,4,10,0.55)_45%,rgba(1,3,8,0.75))]" />
                </>
            )}
        </div>
    )
}
