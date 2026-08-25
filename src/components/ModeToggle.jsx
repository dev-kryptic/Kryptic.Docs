/* Light/dark toggle.
 *
 * Writes both the `.dark` class (what Tailwind's darkMode: 'class' reads) and
 * `data-theme` (what the design-system tokens read) so the two stay in step.
 * localStorage is only written when the choice differs from the OS setting -
 * that way a reader who never picks a side keeps following their system.
 * The matching boot-time script lives in src/pages/_document.jsx.
 */

function SunIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.75M10 15.75v1.75M17.5 10h-1.75M4.25 10H2.5M15.3 4.7l-1.24 1.24M5.94 14.06 4.7 15.3M15.3 15.3l-1.24-1.24M5.94 5.94 4.7 4.7" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16.5 11.75A6.75 6.75 0 0 1 8.25 3.5a6.75 6.75 0 1 0 8.25 8.25Z" />
    </svg>
  )
}

export function ModeToggle() {
  function toggleMode() {
    // Suppress transitions for one frame so the whole page does not cross-fade.
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)

    let systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    let isDarkMode = document.documentElement.classList.toggle('dark')
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'

    if (isDarkMode === systemPrefersDark) {
      delete window.localStorage.isDarkMode
    } else {
      window.localStorage.isDarkMode = isDarkMode
    }
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label="Toggle dark mode"
      className="flex h-6 w-6 items-center justify-center rounded-sm text-ink transition hover:bg-surface-hover"
    >
      <SunIcon className="h-5 w-5 stroke-current dark:hidden" />
      <MoonIcon className="hidden h-5 w-5 stroke-current dark:block" />
    </button>
  )
}
