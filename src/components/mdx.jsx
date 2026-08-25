import Link from 'next/link'
import clsx from 'clsx'

import { Heading } from '@/components/Heading'
import { YouTube } from '@/components/YouTube'

/* Components made available to every MDX page via MDXProvider in _app.jsx.
   Anything exported here can be used in a .mdx file without importing it. */

export const a = Link
export { Button } from '@/components/Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'
export { Badge } from '@/components/Badge'
export { YouTube }

export const h2 = function H2(props) {
  return <Heading level={2} {...props} />
}

export const h3 = function H3(props) {
  return <Heading level={3} {...props} />
}

export const h4 = function H4(props) {
  return <Heading level={4} {...props} />
}

export const h5 = function H5(props) {
  return <Heading level={5} {...props} />
}

/* ---------------------------------------------------------------- callouts */

function CalloutIcon({ tone, ...props }) {
  if (tone === 'warning') {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
        <path
          d="M8 2.75 14 13.25H2L8 2.75Z"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 6.75v2.5" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.25" r=".75" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tone === 'success') {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
        <circle cx="8" cy="8" r="6.25" strokeWidth="1.5" />
        <path
          d="m5.25 8.25 2 2 3.5-4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="6.25" strokeWidth="1.5" />
      <path d="M8 7.25v4" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.75" r=".75" fill="currentColor" stroke="none" />
    </svg>
  )
}

const calloutTones = {
  note: 'border-accent/25 bg-accent/5 text-ink [--tw-prose-links:var(--accent-ink)]',
  warning: 'border-signal-red/25 bg-signal-red/5 text-ink [--tw-prose-links:var(--red)]',
  success: 'border-accent/25 bg-accent/5 text-ink [--tw-prose-links:var(--accent-ink)]',
}

const calloutIconTones = {
  note: 'text-accent-text',
  warning: 'text-signal-red',
  success: 'text-accent-text',
}

function Callout({ tone, children }) {
  return (
    <div
      className={clsx(
        'my-6 flex gap-2.5 rounded-md border p-4 leading-6',
        calloutTones[tone]
      )}
    >
      <CalloutIcon
        tone={tone}
        className={clsx('mt-1 h-4 w-4 flex-none stroke-current', calloutIconTones[tone])}
      />
      <div className="min-w-0 flex-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Note({ children }) {
  return <Callout tone="note">{children}</Callout>
}

export function Warning({ children }) {
  return <Callout tone="warning">{children}</Callout>
}

export function Success({ children }) {
  return <Callout tone="success">{children}</Callout>
}

/* ------------------------------------------------------------------ layout */

export function Row({ children }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({ children, sticky = false }) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24'
      )}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------- properties */

export function Properties({ children }) {
  return (
    <div className="my-6">
      <ul role="list" className="m-0 list-none divide-y divide-edge-soft p-0">
        {children}
      </ul>
    </div>
  )
}

/* Renders the accepted range for a property, when one is declared.
   `min`/`max` are numeric bounds; `minLen`/`maxLen` are length bounds, whose
   unit depends on whether the property is a string or a collection. */
function ConstraintList({ type, min, max, minLen, maxLen, enumList }) {
  let unit = type === 'string' ? 'characters' : 'objects'
  let bounds = []

  if (min !== undefined) bounds.push(`>=${min}`)
  if (max !== undefined) bounds.push(`<=${max}`)
  if (minLen !== undefined) bounds.push(`>=${minLen} ${unit}`)
  if (maxLen !== undefined) bounds.push(`<=${maxLen} ${unit}`)
  if (enumList) bounds.push(...String(enumList).split(',').map((v) => v.trim()))

  if (bounds.length === 0) return null

  return (
    <div>
      <strong>Possible values: </strong>
      {bounds.map((bound, index) => (
        <span key={bound}>
          {index > 0 && <span> and </span>}
          <code className="bg-accent/10 text-accent-text">{bound}</code>
        </span>
      ))}
    </div>
  )
}

export function Property({ name, type, required, children, ...constraints }) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>

        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-2xs text-ink-faint">{type}</dd>

        <dt className="sr-only">Required</dt>
        <dd
          className={clsx(
            'font-mono text-2xs',
            required ? 'text-signal-red' : 'text-ink-faint'
          )}
        >
          {required ? 'required' : 'optional'}
        </dd>

        <dt className="sr-only">Accepted values</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          <ConstraintList type={type} {...constraints} />
        </dd>

        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}
