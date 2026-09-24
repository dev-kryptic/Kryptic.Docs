import { useEffect, useId, useState } from 'react'

const charts = {
  entitlement: `flowchart LR
  cloud["Cloud plan"]
  selfhost["Self-hosted licence"]
  on["Protect is enforced"]
  off["Protect is hidden"]
  cloud -->|Enterprise| on
  cloud -->|"Free, Team, or Business"| off
  selfhost -->|"Key has the feature"| on
  selfhost -->|"Flag absent"| off`,

  save: `flowchart TD
  write["Save secret values"]
  split["Split by environment"]
  openEnv["Unprotected"]
  locked["Protected"]
  direct{"Can commit directly?"}
  applyNow["Apply now"]
  queueDev["Queue for change_requests.decide"]
  sole{"Only protector?"}
  queueLock["Queue for that role or those people"]
  gate{"In the set, not the author?"}
  applied["Applied"]
  rejected["Rejected"]
  write --> split
  split --> openEnv
  split --> locked
  openEnv --> direct
  direct -->|Yes| applyNow
  direct -->|No| queueDev
  locked --> sole
  sole -->|Yes| applyNow
  sole -->|No| queueLock
  queueLock --> gate
  gate -->|Yes| applied
  gate -->|No| rejected`,

  sequence: `sequenceDiagram
  participant Admin
  participant Platform
  participant Security
  Admin->>Platform: Save production
  Platform-->>Admin: Pending for Security
  Admin->>Platform: Approve
  Platform-->>Admin: Rejected, you submitted this
  Security->>Platform: Approve
  Platform-->>Security: Applied`,

  protectors: `flowchart TD
  who{"Role or people?"}
  who -->|Role| members{"How many members?"}
  who -->|People| named{"How many people?"}
  members -->|One| m1["Own save applies now. Anyone else waits for that member"]
  members -->|"Two or more"| mN["A different member applies it. The author cannot"]
  named -->|One| p1["Own save applies now. Anyone else waits for that person"]
  named -->|"Two or more"| pN["A different named person applies it. The author cannot"]`,
}

const darkTheme = {
  background: 'transparent',
  primaryColor: '#15241c',
  primaryTextColor: '#e9f1ec',
  primaryBorderColor: '#5ff2a6',
  secondaryColor: '#15241c',
  secondaryTextColor: '#e9f1ec',
  secondaryBorderColor: '#5ff2a6',
  tertiaryColor: '#111714',
  tertiaryTextColor: '#e9f1ec',
  tertiaryBorderColor: '#3a4a42',
  lineColor: '#8ea096',
  textColor: '#e9f1ec',
  actorBkg: '#15241c',
  actorBorder: '#5ff2a6',
  actorTextColor: '#e9f1ec',
  signalColor: '#e9f1ec',
  signalTextColor: '#e9f1ec',
  noteBkgColor: '#15241c',
  noteTextColor: '#e9f1ec',
  noteBorderColor: '#5ff2a6',
}

const lightTheme = {
  background: 'transparent',
  primaryColor: '#eefaf3',
  primaryTextColor: '#0e1613',
  primaryBorderColor: '#0b8d50',
  secondaryColor: '#eefaf3',
  secondaryTextColor: '#0e1613',
  secondaryBorderColor: '#0b8d50',
  tertiaryColor: '#ffffff',
  tertiaryTextColor: '#0e1613',
  tertiaryBorderColor: '#dde6e0',
  lineColor: '#475750',
  textColor: '#0e1613',
  actorBkg: '#eefaf3',
  actorBorder: '#0b8d50',
  actorTextColor: '#0e1613',
  signalColor: '#0e1613',
  signalTextColor: '#0e1613',
  noteBkgColor: '#eefaf3',
  noteTextColor: '#0e1613',
  noteBorderColor: '#0b8d50',
}

let renderChain = Promise.resolve()
let renderSerial = 0

function enqueue(task) {
  const run = renderChain.then(task, task)
  renderChain = run.then(
    () => {},
    () => {}
  )
  return run
}

export function Diagram({ name }) {
  const reactId = useId().replace(/:/g, '')
  const [svg, setSvg] = useState('')
  const chart = charts[name]

  useEffect(() => {
    if (!chart) return undefined
    let cancelled = false

    async function draw() {
      const mermaid = (await import('mermaid')).default
      const dark = document.documentElement.classList.contains('dark')
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: 'inherit',
        themeVariables: dark ? darkTheme : lightTheme,
        flowchart: { htmlLabels: true, curve: 'basis', wrappingWidth: 200 },
      })
      const id = `diagram-${reactId}-${renderSerial++}`
      const rendered = await mermaid.render(id, chart)
      if (!cancelled) setSvg(rendered.svg)
    }

    enqueue(draw)

    const observer = new MutationObserver(() => {
      enqueue(draw)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [chart, reactId])

  if (!chart) return null

  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl bg-surface/70 p-4 shadow-panel ring-1 ring-inset ring-edge sm:p-5 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40" aria-hidden="true" />
      )}
    </div>
  )
}
