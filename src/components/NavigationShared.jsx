import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'
import { useNavigationState } from '@/components/NavigationState'

/* Pieces shared by the desktop sidebar and the mobile drawer.
   Both highlight elements are absolutely positioned inside the group's <ul>
   and driven off the active row index from NavigationState. */

const ROW_HEIGHT_REM = 2

export function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-ink-muted no-underline transition hover:text-ink"
      >
        {children}
      </Link>
    </li>
  )
}

export function NavLink({
  href,
  tag,
  active,
  isAnchorLink = false,
  children,
  links,
  isChildren = false,
}) {
  let router = useRouter()
  let indented = isAnchorLink || isChildren

  return (
    <div className="relative">
      <Link
        href={href ?? '#'}
        data-nav-link={active ? 1 : 0}
        aria-current={active ? 'page' : undefined}
        title={typeof children === 'string' ? children : undefined}
        className={clsx(
          'flex justify-between gap-2 py-1 pr-3 text-sm no-underline transition',
          indented ? 'pl-7' : 'pl-4',
          active ? 'text-ink' : 'text-ink-muted hover:text-ink'
        )}
      >
        <span className="truncate">{children}</span>
        {tag && (
          <Tag variant="small" color="neutral">
            {tag}
          </Tag>
        )}
      </Link>

      {links && (
        <ul role="list">
          {links.map((link) => (
            <li key={link.href ?? link.title} className="relative">
              <NavLink
                href={link.href}
                active={link.href === router.pathname}
                isChildren
              >
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* Depth-first walk of a nav tree. `onlyLinks` drops group headers, which have
   no href - used by the footer to build prev/next. */
export function flattenNavItems(links, onlyLinks = false) {
  let output = []
  for (let link of links) {
    output.push(link)
    if (link.links) output.push(...flattenNavItems(link.links, onlyLinks))
  }
  return onlyLinks ? output.filter((link) => link.href) : output
}

/* Shared by both markers: the active row's offset from the top of its group. */
function useActiveRowTop(offsetRem) {
  let router = useRouter()
  let [activeIndex] = useNavigationState()
  let [top, setTop] = useState(0)

  useEffect(() => {
    setTop(remToPx(offsetRem) + activeIndex * remToPx(ROW_HEIGHT_REM))
  }, [activeIndex, offsetRem, router.pathname])

  return { activeIndex, top }
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.2 } },
  exit: { opacity: 0 },
}

/* Soft block behind the row the reader is on. */
export function VisibleSectionHighlight() {
  let { activeIndex, top } = useActiveRowTop(0)
  if (activeIndex < 0) return null

  return (
    <motion.div
      {...fadeIn}
      className="absolute inset-x-0 top-0 rounded-md bg-surface-hover/60 will-change-transform"
      style={{ height: remToPx(ROW_HEIGHT_REM), top }}
    />
  )
}

/* Accent rule marking the current page. */
export function ActivePageMarker() {
  let { activeIndex, top } = useActiveRowTop(0.25)
  if (activeIndex < 0) return null

  return (
    <motion.div
      {...fadeIn}
      className="absolute left-2 h-6 w-px bg-accent"
      style={{ top }}
    />
  )
}
