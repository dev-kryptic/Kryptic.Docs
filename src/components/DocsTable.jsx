import clsx from 'clsx'

export function DocsTable({ columns, rows, className }) {
  return (
    <div
      className={clsx(
        'not-prose my-6 overflow-x-auto rounded-xl ring-1 ring-inset ring-edge',
        className
      )}
    >
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-surface-raised text-2xs font-semibold uppercase tracking-[0.04em] text-ink-muted">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-2.5">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-edge-soft text-ink-muted [&_a]:font-medium [&_a]:text-accent-text [&_a]:underline [&_a]:decoration-accent/30 [&_a]:underline-offset-[3px] [&_a]:hover:text-accent-deep [&_code]:rounded-sm [&_code]:bg-surface-raised [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-2xs [&_code]:text-ink [&_code]:shadow-[inset_0_0_0_1px_var(--border)] [&_em]:italic [&_strong]:font-semibold [&_strong]:text-ink">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-baseline">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
