import {forwardRef, Fragment, useEffect, useState} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'

import { Button } from '@/components/Button'
import { docsNavigation } from '@/components/NavigationDocs'
import { flattenNavItems } from '@/components/NavigationShared'
import { publicApiUrl } from '@/lib/public-api'

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="8.25" strokeWidth="1.5" />
      <path
        d="m6.5 10.25 2.5 2.5 4.5-5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FeedbackButton(props) {
  return (
    <button
      type="submit"
      className="px-3 text-sm font-medium text-ink-muted transition hover:bg-surface-hover hover:text-ink"
      {...props}
    />
  )
}

const FeedbackForm = forwardRef(function FeedbackForm({ onSubmit }, ref) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="absolute inset-0 flex items-center justify-center gap-6 md:justify-start"
    >
      <p className="text-sm text-ink-muted">
        Was this page helpful?
      </p>
      <div className="group grid h-8 grid-cols-[1fr,1px,1fr] overflow-hidden rounded-full border border-edge">
        <FeedbackButton data-response="yes">Yes</FeedbackButton>
        <div className="bg-edge" />
        <FeedbackButton data-response="no">No</FeedbackButton>
      </div>
    </form>
  )
})

const FeedbackThanks = forwardRef(function FeedbackThanks(_props, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex justify-center md:justify-start"
    >
      <div className="flex items-center gap-3 rounded-full bg-accent/10 py-1 pl-1.5 pr-3 text-sm text-ink ring-1 ring-inset ring-accent/30">
        <CheckIcon className="h-5 w-5 flex-none stroke-accent" />
        Thanks for your feedback!
      </div>
    </div>
  )
})

function storageKey(path) {
  return `docs-feedback:${path}`
}

function sendFeedback({ pageName, pageUrl, helpful, comment }) {
  return fetch(`${publicApiUrl()}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageName,
      pageUrl,
      helpful,
      ...(comment ? { comment } : {}),
    }),
  })
}

function Feedback({ path, pageTitle }) {
  let [submitted, setSubmitted] = useState(false)
  let [askComment, setAskComment] = useState(false)
  let [comment, setComment] = useState('')

  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey(path))) {
        setSubmitted(true)
      }
    } catch {
      // Ignore private-mode storage failures.
    }
  }, [path])

  function finish() {
    setAskComment(false)
    setSubmitted(true)
    try {
      window.localStorage.setItem(storageKey(path), '1')
    } catch {
      // Ignore private-mode storage failures.
    }
  }

  function submitVote(helpful, note) {
    finish()
    sendFeedback({
      pageName: pageTitle || path,
      pageUrl: path,
      helpful,
      comment: note,
    }).catch(() => {
      // Storage is best-effort; the thanks state still stands.
    })
  }

  function onSubmit(event) {
    event.preventDefault()
    let response = event.nativeEvent.submitter?.dataset.response
    if (response === 'yes') {
      submitVote(true)
      return
    }
    if (response === 'no') {
      setAskComment(true)
    }
  }

  function onCommentSubmit(event) {
    event.preventDefault()
    submitVote(false, comment.trim())
  }

  return (
    <div className={submitted && !askComment ? 'relative h-8' : 'relative min-h-8 space-y-3'}>
      <Transition
        show={!submitted && !askComment}
        as={Fragment}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        leave="pointer-events-none duration-300"
      >
        <FeedbackForm onSubmit={onSubmit} />
      </Transition>
      {askComment && !submitted && (
        <form onSubmit={onCommentSubmit} className="space-y-3">
          <p className="text-sm text-ink-muted">
            What was missing?
          </p>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Optional"
            className="w-full resize-y rounded-lg border border-edge bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-on"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => submitVote(false)}
              className="rounded-full px-3 py-1 text-sm font-medium text-ink-muted transition hover:text-ink"
            >
              Skip
            </button>
          </div>
        </form>
      )}
      <Transition
        show={submitted}
        as={Fragment}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        enter="delay-150 duration-300"
      >
        <FeedbackThanks />
      </Transition>
    </div>
  )
}

/* Prev/next pair. The heading duplicates the button's destination, so it is
   hidden from assistive tech and skipped in the tab order - the button already
   announces both the direction and the page title. */
function PageLink({ label, page, previous = false }) {
  return (
    <>
      <Button
        href={page.href}
        aria-label={`${label}: ${page.title}`}
        variant="secondary"
        arrow={previous ? 'left' : 'right'}
      >
        {label}
      </Button>
      <Link
        href={page.href}
        tabIndex={-1}
        aria-hidden="true"
        className="text-base font-semibold text-ink transition hover:text-accent-text"
      >
        {page.title}
      </Link>
    </>
  )
}

/* Walks the sidebar order to find what sits either side of the current page.
   Pages reachable only by direct link (not listed in the nav) get nothing. */
function PageNavigation() {
  let router = useRouter()
  let allPages = docsNavigation.flatMap((group) =>
    flattenNavItems(group.links, true)
  )
  let index = allPages.findIndex((page) => page.href === router.pathname)
  if (index === -1) return null

  let previousPage = allPages[index - 1]
  let nextPage = allPages[index + 1]
  if (!previousPage && !nextPage) return null

  return (
    <div className="flex">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink label="Previous" page={previousPage} previous />
        </div>
      )}
      {nextPage && (
        <div className="ml-auto flex flex-col items-end gap-3">
          <PageLink label="Next" page={nextPage} />
        </div>
      )}
    </div>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z"
      />
    </svg>
  )
}

function SocialLink({ href, icon: Icon, children }) {
  return (
    <Link href={href} className="group">
      <span className="sr-only">{children}</span>
      <Icon className="h-5 w-5 fill-ink-muted transition group-hover:fill-ink" />
    </Link>
  )
}

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-edge-soft pt-8 sm:flex-row">
      <p className="text-xs text-ink-muted">
        &copy; Copyright {new Date().getFullYear()}. All rights reserved.
      </p>
      <div className="flex gap-4">
        <SocialLink href="https://github.com/dev-kryptic" icon={GitHubIcon}>
          Follow us on GitHub
        </SocialLink>
      </div>
    </div>
  )
}

export function Footer({ pageTitle }) {
  let router = useRouter()

  return (
    <footer className="mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <Feedback key={router.pathname} path={router.pathname} pageTitle={pageTitle} />
      <PageNavigation />
      <SmallPrint />
    </footer>
  )
}
