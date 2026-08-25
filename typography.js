/* Prose styling for MDX pages.
 *
 * Only the token-driven colours and a handful of structural choices live here;
 * @tailwindcss/typography merges this over its own defaults, so list markers,
 * table scaffolding and the rest come from the plugin rather than being
 * re-declared. Colours resolve to src/styles/kryptic-tokens.css.
 *
 * Custom variables beyond the plugin's set (consumed by components):
 *   --tw-prose-links-hover, --tw-prose-links-underline,
 *   --tw-prose-code-bg, --tw-prose-code-ring
 */

module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      '--tw-prose-body': 'var(--text-2)',
      '--tw-prose-headings': 'var(--text)',
      '--tw-prose-lead': 'var(--text-2)',
      '--tw-prose-links': 'var(--accent-ink)',
      '--tw-prose-links-hover': 'var(--accent-2)',
      '--tw-prose-links-underline': 'var(--accent-border)',
      '--tw-prose-bold': 'var(--text)',
      '--tw-prose-counters': 'var(--text-3)',
      '--tw-prose-bullets': 'var(--border-lift)',
      '--tw-prose-hr': 'var(--border-soft)',
      '--tw-prose-quotes': 'var(--text)',
      '--tw-prose-quote-borders': 'var(--border)',
      '--tw-prose-captions': 'var(--text-3)',
      '--tw-prose-code': 'var(--text)',
      '--tw-prose-code-bg': 'var(--surface-2)',
      '--tw-prose-code-ring': 'var(--border)',
      '--tw-prose-th-borders': 'var(--border-lift)',
      '--tw-prose-td-borders': 'var(--border-soft)',

      maxWidth: 'none',
      color: 'var(--tw-prose-body)',
      fontSize: theme('fontSize.sm')[0],
      lineHeight: theme('lineHeight.7'),

      // Headings sit on the display face; the token file owns the family.
      ':is(h1, h2, h3, h4)': {
        fontFamily: 'var(--display)',
        fontWeight: '600',
        letterSpacing: '-0.01em',
        color: 'var(--tw-prose-headings)',
      },
      h1: { fontSize: theme('fontSize.3xl')[0], marginBottom: theme('spacing.6') },
      h2: {
        fontSize: theme('fontSize.xl')[0],
        marginTop: theme('spacing.12'),
        marginBottom: theme('spacing.4'),
      },
      h3: {
        fontSize: theme('fontSize.base')[0],
        marginTop: theme('spacing.10'),
        marginBottom: theme('spacing.3'),
      },
      h4: {
        fontSize: theme('fontSize.sm')[0],
        marginTop: theme('spacing.8'),
        marginBottom: theme('spacing.2'),
      },

      // Links: coloured, with a token-tinted underline that firms up on hover.
      a: {
        color: 'var(--tw-prose-links)',
        fontWeight: '500',
        textDecoration: 'underline',
        textDecorationColor: 'var(--tw-prose-links-underline)',
        textUnderlineOffset: '3px',
        transitionProperty: 'color, text-decoration-color',
        transitionDuration: '150ms',
      },
      'a:hover': {
        color: 'var(--tw-prose-links-hover)',
        textDecorationColor: 'var(--tw-prose-links-hover)',
      },

      // Inline code: a tinted chip. Block code is handled by <CodeGroup>.
      code: {
        fontFamily: 'var(--mono)',
        fontSize: theme('fontSize.2xs')[0],
        fontWeight: '500',
        color: 'var(--tw-prose-code)',
        backgroundColor: 'var(--tw-prose-code-bg)',
        borderRadius: 'var(--radius-sm)',
        paddingInline: '0.375rem',
        paddingBlock: '0.125rem',
        boxShadow: 'inset 0 0 0 1px var(--tw-prose-code-ring)',
      },
      'code::before': { content: 'none' },
      'code::after': { content: 'none' },
      // Inside links and headings, code inherits rather than fighting the colour.
      ':is(a, h1, h2, h3, h4, blockquote, thead th) code': {
        color: 'inherit',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        paddingInline: '0',
      },

      // <CodeGroup> renders its own frame; strip the prose <pre> chrome.
      pre: {
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        color: 'inherit',
        borderRadius: '0',
        fontSize: 'inherit',
        lineHeight: 'inherit',
      },
      'pre code': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: '0',
        fontSize: 'inherit',
      },

      hr: { borderColor: 'var(--tw-prose-hr)', marginBlock: theme('spacing.12') },

      blockquote: {
        fontStyle: 'normal',
        fontWeight: '400',
        color: 'var(--tw-prose-quotes)',
        borderInlineStartWidth: '2px',
        borderInlineStartColor: 'var(--tw-prose-quote-borders)',
        paddingInlineStart: theme('spacing.5'),
      },
      'blockquote p:first-of-type::before': { content: 'none' },
      'blockquote p:last-of-type::after': { content: 'none' },

      // Tables: rules only, no zebra - reads better for reference material.
      thead: { borderBottomColor: 'var(--tw-prose-th-borders)' },
      'thead th': {
        fontFamily: 'var(--body)',
        fontWeight: '600',
        color: 'var(--tw-prose-headings)',
        fontSize: theme('fontSize.2xs')[0],
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        paddingBlock: theme('spacing.2'),
      },
      'tbody tr': { borderBottomColor: 'var(--tw-prose-td-borders)' },
      'tbody td': { paddingBlock: theme('spacing.3'), verticalAlign: 'baseline' },

      'img, video, figure': { borderRadius: 'var(--radius-md)' },
    },
  },

  // Dark is the primary theme, so `prose-invert` only has to re-point the
  // handful of variables that are not already token-driven. The tokens
  // themselves flip with the .dark class, so most values need no override.
  invert: {
    css: {
      '--tw-prose-body': 'var(--text-2)',
      '--tw-prose-headings': 'var(--text)',
      '--tw-prose-links': 'var(--accent)',
      '--tw-prose-links-hover': 'var(--accent)',
      '--tw-prose-links-underline': 'var(--accent-border)',
      '--tw-prose-bold': 'var(--text)',
      '--tw-prose-code': 'var(--text)',
      '--tw-prose-code-bg': 'var(--surface-2)',
      '--tw-prose-code-ring': 'var(--border)',
    },
  },
})
