import clsx from 'clsx'

export function Logo(props) {
  return (
    <div className={clsx('flex items-center gap-2.5', props.className)}>
      <img
        src="/logo.png"
        alt="Kryptic"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
      />
      <span className="font-display text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
        Kryptic Docs
      </span>
    </div>
  )
}
