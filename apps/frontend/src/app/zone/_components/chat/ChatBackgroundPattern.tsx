'use client'

/**
 * Seamless, organically scattered outline-icon wallpaper built from
 * ZeroZone's own communication vocabulary (bubbles, @, #, mic, nodes...).
 * One 420x420 tile repeats via SVG <pattern>, fixed to the chat viewport.
 */

// Uniform visibility: one shared opacity level across all icons; purple/cyan
// alphas are perceptually normalized so accents match slate instead of popping.
const SLATE_SOFT = 'rgba(148, 163, 184, 0.055)'
const SLATE = 'rgba(148, 163, 184, 0.055)'
const PURPLE = 'rgba(167, 139, 250, 0.06)'
const CYAN = 'rgba(103, 232, 249, 0.048)'

type Tone = typeof SLATE_SOFT | typeof SLATE | typeof PURPLE | typeof CYAN
type Key =
    | 'bubble' | 'dots' | 'zero' | 'at' | 'hash' | 'mic' | 'phones'
    | 'phone' | 'bell' | 'lock' | 'link' | 'heart' | 'sparkle'
    | 'bolt' | 'user' | 'video' | 'plus' | 'gear' | 'node'
    | 'rings' | 'diamond'

const SYMBOLS: Record<Key, (c: string) => React.JSX.Element> = {
    bubble: () => (
        <path d="M -6 -9 H 6 A 3 3 0 0 1 9 -6 V 3 A 3 3 0 0 1 6 6 H -1 L -5.5 10.5 V 6 H -6 A 3 3 0 0 1 -9 3 V -6 A 3 3 0 0 1 -6 -9 Z" />
    ),
    dots: (c) => (
        <>
            <path d="M -5.4 -8.1 H 5.4 A 2.7 2.7 0 0 1 8.1 -5.4 V 2.7 A 2.7 2.7 0 0 1 5.4 5.4 H -0.9 L -5 9.5 V 5.4 H -5.4 A 2.7 2.7 0 0 1 -8.1 2.7 V -5.4 A 2.7 2.7 0 0 1 -5.4 -8.1 Z" />
            <circle cx="-3.6" cy="-1.4" r="1" fill={c} stroke="none" />
            <circle cx="0" cy="-1.4" r="1" fill={c} stroke="none" />
            <circle cx="3.6" cy="-1.4" r="1" fill={c} stroke="none" />
        </>
    ),
    zero: () => (
        <>
            <ellipse cx="0" cy="0" rx="5.5" ry="7.5" />
            <ellipse cx="0" cy="0" rx="2" ry="4.2" />
        </>
    ),
    at: () => (
        <>
            <circle cx="-0.8" cy="0" r="2.8" />
            <path d="M 6.2 0 V 2 A 2.2 2.2 0 0 0 10.6 2 V 0 A 7 7 0 1 0 7.7 5.7" />
        </>
    ),
    hash: () => (
        <path d="M -3 -9 L -4 9 M 4 -9 L 3 9 M -8.5 -3 L 8.5 -3 M -8.5 3 L 8.5 3" />
    ),
    mic: () => (
        <>
            <rect x="-3" y="-9" width="6" height="11" rx="3" />
            <path d="M -6.5 -2 A 6.5 6.5 0 0 0 6.5 -2 M 0 4.5 V 8 M -3.5 8 H 3.5" />
        </>
    ),
    phones: () => (
        <>
            <path d="M -8 4 V -1 A 8 8 0 0 1 8 -1 V 4" />
            <rect x="-9.8" y="-0.5" width="3.6" height="6.5" rx="1.6" />
            <rect x="6.2" y="-0.5" width="3.6" height="6.5" rx="1.6" />
        </>
    ),
    phone: () => (
        <path d="M -7.5 -6.5 C -7.5 -7.6 -6.6 -8.5 -5.5 -8.5 H -3.8 C -2.9 -8.5 -2.1 -7.9 -1.9 -7 L -1.2 -4 C -1 -3.2 -1.3 -2.4 -1.9 -1.9 L -3 -1 C -2 1 -1 2 1 3 L 1.9 1.9 C 2.4 1.3 3.2 1 4 1.2 L 7 1.9 C 7.9 2.1 8.5 2.9 8.5 3.8 V 5.5 C 8.5 6.6 7.6 7.5 6.5 7.5 C -2.2 7 -7 2.2 -7.5 -6.5 Z" />
    ),
    bell: (c) => (
        <>
            <path d="M -6.5 3.5 C -6.5 -0.5 -5.5 -7.5 0 -7.5 C 5.5 -7.5 6.5 -0.5 6.5 3.5 H -6.5 Z" />
            <path d="M 0 -7.5 V -9.5" />
            <circle cx="0" cy="6" r="1.4" fill={c} stroke="none" />
        </>
    ),
    lock: () => (
        <>
            <rect x="-6" y="-1" width="12" height="10" rx="2" />
            <path d="M -4 -1 V -4 A 4 4 0 0 1 4 -4 V -1" />
        </>
    ),
    link: () => (
        <path d="M -2 2 L 2 -2 M -1 -4.5 L 1.5 -7 A 3.5 3.5 0 0 1 6.5 -2 L 4 0.5 M 1 4.5 L -1.5 7 A 3.5 3.5 0 0 1 -6.5 2 L -4 -0.5" />
    ),
    heart: () => (
        <path d="M 0 8 C -8 2.5 -9 -2 -6.5 -5 C -4.5 -7.3 -1.2 -7 0 -4.5 C 1.2 -7 4.5 -7.3 6.5 -5 C 9 -2 8 2.5 0 8 Z" />
    ),
    sparkle: () => (
        <path d="M 0 -8 C 0.8 -3 3 -0.8 8 0 C 3 0.8 0.8 3 0 8 C -0.8 3 -3 0.8 -8 0 C -3 -0.8 -0.8 -3 0 -8 Z" />
    ),
    bolt: () => (
        <path d="M 2 -9 L -5 1 H -0.5 L -2 9 L 5 -1 H 0.5 Z" />
    ),
    user: () => (
        <>
            <circle cx="0" cy="-3.5" r="3.5" />
            <path d="M -7 8 A 7 5.5 0 0 1 7 8" />
        </>
    ),
    video: () => (
        <>
            <rect x="-9" y="-5.5" width="12" height="11" rx="3" />
            <path d="M 3 -1.5 L 9 -5 V 5 L 3 1.5" />
        </>
    ),
    plus: () => <path d="M -7 0 H 7 M 0 -7 V 7" />,
    gear: () => (
        <>
            <circle cx="0" cy="0" r="3.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                    key={a}
                    x1={6 * Math.cos((a * Math.PI) / 180)}
                    y1={6 * Math.sin((a * Math.PI) / 180)}
                    x2={8.5 * Math.cos((a * Math.PI) / 180)}
                    y2={8.5 * Math.sin((a * Math.PI) / 180)}
                />
            ))}
        </>
    ),
    node: () => (
        <>
            <circle cx="0" cy="-2.5" r="3" />
            <path d="M -1.8 0.2 L -5 4.5 M 1.8 0.2 L 5 4.5" />
            <circle cx="-5.8" cy="6" r="1.8" />
            <circle cx="5.8" cy="6" r="1.8" />
        </>
    ),
    rings: () => (
        <>
            <circle cx="0" cy="0" r="7.5" />
            <circle cx="0" cy="0" r="4" />
        </>
    ),
    diamond: () => <path d="M 0 -7 L 7 0 L 0 7 L -7 0 Z" />,
}

