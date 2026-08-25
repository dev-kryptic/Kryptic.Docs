import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore,
} from '@/components/MobileNavigation'
import { ModeToggle } from '@/components/ModeToggle'

/* Sticky top bar. On large viewports it starts to the right of the sidebar;
   below that it spans the full width and carries the drawer toggle.
   The mobile drawer renders its own copy, which must not draw the bottom rule. */

function TopLevelNavItem({ href, children }) {
  return (
    <li className="m-0 block p-0 text-xs leading-none lg:text-sm">
      <Link
        href={href}
        className="inline-flex items-center rounded-sm border border-transparent px-2 py-1 leading-none text-ink no-underline opacity-70 transition duration-200 hover:border-edge hover:bg-surface-hover hover:opacity-100 lg:px-3 lg:py-2"
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  return (
    <motion.div
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-40 flex h-16 min-h-16 items-center justify-between gap-3 bg-canvas/90 px-5 backdrop-blur-lg transition lg:pointer-events-auto lg:left-72 lg:z-50 lg:px-8 xl:left-80'
      )}
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px border-b transition',
          isInsideMobileNavigation ? 'border-transparent' : 'border-edge'
        )}
      />

      <div className="flex items-center gap-2 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-3 xl:gap-2">
        <nav className="hidden md:block">
          <ul role="list" className="m-0 flex list-none items-center gap-3 p-0 xl:gap-2">
            <TopLevelNavItem href="https://kryptic.dev/">Home</TopLevelNavItem>
            <TopLevelNavItem href="/">Docs</TopLevelNavItem>
            <TopLevelNavItem href="https://kryptic.dev/download">Download</TopLevelNavItem>
            <TopLevelNavItem href="https://kryptic.dev/features">Features</TopLevelNavItem>
            <TopLevelNavItem href="https://kryptic.dev/pricing">Pricing</TopLevelNavItem>
            <TopLevelNavItem href="https://github.com/dev-kryptic">Github</TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-edge" />
        <ModeToggle />
        <div className="hidden min-[416px]:contents">
          <Button href="/get-started" className="!px-3 !py-1.5 text-xs">
            Get started
          </Button>
        </div>
      </div>
    </motion.div>
  )
})
