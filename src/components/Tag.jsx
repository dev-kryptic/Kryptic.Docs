import clsx from 'clsx'

/* Small monospace label used for HTTP verbs and heading eyebrows.
   Colours come from the design tokens; see src/styles/kryptic-tokens.css. */

const toneStyles = {
  accent: {
    small: 'text-accent-text',
    medium: 'bg-accent/10 text-accent-text ring-accent/30',
  },
  amber: {
    small: 'text-signal-amber',
    medium: 'bg-signal-amber/10 text-signal-amber ring-signal-amber/30',
  },
  red: {
    small: 'text-signal-red',
    medium: 'bg-signal-red/10 text-signal-red ring-signal-red/30',
  },
  blue: {
    small: 'text-signal-blue',
    medium: 'bg-signal-blue/10 text-signal-blue ring-signal-blue/30',
  },
  neutral: {
    small: 'text-ink-faint',
    medium: 'bg-surface-raised text-ink-muted ring-edge',
  },
}

/* Legacy tone names kept resolving so older call sites do not silently
   fall through to the default. Prefer the semantic names above. */
toneStyles.emerald = toneStyles.accent
toneStyles.kryptic = toneStyles.accent
toneStyles.rose = toneStyles.red
toneStyles.zinc = toneStyles.neutral

/* Verb -> tone. Anything unlisted falls back to `blue`. */
const verbTones = {
  get: 'blue',
  post: 'accent',
  put: 'amber',
  patch: 'amber',
  delete: 'red',
}

export function Tag({ children, variant = 'medium', color }) {
  let label = typeof children === 'string' ? children : ''
  let tone = color ?? verbTones[label.toLowerCase()] ?? 'blue'
  let styles = toneStyles[tone] ?? toneStyles.blue

  return (
    <span
      className={clsx(
        'font-mono text-2xs font-semibold uppercase leading-6 tracking-wide',
        variant === 'medium' && 'rounded-sm px-1.5 ring-1 ring-inset',
        styles[variant]
      )}
    >
      {children}
    </span>
  )
}
