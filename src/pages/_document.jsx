import { Head, Html, Main, NextScript } from 'next/document'

const modeScript = `
  // Runs before paint so the correct theme is in place on first frame.
  // Sets both the .dark class (Tailwind) and data-theme (design tokens).
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  applyMode()
  darkModeMediaQuery.addEventListener('change', applyModeWithoutTransitions)
  window.addEventListener('storage', applyModeWithoutTransitions)

  function applyMode() {
    let systemPrefersDark = darkModeMediaQuery.matches
    let stored = window.localStorage.isDarkMode
    let isDarkMode = stored === 'true' || (stored === undefined && systemPrefersDark)

    document.documentElement.classList.toggle('dark', isDarkMode)
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'

    // Stop tracking an explicit choice once it matches the OS again.
    if (isDarkMode === systemPrefersDark) {
      delete window.localStorage.isDarkMode
    }
  }

  function applyModeWithoutTransitions() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(function () {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
    applyMode()
  }
`

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