type Instance = {
    k: Key
    x: number
    y: number
    r?: number
    s?: number
    t?: Tone
}

// Hand-scattered across the 420x420 tile — no rows, no columns.
// Entries past the tile edge have a wrapped twin so tiling stays seamless.
const INSTANCES: Instance[] = [
    // Wrapped edge pairs
    { k: 'bubble', x: -14, y: 96, r: -12 },
    { k: 'bubble', x: 406, y: 96, r: -12 },
    { k: 'sparkle', x: 210, y: -14, s: 0.8, r: 15 },
    { k: 'sparkle', x: 210, y: 406, s: 0.8, r: 15 },
    { k: 'user', x: 338, y: -12, t: CYAN },
    { k: 'user', x: 338, y: 408, t: CYAN },
    { k: 'hash', x: 12, y: 300, r: 4, t: CYAN },
    { k: 'hash', x: 432, y: 300, r: 4, t: CYAN },
    { k: 'mic', x: -16, y: 330, r: -14, s: 0.8 },
    { k: 'mic', x: 404, y: 330, r: -14, s: 0.8 },

    // Upper band
    { k: 'bubble', x: 48, y: 42 },
    { k: 'dots', x: 150, y: 28, r: 10, s: 0.85, t: SLATE_SOFT },
    { k: 'at', x: 262, y: 60, r: -5, s: 1.1, t: PURPLE },
    { k: 'rings', x: 388, y: 60, t: CYAN },

    // Upper-middle band (with one subtle overlap pair)
    { k: 'hash', x: 70, y: 120, r: 4 },
    { k: 'mic', x: 196, y: 132, r: -14, s: 0.8, t: SLATE_SOFT },
    { k: 'heart', x: 300, y: 110, r: 12, s: 0.75 },
    { k: 'plus', x: 246, y: 172, r: 45, s: 0.6 },
    { k: 'dots', x: 258, y: 182, s: 0.8 },
    { k: 'diamond', x: 108, y: 168, r: 20, s: 0.7, t: PURPLE },
    { k: 'node', x: 30, y: 222, r: -10, s: 0.9 },
    { k: 'user', x: 122, y: 210, r: 6, s: 1.05 },
    { k: 'zero', x: 356, y: 150, r: 8, s: 0.9, t: SLATE_SOFT },

    // Middle band
    { k: 'lock', x: 232, y: 240, r: -6, s: 0.85, t: PURPLE },
    { k: 'sparkle', x: 330, y: 262, r: -18, s: 0.7, t: CYAN },
    { k: 'bolt', x: 60, y: 322, r: 10, s: 0.8 },
    { k: 'at', x: 162, y: 332, r: 8, t: PURPLE },
    { k: 'gear', x: 268, y: 320, r: -4, s: 0.95 },
    { k: 'video', x: 372, y: 342, r: 6, s: 0.85, t: PURPLE },
    { k: 'rings', x: 34, y: 152, s: 0.8, t: SLATE_SOFT },
    { k: 'phone', x: 296, y: 176, r: -8, s: 0.9 },

    // Lower band (with one subtle overlap pair)
    { k: 'zero', x: 90, y: 392, r: -6, s: 0.75, t: PURPLE },
    { k: 'bubble', x: 206, y: 398, r: 7, s: 0.9 },
    { k: 'link', x: 312, y: 400, r: -12, s: 0.85 },
    { k: 'bell', x: 140, y: 268, r: -6, s: 0.85, t: SLATE_SOFT },
    { k: 'phone', x: 350, y: 30, r: 14, s: 0.8 },
    { k: 'phones', x: 58, y: 62, r: 8, s: 0.85, t: CYAN },
]

