import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { ModeToggle } from '@/components/ModeToggle'

function TopLevelNavItem({ href, children }) {
  return (
    <li className="block text-[12px] lg:text-[13.5px] m-0 p-0 leading-none">
      <Link
        href={href}
        className="px-2 lg:px-3 py-1 lg:py-2 opacity-60 hover:opacity-100 hover:bg-zinc-900/5 dark:hover:bg-neutral-900/60 hover:border-zinc-900/10 dark:hover:border-neutral-800 border border-transparent rounded-md leading-none transition-all duration-200 text-zinc-900 dark:text-white inline-flex items-center"
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  return (
    <motion.div
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-5 transition h-[64px] lg:left-72 lg:z-50 lg:px-8 xl:left-80 min-h-[64px] lg:pointer-events-auto',
        !isInsideMobileNavigation &&
          'backdrop-blur-lg bg-white/70 dark:bg-[#0a0d0c]/95 lg:left-72 xl:left-80',
        isInsideMobileNavigation &&
          'bg-white/70 dark:bg-[#0a0d0c]/95 backdrop-blur-lg'
      )}
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px transition border-b border-transparent',
          !isInsideMobileNavigation && 'border-zinc-900/10 dark:border-neutral-700/50'
        )}
      />
      <div className="flex items-center gap-2 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-3 xl:gap-2 ml-auto">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-3 xl:gap-2 m-0 p-0 list-none">
            <TopLevelNavItem href="https://kryptic.dev/">Home</TopLevelNavItem>
            <TopLevelNavItem href="/">Docs</TopLevelNavItem>
            <TopLevelNavItem href="https://kryptic.dev/download">Download</TopLevelNavItem>
            <TopLevelNavItem href="https://kryptic.dev/features">Features</TopLevelNavItem>
            <TopLevelNavItem href="https://kryptic.dev/pricing">Pricing</TopLevelNavItem>
            <TopLevelNavItem href="https://github.com/dev-kryptic">Github</TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-neutral-500/20" />
        <div className="flex gap-2">
          <ModeToggle />
        </div>
        <div className="hidden min-[416px]:contents">
          <Button href="/get-started" className="!py-1.5 !px-3 text-xs">
            Get started
          </Button>
        </div>
      </div>
    </motion.div>
  )
})
