import { useState } from 'react'

/* Inline status pill for MDX prose, with an optional hover explanation.
   Tones map onto the semantic signal tokens; unknown statuses fall back to neutral. */

const toneStyles = {
  info: {
    pill: 'bg-signal-blue/10 text-signal-blue',
    border: 'border-signal-blue',
  },
  warning: {
    pill: 'bg-signal-amber/10 text-signal-amber',
    border: 'border-signal-amber',
  },
  error: {
    pill: 'bg-signal-red/10 text-signal-red',
    border: 'border-signal-red',
  },
  'cloud-only': {
    pill: 'bg-accent/10 text-accent-text',
    border: 'border-accent',
  },
  experimental: {
    pill: 'bg-signal-violet/10 text-signal-violet',
    border: 'border-signal-violet',
  },
  neutral: {
    pill: 'bg-surface-raised text-ink-muted',
    border: 'border-edge-lift',
  },
}

export function Badge({ status, text, hoverText }) {
  let [isHovered, setIsHovered] = useState(false)
  let tone = toneStyles[status] ?? toneStyles.neutral

  return (
    <span
      className={`relative inline-block rounded-sm px-2 py-0.5 text-sm ${tone.pill}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      {hoverText && isHovered && (
        <span
          role="tooltip"
          className={`absolute left-1/2 z-10 mt-2 w-max max-w-xs -translate-x-1/2 whitespace-pre-line rounded-md border bg-surface p-3 shadow-panel backdrop-blur-md ${tone.border} ${tone.pill}`}
        >
          {hoverText}
        </span>
      )}
    </span>
  )
}