// Dense undergrowth: a seeded generator interleaves smaller icons between
// the hand-placed instances above so coverage reads as continuous wallpaper.
// Deterministic seed => identical server/client markup, stable forever.
function mulberry32(seed: number) {
    let a = seed
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const TILE = 420

const WEIGHTED_KEYS: [Key, number][] = [
    ['bubble', 3], ['dots', 2], ['zero', 3], ['at', 3], ['hash', 2],
    ['sparkle', 3], ['rings', 2], ['plus', 2], ['diamond', 2], ['user', 2],
    ['node', 2], ['heart', 1], ['mic', 1], ['bell', 1], ['lock', 1],
    ['link', 1], ['bolt', 1], ['phone', 1], ['phones', 1], ['video', 1],
    ['gear', 1],
]
const WEIGHT_TOTAL = WEIGHTED_KEYS.reduce((n, [, w]) => n + w, 0)

function pickKey(rnd: () => number): Key {
    let roll = rnd() * WEIGHT_TOTAL
    for (const [k, w] of WEIGHTED_KEYS) {
        roll -= w
        if (roll <= 0) return k
    }
    return 'bubble'
}

function toroidalDistance(ax: number, ay: number, bx: number, by: number) {
    const dx = Math.abs(ax - bx)
    const dy = Math.abs(ay - by)
    return Math.hypot(Math.min(dx, TILE - dx), Math.min(dy, TILE - dy))
}

const TARGET_FILLS = 96

function buildFillers(): Instance[] {
    const rnd = mulberry32(0x7e10)
    const result: Instance[] = []
    const bases: { x: number; y: number; min: number }[] = INSTANCES.map((p) => ({
        x: p.x,
        y: p.y,
        min: 18,
    }))
    let attempts = 0
    while (result.length < TARGET_FILLS && attempts < 6000) {
        attempts += 1
        const x = rnd() * TILE
        const y = rnd() * TILE
        const s = 0.55 + rnd() * 0.5
        if (
            !bases.every(
                (b) =>
                    toroidalDistance(x, y, ((b.x % TILE) + TILE) % TILE, ((b.y % TILE) + TILE) % TILE) >= b.min,
            )
        ) {
            continue
        }
        const rr = rnd()
        const t = rr < 0.76 ? SLATE_SOFT : rr < 0.88 ? SLATE : rr < 0.94 ? PURPLE : CYAN
        const inst: Instance = {
            k: pickKey(rnd),
            x,
            y,
            r: Math.round(rnd() * 32 - 16),
            s,
            t,
        }
        result.push(inst)
        bases.push({ x, y, min: 16 })

        // Wrap copies across any crossed tile edges so tiling stays seamless
        const pad = 12 * s
        const xs = [x]
        if (x < pad) xs.push(x + TILE)
        else if (x > TILE - pad) xs.push(x - TILE)
        const ys = [y]
        if (y < pad) ys.push(y + TILE)
        else if (y > TILE - pad) ys.push(y - TILE)
        for (let xi = xs.length === 1 ? 0 : 1; xi < xs.length; xi++) {
            result.push({ ...inst, x: xs[xi] })
        }
        for (let yi = ys.length === 1 ? 0 : 1; yi < ys.length; yi++) {
            result.push({ ...inst, y: ys[yi] })
        }
        if (xs.length === 2 && ys.length === 2) {
            result.push({ ...inst, x: xs[1], y: ys[1] })
        }
    }
    return result
}

const FILL_INSTANCES = buildFillers()
const ALL_INSTANCES = [...INSTANCES, ...FILL_INSTANCES]

export function ChatBackgroundPattern() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        >
            <svg className="h-full w-full">
                <defs>
                    <pattern
                        id="zz-chat-pattern"
                        width="420"
                        height="420"
                        patternUnits="userSpaceOnUse"
                    >
                        {ALL_INSTANCES.map((ins, i) => {
                            const c = ins.t ?? SLATE
                            return (
                                <g
                                    key={i}
                                    transform={`translate(${ins.x} ${ins.y}) rotate(${ins.r ?? 0}) scale(${ins.s ?? 1})`}
                                    fill="none"
                                    stroke={c}
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {SYMBOLS[ins.k](c)}
                                </g>
                            )
                        })}
                    </pattern>
                    <radialGradient id="zz-glow-purple" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.03)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                    </radialGradient>
                    <radialGradient id="zz-glow-cyan" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.022)" />
                        <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
                    </radialGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#zz-chat-pattern)" />

                {/* Ambient identity lighting above the weave */}
                <ellipse cx="42%" cy="36%" rx="420" ry="360" fill="url(#zz-glow-purple)" />
                <ellipse cx="62%" cy="66%" rx="440" ry="380" fill="url(#zz-glow-cyan)" />
            </svg>
        </div>
    )
}
