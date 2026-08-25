import { useCallback } from 'react'
import Link from 'next/link'

import { Heading } from '@/components/Heading'

/**
 * Grid of link tiles.
 *
 * Each tile lifts on hover and picks up an accent-tinted glow that follows the
 * cursor. The glow is a single radial-gradient layer positioned from two CSS
 * custom properties written on pointer move, so no per-tile React state or
 * animation library is involved.
 *
 * @param {string} [title] - Heading above the grid
 * @param {string} [id] - Anchor id for the heading
 * @param {string} [description] - Intro line below the title
 * @param {Array<{href: string, name: string, description: string}>} items
 */
function Tile({ item }) {
  // Written straight to the node: this fires on every pointer move, and going
  // through state would re-render the tile each frame for a purely visual effect.
  let onPointerMove = useCallback((event) => {
    let bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tile-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--tile-y', `${event.clientY - bounds.top}px`)
  }, [])

  return (
    <div
      onPointerMove={onPointerMove}
      className="tile group relative rounded-xl bg-surface/60 ring-1 ring-inset ring-edge transition duration-300 hover:bg-surface hover:ring-edge-lift hover:shadow-panel"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--tile-x, 50%) var(--tile-y, 0), var(--accent-dim), transparent 70%)',
        }}
      />
      <div className="relative px-4 py-4">
        <h3 className="font-display text-sm font-semibold leading-7 text-ink">
          <Link href={item.href} className="no-underline">
            <span className="absolute inset-0 rounded-xl" />
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
      </div>
    </div>
  )
}

export function Tiles({ title, id, description, items }) {
  let hasHeader = Boolean(title || description)

  return (
    <div className="my-16 xl:max-w-none">
      {title && (
        <Heading level={2} id={id} anchor={Boolean(id)}>
          {title}
        </Heading>
      )}
      {description && (
        <div className={`text-sm text-ink-muted ${title ? 'mt-4' : ''}`}>
          {description}
        </div>
      )}
      <div
        className={`not-prose grid grid-cols-1 gap-8 sm:grid-cols-2 ${
          hasHeader ? 'mt-4 border-t border-edge-soft pt-10' : ''
        }`}
      >
        {items.map((item) => (
          <Tile key={item.href} item={item} />
        ))}
      </div>
    </div>
  )
}
