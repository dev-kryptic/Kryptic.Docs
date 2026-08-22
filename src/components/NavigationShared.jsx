import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'
import { useNavigationState } from '@/components/NavigationState'

export function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
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

  return (
    <div className="relative">
      <Link
        href={href ? href : '#'}
        data-nav-link={active ? 1 : 0}
        aria-current={active ? 'page' : undefined}
        title={children}
        className={clsx(
          'flex justify-between gap-2 py-1 pr-3 text-sm transition',
          isAnchorLink ? 'pl-7' : 'pl-4',
          active
            ? 'text-zinc-900 dark:text-white'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
          isChildren ? 'pl-7' : 'pl-4'
        )}
      >
        <span className="truncate">{children}</span>
        {tag && (
          <Tag variant="small" color="zinc">
            {tag}
          </Tag>
        )}
      </Link>

      {links && (
        <ul role="list">
          {links.map((link, index) => (
            <motion.li key={index} className="relative">
              <NavLink
                href={link.href}
                active={link.href === router.pathname}
                isChildren={true}
              >
                {link.title}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function flattenNavItems(links, onlyLinks = false) {
  let output = []
  for (let link of links) {
    output.push(link)
    if (link.links) output.push(...flattenNavItems(link.links, onlyLinks))
  }
  if (onlyLinks) output = output.filter((link) => link.href)
  return output
}

export function VisibleSectionHighlight() {
  const router = useRouter()
  let height = remToPx(2)
  let offset = remToPx(0)
  const [activeIndex] = useNavigationState()
  const [top, setTop] = useState(0)

  useEffect(() => {
    setTop(offset + activeIndex * height)
  }, [activeIndex, router.pathname])

  return (
    activeIndex >= 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0 }}
        className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
        style={{ borderRadius: 8, height, top }}
      />
    )
  )
}

export function ActivePageMarker() {
  const router = useRouter()
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  const [activeIndex] = useNavigationState()
  const [top, setTop] = useState(0)

  useEffect(() => {
    setTop(offset + activeIndex * itemHeight)
  }, [activeIndex, router.pathname])

  return (
    activeIndex >= 0 && (
      <motion.div
        className="absolute left-2 h-6 w-px bg-kryptic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0 }}
        style={{ top }}
      />
    )
  )
}
