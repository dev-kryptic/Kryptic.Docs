import Link from 'next/link'
import clsx from 'clsx'

/* Shared button/link. Renders an <a> when given href, a <button> otherwise.
   `primary` picks up an accent glow on hover; the rest are quieter variants. */

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.5 6.5 15 10l-3.5 3.5M14.5 10h-9"
      />
    </svg>
  )
}

const variantStyles = {
  primary:
    'rounded-sm bg-accent text-accent-on hover:bg-accent-deep hover:shadow-glow',
  secondary:
    'rounded-pill bg-surface-raised px-3 py-1 text-ink-muted ring-1 ring-inset ring-edge hover:bg-surface-hover hover:text-ink',
  filled:
    'rounded-pill bg-accent px-3 py-1 text-accent-on hover:bg-accent-deep',
  outline:
    'rounded-pill px-3 py-1 text-ink-muted ring-1 ring-inset ring-edge hover:bg-surface-hover hover:text-ink',
  'outline-arrow':
    'rounded-sm px-3 py-1 text-ink-muted ring-1 ring-inset ring-edge hover:bg-surface-hover hover:text-ink',
  text: 'text-accent-text hover:text-accent-deep',
}

export function Button({
  variant = 'primary',
  className,
  children,
  arrow,
  ...props
}) {
  let Component = props.href ? Link : 'button'

  let arrowIcon = (
    <ArrowIcon
      className={clsx(
        'h-4 w-4',
        arrow === 'left' && '-ml-0.5 rotate-180',
        arrow === 'right' && '-mr-0.5'
      )}
    />
  )

  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium no-underline transition duration-200 lg:px-4 lg:py-2.5',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {arrow === 'left' && arrowIcon}
      {children}
      {arrow === 'right' && arrowIcon}
    </Component>
  )
}
