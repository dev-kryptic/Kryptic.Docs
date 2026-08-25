/** @type {import('tailwindcss').Config} */

/* Colour utilities resolve to the design tokens in src/styles/kryptic-tokens.css.
   Each token is stored as an "R G B" triplet so Tailwind's opacity modifiers
   (bg-surface/70, text-accent/50, ...) keep working. Add a colour there, not here. */
const token = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`

module.exports = {
  content: ['./{src,mdx}/**/*.{js,mjs,jsx,mdx}'],
  darkMode: 'class',
  theme: {
    fontSize: {
      '2xs': ['0.6875rem', { lineHeight: '1.125rem' }],
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.875rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1.1' }],
      '6xl': ['3.75rem', { lineHeight: '1.05' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
    },
    fontFamily: {
      display: ['var(--display)', 'sans-serif'],
      sans: ['var(--body)', 'sans-serif'],
      mono: ['var(--mono)', 'ui-monospace', 'monospace'],
    },
    typography: require('./typography'),
    extend: {
      colors: {
        /* Semantic tokens - prefer these. */
        canvas: token('bg'),
        surface: {
          DEFAULT: token('surface'),
          raised: token('surface-2'),
          hover: token('surface-hover'),
        },
        edge: {
          DEFAULT: token('border'),
          soft: token('border-soft'),
          lift: token('border-lift'),
        },
        ink: {
          DEFAULT: token('text'),
          muted: token('text-2'),
          faint: token('text-3'),
        },
        accent: {
          DEFAULT: token('accent'),
          text: token('accent-ink'),
          deep: token('accent-2'),
          on: token('crypt-ink'),
        },
        signal: {
          amber: token('amber'),
          red: token('red'),
          blue: token('blue'),
          violet: token('violet'),
        },

        /* Back-compat aliases so existing `kryptic-*` utilities keep resolving.
           New code should use the semantic names above. */
        kryptic: {
          DEFAULT: token('accent'),
          dark: token('accent-2'),
          light: token('accent-ink'),
          ink: token('crypt-ink'),
          50: token('accent-50'),
          100: token('accent-100'),
          200: token('accent-200'),
          300: token('accent-300'),
          400: token('accent-400'),
          500: token('accent-500'),
          600: token('accent-600'),
          700: token('accent-700'),
          800: token('accent-800'),
          900: token('accent-900'),
        },
        'kryptic-bg': {
          DEFAULT: token('bg'),
          surface: token('surface'),
          'surface-2': token('surface-2'),
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        glow: '0 0 0 1px var(--accent-border), 0 0 18px -4px var(--accent-glow)',
        panel: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.18)',
      },
      maxWidth: {
        lg: '33rem',
        '2xl': '40rem',
        '3xl': '50rem',
        '5xl': '66rem',
        '8xl': '90rem',
      },
      opacity: {
        1: '0.01',
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
