import Link from 'next/link'
import { useRouter } from 'next/router'

import { Tag } from '@/components/Tag'

/* Section heading with an optional self-link.
 *
 * The link renders inline, immediately after the text, and fades in on hover or
 * keyboard focus. It stays in the flow rather than being positioned out into the
 * margin, so it behaves the same at every breakpoint and needs no measurement.
 */

function HashIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.6 2.2a.75.75 0 0 1 .65.84L6.98 5h2.49l.3-2.16a.75.75 0 1 1 1.49.2L10.98 5h1.77a.75.75 0 0 1 0 1.5h-1.98l-.28 2h1.76a.75.75 0 0 1 0 1.5h-1.97l-.3 2.16a.75.75 0 1 1-1.49-.2L8.77 10H6.28l-.3 2.16a.75.75 0 1 1-1.49-.2L4.77 10H3a.75.75 0 0 1 0-1.5h1.98l.28-2H3.5a.75.75 0 0 1 0-1.5h1.97l.3-2.16a.75.75 0 0 1 .83-.64ZM6.77 6.5l-.28 2h2.49l.28-2H6.77Z" />
    </svg>
  )
}

function Eyebrow({ tag, label }) {
  if (!tag && !label) return null

  return (
    <div className="flex items-center gap-x-3">
      {tag && <Tag>{tag}</Tag>}
      {tag && label && <span className="h-1 w-1 rounded-pill bg-edge-lift" />}
      {label && <span className="font-mono text-2xs text-ink-faint">{label}</span>}
    </div>
  )
}

export function Heading({
  level = 2,
  children,
  id,
  tag,
  label,
  anchor = true,
  ...props
}) {
  let Component = `h${level}`
  let router = useRouter()

  return (
    <>
      <Eyebrow tag={tag} label={label} />
      <Component
        id={anchor ? id : undefined}
        className={clsxScroll(tag || label)}
        {...props}
      >
        {anchor && id ? (
          <span className="group inline-flex items-baseline gap-1.5">
            {children}
            <Link
              href={`${router.pathname}#${id}`}
              aria-label="Link to this section"
              className="text-ink-faint no-underline opacity-0 transition hover:text-accent-text focus:opacity-100 group-hover:opacity-100"
            >
              <HashIcon className="h-3.5 w-3.5" />
            </Link>
          </span>
        ) : (
          children
        )}
      </Component>
    </>
  )
}

/* Headings with an eyebrow need extra scroll offset so the eyebrow is not
   clipped under the sticky header when jumping to an anchor. */
function clsxScroll(hasEyebrow) {
  return hasEyebrow ? 'mt-2 scroll-mt-32' : 'scroll-mt-24'
}
