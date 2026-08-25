import clsx from 'clsx'

/* Wraps MDX body content. Dark is the primary theme, so prose-invert is applied
   under .dark rather than the other way round. See typography.js. */
export function Prose({ as: Component = 'div', className, ...props }) {
  return (
    <Component className={clsx(className, 'prose dark:prose-invert')} {...props} />
  )
}
