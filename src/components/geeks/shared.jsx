import clsx from 'clsx'

export function GeekPanel({ children, className }) {
  return (
    <div
      className={clsx(
        'not-prose my-8 overflow-hidden rounded-xl bg-surface/70 shadow-panel ring-1 ring-inset ring-edge',
        className
      )}
    >
      {children}
    </div>
  )
}

export function GeekToolbar({ eyebrow, title, hint }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-edge-soft px-4 py-3 sm:px-5">
      <div>
        {eyebrow && (
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-accent-text">
            {eyebrow}
          </p>
        )}
        {title && (
          <p className="mt-0.5 font-display text-sm font-semibold text-ink">{title}</p>
        )}
      </div>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  )
}

export function GeekNode({ active, tone = 'client', onClick, label, sub, icon }) {
  const tones = {
    client:
      active
        ? 'border-accent/45 bg-accent/10 shadow-glow'
        : 'border-edge bg-surface hover:border-edge-lift hover:bg-surface-hover',
    store:
      active
        ? 'border-signal-blue/45 bg-signal-blue/10'
        : 'border-edge bg-surface hover:border-edge-lift hover:bg-surface-hover',
    key:
      active
        ? 'border-signal-violet/45 bg-signal-violet/10'
        : 'border-edge bg-surface hover:border-edge-lift hover:bg-surface-hover',
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'w-full rounded-lg border px-3 py-2.5 text-left transition duration-200',
        tones[tone]
      )}
    >
      <span className="flex items-start gap-2.5">
        {icon && (
          <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            {icon}
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-display text-sm font-semibold text-ink">{label}</span>
          {sub && <span className="mt-0.5 block text-xs text-ink-muted">{sub}</span>}
        </span>
      </span>
    </button>
  )
}

export function GeekDetail({ title, children }) {
  return (
    <div className="border-t border-edge-soft bg-canvas/40 px-4 py-4 sm:px-5">
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      <div className="mt-2 space-y-2 text-sm leading-6 text-ink-muted [&_code]:rounded [&_code]:bg-canvas [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-ink">
        {children}
      </div>
    </div>
  )
}

export function GeekChip({ children, tone = 'accent' }) {
  const tones = {
    accent: 'bg-accent/10 text-accent-text ring-accent/20',
    blue: 'bg-signal-blue/10 text-signal-blue ring-signal-blue/20',
    violet: 'bg-signal-violet/10 text-signal-violet ring-signal-violet/20',
    amber: 'bg-signal-amber/10 text-signal-amber ring-signal-amber/20',
    red: 'bg-signal-red/10 text-signal-red ring-signal-red/20',
    mute: 'bg-surface-raised text-ink-muted ring-edge',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-pill px-2 py-0.5 font-mono text-2xs ring-1 ring-inset',
        tones[tone]
      )}
    >
      {children}
    </span>
  )
}
