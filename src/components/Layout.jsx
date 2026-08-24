import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { Logo } from '@/components/Logo'
import { Prose } from '@/components/Prose'
import { NavigationDocs } from '@/components/NavigationDocs'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { toast } from 'react-toastify'
import { EDIT_ON_GITHUB_INDEX_ROUTES } from '@/lib/edit-on-github-routes'

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)
  let [showJumpToTop, setShowJumpToTop] = useState(false)

  let getHeadings = useCallback((tableOfContents) => {
    return tableOfContents
      .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
      .map((id) => {
        let el = document.getElementById(id)
        if (!el) return null

        let style = window.getComputedStyle(el)
        let scrollMt = parseFloat(style.scrollMarginTop)

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
        return { id, top }
      })
      .filter(Boolean)
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0) return
    function onScroll() {
      let headings = getHeadings(tableOfContents)
      if (headings.length === 0) return

      let scrollTop = window.scrollY
      setShowJumpToTop(scrollTop > 400)

      let top = scrollTop + 10
      let current = headings[0].id
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [getHeadings, tableOfContents])

  return { currentSection, showJumpToTop }
}

export function Layout({ children, tableOfContents, title }) {
  let router = useRouter()

  const buttonStyle = {
    display: 'inline',
    minWidth: '90px',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const iconStyle = {
    fontSize: '18px',
  }

  const copyToClipboard = () => {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL)
    toast.info('Page URL copied to clipboard!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let { currentSection, showJumpToTop } = useTableOfContents(tableOfContents)

  function isActive(section) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  return (
    <>
      <div className="relative mx-auto flex max-w-8xl sm:px-2 lg:px-8 xl:px-12 lg:ml-72 xl:ml-80">
        <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:dark:border-neutral-700/50 lg:px-6 lg:pb-8 lg:pt-4 lg:bg-white/70 lg:dark:bg-[#0a0d0c]/95 lg:backdrop-blur-lg xl:w-80 lg:overflow-x-visible sidebar-scroll">
            <div className="hidden lg:flex">
              <Link href="/" aria-label="Home">
                <Logo className="h-6" />
              </Link>
            </div>
            <NavigationDocs className="hidden lg:mt-10 lg:block" />
          </div>
          <Header />
        </header>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-5">
          <main className="py-16">
            <Prose as="article">{children}</Prose>
          </main>
          <Footer pageTitle={title} />
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6 pl-12">
          <ol role="list" className="mt-4 space-y-3 text-sm mb-8">
            <li key="copy-link">
              <button
                style={buttonStyle}
                onClick={copyToClipboard}
                className="dark:hover:text-slate-300 dark:text-slate-400 text-slate-500 hover:text-slate-700 font-normal'"
              >
                <FontAwesomeIcon icon={faPaperclip} style={iconStyle} className="icon pr-1" />
                <span>Copy link</span>
              </button>
            </li>
            <li key="edit-on-github">
              <Link
                href={
                  'https://github.com/dev-kryptic/Kryptic.Docs/tree/main/src/pages' +
                  (EDIT_ON_GITHUB_INDEX_ROUTES.has(router.pathname)
                    ? router.pathname + '/index.mdx'
                    : router.pathname + '.mdx')
                }
                className="dark:hover:text-slate-300 dark:text-slate-400 text-slate-500 hover:text-slate-700 font-normal'"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <FontAwesomeIcon icon={faGithub} style={iconStyle} className="icon pr-1" />
                <span>Edit on Github</span>
              </Link>
            </li>
          </ol>
          <nav aria-labelledby="on-this-page-title" className="w-80">
            {tableOfContents.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id="on-this-page-title"
                    className="font-display text-sm font-medium text-slate-900 dark:text-white"
                  >
                    On this page
                  </h2>
                  {showJumpToTop && (
                    <button
                      onClick={scrollToTop}
                      className="text-xs text-slate-500 hover:text-kryptic dark:text-slate-400 dark:hover:text-kryptic transition-colors flex items-center gap-1"
                      aria-label="Jump to top"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      Top
                    </button>
                  )}
                </div>
                <ol role="list" className="mt-4 space-y-3 text-sm">
                  {tableOfContents.map((section) => (
                    <li key={section.id}>
                      <h3>
                        <Link
                          href={`#${section.id}`}
                          className={clsx(
                            isActive(section)
                              ? 'text-kryptic'
                              : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          )}
                        >
                          {section.title}
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                        >
                          {section.children.map((subSection) => (
                            <li key={subSection.id}>
                              <Link
                                href={`#${subSection.id}`}
                                className={
                                  isActive(subSection)
                                    ? 'text-kryptic'
                                    : 'hover:text-slate-600 dark:hover:text-slate-300'
                                }
                              >
                                {subSection.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
