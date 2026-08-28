'use client'

import { useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@zerozone/lib'

const Picker = lazy(() => import('@emoji-mart/react'))

// emoji-mart mutates `data.categories` (unshifting its own "frequent"
// category) behind an init guard that is checked BEFORE an await — so
// concurrent inits (StrictMode double-mount) can unshift twice into any
// SHARED object, duplicating the section. Hand every init its own fresh
// clone with exactly one frequent entry instead of caching one instance.
async function loadPickerData() {
    const dataModule = await import('@emoji-mart/data')
    const cloned = JSON.parse(JSON.stringify(dataModule.default))
    cloned.categories = cloned.categories.filter(
        (category: { id: string }) => category.id !== 'frequent'
    )
    return cloned
}

function PickerFallback() {
  return (
    <div className="w-72 h-80 bg-background rounded-2xl border border-border flex items-center justify-center">
      <span className="text-muted-foreground text-sm animate-pulse">Loading...</span>
    </div>
  )
}

type EmojiPickerProps = {
  onSelect: (emoji: string) => void
  onClose: () => void
  className?: string
}

export default function EmojiPicker({ onSelect, onClose, className }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node
    if (pickerRef.current && !pickerRef.current.contains(target)) {
      onClose()
    }
  }, [onClose])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClickOutside, handleKeyDown])

  // Portal to <body> so the picker escapes the composer footer's
  // backdrop-blur stacking context and always owns pointer events above
  // the message layer.
  return createPortal(
    <div
      ref={pickerRef}
      className={cn(
        'fixed bottom-[5.5rem] right-4 md:right-8 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-150',
        className
      )}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/90 hover:bg-muted transition-colors shadow-lg border border-border"
          aria-label="Close emoji picker"
        >
          <X className="w-4 h-4" />
        </button>
        
        <Suspense fallback={<PickerFallback />}>
          <Picker
            data={loadPickerData}
            onEmojiSelect={(emoji: { native?: string }) => {
              onSelect(emoji.native ?? '')
              onClose()
            }}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            set="native"
            perLine={8}
            emojiSize={22}
            emojiButtonSize={32}
            initialCategory="people"
            I18n={{
              search: 'Search...',
              categories: {
                activity: 'Activity',
                custom: 'Custom',
                flags: 'Flags',
                foods: 'Food',
                nature: 'Nature',
                objects: 'Objects',
                people: 'Smileys',
                symbols: 'Symbols',
                travel: 'Travel'
              }
            }}
            style={{
              backgroundColor: 'hsl(var(--background) / 1)',
              borderRadius: '14px',
              border: '1px solid hsl(var(--border) / 1)',
              width: '320px'
            }}
          />
        </Suspense>
      </div>
    </div>,
    document.body
  )
}