import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import { create } from 'zustand'

import { Tag } from '@/components/Tag'

/* Code blocks and tabbed code groups.
 *
 * MDX gives us `pre`/`code`; Pre promotes a lone block into a CodeGroup so every
 * block gets the same frame. When a group has more than one child the children
 * become language tabs, and the chosen language is remembered across every group
 * on the page - pick "Go" once and the rest of the page follows.
 */

const languageNames = {
  js: 'JavaScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  php: 'PHP',
  python: 'Python',
  ruby: 'Ruby',
  go: 'Go',
  java: 'Java',
  csharp: 'C#',
  cs: 'C#',
  cpp: 'C++',
  'c++': 'C++',
  cmake: 'CMake',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  xml: 'XML',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  rust: 'Rust',
  toml: 'TOML',
  dockerfile: 'Dockerfile',
}

function getPanelTitle({ title, language }) {
  return title ?? languageNames[language] ?? language ?? 'Code'
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <rect x="5.75" y="5.75" width="7.5" height="7.5" rx="1.75" strokeWidth="1.5" />
      <path
        d="M10.25 3.75A1.75 1.75 0 0 0 8.5 2h-4a2.5 2.5 0 0 0-2.5 2.5v4c0 .966.784 1.75 1.75 1.75"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CopyButton({ code }) {
  let [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    let timeout = setTimeout(() => setCopied(false), 1200)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={() => {
        window.navigator.clipboard.writeText(code).then(() => setCopied(true))
      }}
      className={clsx(
        'absolute right-3 top-3 flex items-center gap-1.5 rounded-sm px-2 py-1 text-2xs font-medium',
        'opacity-0 backdrop-blur transition focus:opacity-100 group-hover:opacity-100',
        copied
          ? 'bg-accent/15 text-accent-text ring-1 ring-inset ring-accent/30'
          : 'bg-surface-raised/80 text-ink-muted ring-1 ring-inset ring-edge hover:text-ink'
      )}
    >
      {copied ? (
        'Copied'
      ) : (
        <>
          <CopyIcon className="h-3.5 w-3.5 stroke-current" />
          Copy
        </>
      )}
    </button>
  )
}

function CodePanelHeader({ tag, label }) {
  if (!tag && !label) return null

  return (
    <div className="flex h-9 items-center gap-2 border-b border-edge-soft bg-surface-raised/50 px-4">
      {tag && <Tag variant="small">{tag}</Tag>}
      {tag && label && <span className="h-1 w-1 rounded-pill bg-edge-lift" />}
      {label && <span className="font-mono text-2xs text-ink-faint">{label}</span>}
    </div>
  )
}

function CodePanel({ tag, label, code, children }) {
  let child = Children.only(children)

  return (
    <div className="group">
      <CodePanelHeader
        tag={child.props.tag ?? tag}
        label={child.props.label ?? label}
      />
      <div className="relative">
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-ink">
          {children}
        </pre>
        <CopyButton code={child.props.code ?? code} />
      </div>
    </div>
  )
}

function CodeGroupHeader({ title, children, selectedIndex }) {
  let hasTabs = Children.count(children) > 1

  if (!title && !hasTabs) return null

  return (
    <div className="flex min-h-[3rem] flex-wrap items-start gap-x-4 border-b border-edge bg-surface-raised/60 px-4">
      {title && (
        <h3 className="mr-auto pt-3 font-display text-xs font-semibold text-ink">
          {title}
        </h3>
      )}
      {hasTabs && (
        <TabList className="-mb-px flex gap-4 text-xs font-medium">
          {Children.map(children, (child, childIndex) => (
            <Tab
              className={clsx(
                'border-b-2 py-3 transition focus:outline-none focus-visible:text-accent-text',
                childIndex === selectedIndex
                  ? 'border-accent text-accent-text'
                  : 'border-transparent text-ink-faint hover:text-ink'
              )}
            >
              {getPanelTitle(child.props)}
            </Tab>
          ))}
        </TabList>
      )}
    </div>
  )
}

function CodeGroupPanels({ children, ...props }) {
  if (Children.count(children) > 1) {
    return (
      <TabPanels>
        {Children.map(children, (child) => (
          <TabPanel>
            <CodePanel {...props}>{child}</CodePanel>
          </TabPanel>
        ))}
      </TabPanels>
    )
  }

  return <CodePanel {...props}>{children}</CodePanel>
}

/* Switching tabs changes the panel height, which would otherwise yank the page
   under the cursor. Measure before and after, then scroll by the difference. */
function usePreventLayoutShift() {
  let positionRef = useRef()
  let rafRef = useRef()

  useEffect(() => () => window.cancelAnimationFrame(rafRef.current), [])

  return {
    positionRef,
    preventLayoutShift(callback) {
      if (!positionRef.current) return callback()

      let initialTop = positionRef.current.getBoundingClientRect().top
      callback()
      rafRef.current = window.requestAnimationFrame(() => {
        let newTop = positionRef.current?.getBoundingClientRect().top ?? initialTop
        window.scrollBy(0, newTop - initialTop)
      })
    },
  }
}

/* Most-recently-chosen language wins, so every group on the page agrees. */
const usePreferredLanguageStore = create((set) => ({
  preferredLanguages: [],
  addPreferredLanguage: (language) =>
    set((state) => ({
      preferredLanguages: [
        ...state.preferredLanguages.filter((it) => it !== language),
        language,
      ],
    })),
}))

function useTabGroupProps(availableLanguages) {
  let { preferredLanguages, addPreferredLanguage } = usePreferredLanguageStore()
  let [selectedIndex, setSelectedIndex] = useState(0)

  let activeLanguage = [...availableLanguages].sort(
    (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a)
  )[0]
  let languageIndex = availableLanguages.indexOf(activeLanguage)
  let newSelectedIndex = languageIndex === -1 ? selectedIndex : languageIndex
  if (newSelectedIndex !== selectedIndex) {
    setSelectedIndex(newSelectedIndex)
  }

  let { positionRef, preventLayoutShift } = usePreventLayoutShift()

  return {
    as: 'div',
    ref: positionRef,
    selectedIndex,
    onChange: (index) =>
      preventLayoutShift(() => addPreferredLanguage(availableLanguages[index])),
  }
}

const CodeGroupContext = createContext(false)

export function CodeGroup({ children, title, ...props }) {
  let languages = Children.map(children, (child) => getPanelTitle(child.props))
  let tabGroupProps = useTabGroupProps(languages)
  let hasTabs = Children.count(children) > 1

  let Container = hasTabs ? TabGroup : 'div'
  let containerProps = hasTabs ? tabGroupProps : {}
  let headerProps = hasTabs ? { selectedIndex: tabGroupProps.selectedIndex } : {}

  return (
    <CodeGroupContext.Provider value={true}>
      <Container
        {...containerProps}
        className="not-prose my-6 overflow-hidden rounded-lg bg-surface ring-1 ring-inset ring-edge shadow-panel"
      >
        <CodeGroupHeader title={title} {...headerProps}>
          {children}
        </CodeGroupHeader>
        <CodeGroupPanels {...props}>{children}</CodeGroupPanels>
      </Container>
    </CodeGroupContext.Provider>
  )
}

export function Code({ children, ...props }) {
  let isGrouped = useContext(CodeGroupContext)

  // Inside a group the content arrives pre-highlighted by Shiki.
  if (isGrouped) {
    return <code {...props} dangerouslySetInnerHTML={{ __html: children }} />
  }

  return <code {...props}>{children}</code>
}

export function Pre({ children, ...props }) {
  let isGrouped = useContext(CodeGroupContext)

  if (isGrouped) {
    return children
  }

  return <CodeGroup {...props}>{children}</CodeGroup>
}
