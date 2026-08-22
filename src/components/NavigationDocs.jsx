import { useRouter } from 'next/router'
import clsx from 'clsx'
import {
  ActivePageMarker,
  NavLink,
  TopLevelNavItem,
  VisibleSectionHighlight,
} from '@/components/NavigationShared'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/mdx'
import { useEffect, useState } from 'react'
import {
  NavigationStateProvider,
  useNavigationState,
} from '@/components/NavigationState'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'

export const docsNavigation = [
  {
    title: 'INTRODUCTION',
    links: [
      { title: 'Overview', href: '/' },
      { title: 'Quickstart', href: '/get-started' },
    ],
  },
  {
    title: 'PACKAGES',
    links: [
      { title: 'Node.js', href: '/packages/node' },
      { title: '.NET', href: '/packages/dotnet' },
      { title: 'Python', href: '/packages/python' },
      { title: 'Java', href: '/packages/java' },
      { title: 'Go', href: '/packages/go' },
      { title: 'Ruby', href: '/packages/ruby' },
      { title: 'C++', href: '/packages/cpp' },
    ],
  },
  {
    title: 'USING KRYPTIC',
    links: [
      { title: 'The dashboard', href: '/dashboard' },
      { title: 'Access control', href: '/access-control' },
      { title: 'Machine identities', href: '/machine-identities' },
      { title: 'Secret scanning', href: '/scanning' },
    ],
  },
  {
    title: 'REFERENCE',
    links: [
      { title: 'CLI', href: '/cli' },
      { title: 'Configuration', href: '/configuration' },
      { title: 'REST API v1', href: '/rest-api' },
    ],
  },
  {
    title: 'PLATFORM',
    links: [
      { title: 'Self-hosting', href: '/self-hosting' },
      { title: 'Kubernetes operator', href: '/kubernetes' },
    ],
  },
  {
    title: 'ENTERPRISE',
    links: [
      { title: 'SAML 2.0 SSO', href: '/enterprise/saml' },
      { title: 'Set up Okta', href: '/enterprise/okta' },
      { title: 'SCIM provisioning', href: '/enterprise/scim' },
    ],
  },
]

export function NavigationDocs({ className }) {
  return (
    <nav className={className}>
      <ul role="list">
        <TopLevelNavItem href="https://kryptic.dev/">Home</TopLevelNavItem>
        <TopLevelNavItem href="/">Docs</TopLevelNavItem>
        <TopLevelNavItem href="https://kryptic.dev/features">Features</TopLevelNavItem>
        <TopLevelNavItem href="https://kryptic.dev/pricing">Pricing</TopLevelNavItem>
        <TopLevelNavItem href="https://github.com/dev-kryptic">
          Github
        </TopLevelNavItem>
        {docsNavigation.map((group, groupIndex) => (
          <NavigationStateProvider key={group.title} index={groupIndex}>
            <NavigationGroup
              group={group}
              index={groupIndex}
              className={groupIndex === 0 && 'md:mt-0'}
            />
          </NavigationStateProvider>
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button
            href="https://kryptic.dev/"
            variant="filled"
            className="w-full"
          >
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  )
}

const findActiveGroupIndex = (group, pathname) => {
  let activeIndex = -1
  group.links.forEach((link, index) => {
    if (link.href === pathname) {
      activeIndex = index
    } else if (link.links) {
      const childIndex = findActiveGroupIndex(link, pathname)
      if (childIndex !== -1) {
        activeIndex = index
      }
    }
  })
  return activeIndex
}

function NavigationGroup({ group, className, hasChildren }) {
  let router = useRouter()
  let isActiveGroup =
    group.href === router.pathname ||
    findActiveGroupIndex(group, router.pathname) !== -1
  const [isOpen, setIsOpen] = useState(
    (group.isOpen ?? !hasChildren) || isActiveGroup
  )
  useEffect(() => {
    if (isActiveGroup) setIsOpen(true)
  }, [router.pathname, isActiveGroup])
  const [, setActiveHighlight] = useNavigationState()
  const isInsideMobileNavigation = useIsInsideMobileNavigation()

  return (
    <li className={clsx('relative', className, hasChildren ? '' : 'mt-6')}>
      <motion.h2
        // layout={"size"}
        className={clsx(
          'group flex items-center justify-between gap-2',
          hasChildren
            ? 'cursor-pointer select-none py-1 pr-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
            : 'text-xs font-semibold text-zinc-900 dark:text-white',
          group.href === router.pathname && 'text-zinc-900 dark:text-white'
        )}
        onClick={() => {
          if (group.href) {
            if (!isOpen) setIsOpen(true)
            if (group.href !== router.pathname) router.push(group.href)
            setActiveHighlight()
            return
          }
          setIsOpen(!isOpen)
          if (!isOpen) {
            if (!isActiveGroup && !isInsideMobileNavigation && group.links[0]?.href)
              router.push(group.links[0].href)
            setActiveHighlight()
          } else {
            setActiveHighlight(group.title)
          }
        }}
        data-nav-link={group.title}
        data-nav-active={hasChildren && isActiveGroup ? '1' : '0'}
      >
        {group.title}
        {hasChildren && (
          <span
            className="-m-1 flex items-center justify-center p-1"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(!isOpen)
              if (isOpen) {
                setActiveHighlight(group.title)
              } else {
                setActiveHighlight()
              }
            }}
          >
            <ChevronDownIcon
              className={clsx(
                'fill-zinc-700 group-hover:fill-zinc-900 dark:fill-zinc-300 dark:group-hover:fill-white',
                'transition',
                isOpen ? 'rotate-180 transform' : ''
              )}
              size={10}
            />
          </span>
        )}
      </motion.h2>
      <div className={clsx('relative', hasChildren ? '' : 'mt-3 pl-2')}>
        {!hasChildren && (
          <>
            <AnimatePresence>
              {isActiveGroup && (
                <VisibleSectionHighlight
                  group={group}
                  pathname={router.pathname}
                />
              )}
            </AnimatePresence>
            <motion.div
              // layout
              className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
            />
            <AnimatePresence initial={false}>
              {isActiveGroup && (
                <ActivePageMarker group={group} pathname={router.pathname} />
              )}
            </AnimatePresence>
          </>
        )}

        <AnimatePresence mode={'wait'} initial={false}>
          {isOpen && (
            <motion.ul
              role="list"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.05 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              className="border-l border-transparent"
            >
              {group.links.map((link) => {
                return link.links ? (
                  <NavigationGroup
                    className={'ml-4'}
                    key={link.title}
                    group={link}
                    hasChildren={true}
                  />
                ) : (
                  <motion.li key={link.href} className="relative">
                    <NavLink
                      href={link.href}
                      active={link.href === router.pathname}
                    >
                      {link.title}
                    </NavLink>
                  </motion.li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </li>
  )
}
