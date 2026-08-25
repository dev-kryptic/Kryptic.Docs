import path from 'path'
import { fileURLToPath } from 'url'
import { mdxAnnotations } from 'mdx-annotations'
import { visit } from 'unist-util-visit'
import rehypeMdxTitle from 'rehype-mdx-title'
import shiki from 'shiki'
import { toString } from 'mdast-util-to-string'
import * as acorn from 'acorn'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { LAST_UPDATED_BY_ROUTE } from '../src/lib/last-updated-routes.mjs'

const HEADINGS = ['h2', 'h3', 'h4', 'h5', 'h6']

const PAGES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/pages'
)

/* ------------------------------------------------------------ last updated */

function routeFromFilePath(filePath) {
  if (!filePath) return null
  const rel = path.relative(PAGES_DIR, filePath)
  if (rel.startsWith('..')) return null
  const noExt = rel.replace(/\.mdx$/, '')
  return noExt === 'index' ? '/' : '/' + noExt.replace(/\/index$/, '')
}

function formatLastUpdated(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!match) return null
  const [, year, month, day] = match
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return `${months[Number(month) - 1]} ${Number(day)}, ${year}`
}

/** Insert an "Updated <date>" line directly beneath the page's h1. */
function rehypeInsertLastUpdated() {
  return (tree, file) => {
    const filePath = file?.path || file?.history?.[file.history.length - 1]
    const route = routeFromFilePath(filePath)
    if (!route) return

    const iso = LAST_UPDATED_BY_ROUTE[route]
    const formatted = formatLastUpdated(iso)
    if (!formatted) return

    const headingIndex = tree.children.findIndex(
      (child) => child.type === 'element' && child.tagName === 'h1'
    )
    if (headingIndex === -1) return

    tree.children.splice(headingIndex + 1, 0, {
      type: 'element',
      tagName: 'p',
      properties: {
        className: ['not-prose', 'mb-8', 'ml-2.5', 'mt-0', 'text-sm', 'text-ink-faint'],
      },
      children: [
        { type: 'text', value: 'Updated ' },
        {
          type: 'element',
          tagName: 'time',
          properties: { dateTime: iso },
          children: [{ type: 'text', value: formatted }],
        },
      ],
    })
  }
}

/* -------------------------------------------------------------- code fences */

/** Lift the fence's language and title from <code> up onto the wrapping <pre>,
    which is what CodeGroup reads its props from. */
function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (node.tagName !== 'code' || parent?.tagName !== 'pre') return

      const className = node.properties.className?.[0]
      if (className) {
        parent.properties.language = className.replace(/^language-/, '')
      }
      if (node.properties.title && !parent.properties.title) {
        parent.properties.title = node.properties.title
      }
    })
  }
}

/* Highlighting runs against the 'css-variables' theme so the palette comes from
   --shiki-* in src/styles/tailwind.css, which is token-driven and theme-aware.
   The highlighter is expensive to construct, so it is built once per process. */
let highlighterPromise

function rehypeShiki() {
  return async (tree) => {
    highlighterPromise ??= shiki.getHighlighter({ theme: 'css-variables' })
    const highlighter = await highlighterPromise

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return

      const codeNode = node.children[0]
      if (codeNode?.tagName !== 'code') return

      const textNode = codeNode.children[0]
      if (!textNode) return

      // Kept verbatim so the copy button copies source, not highlighted markup.
      node.properties.code = textNode.value

      if (!node.properties.language) return

      const tokens = highlighter.codeToThemedTokens(
        textNode.value,
        node.properties.language
      )

      // Emit only the line spans; CodeGroup supplies its own <pre>/<code>.
      textNode.value = shiki.renderToHtml(tokens, {
        elements: {
          pre: ({ children }) => children,
          code: ({ children }) => children,
          line: ({ children }) => `<span>${children}</span>`,
        },
      })
    })
  }
}

/* ---------------------------------------------------------------- headings */

/** Give every heading a stable id. The counter dedupes repeated titles. */
function rehypeSlugify() {
  return (tree) => {
    const slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      if (HEADINGS.includes(node.tagName) && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

/* ------------------------------------------------------- generated exports */

/** Append `export const <name> = <value>` to the page, unless the author
    already declared it. Values are raw source strings, parsed into an estree
    so the MDX compiler can carry them through. */
function rehypeAddMDXExports(getExports) {
  return (tree) => {
    for (const [name, value] of Object.entries(getExports(tree))) {
      const alreadyDeclared = tree.children.some(
        (node) =>
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
      )
      if (alreadyDeclared) continue

      const source = `export const ${name} = ${value}`
      tree.children.push({
        type: 'mdxjsEsm',
        value: source,
        data: {
          estree: acorn.parse(source, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
        },
      })
    }
  }
}

/** Flatten every heading into the `sections` array the layout uses to build the
    on-this-page nav. Each entry also spreads the heading's mdx-annotation. */
function getSections(node) {
  const sections = []

  for (const child of node.children ?? []) {
    if (child.type === 'element' && HEADINGS.includes(child.tagName)) {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        tagName: ${JSON.stringify(child.tagName)},
        tag: ${JSON.stringify(child.properties.tag)},
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  rehypeMdxTitle,
  rehypeInsertLastUpdated,
  [
    rehypeAddMDXExports,
    (tree) => ({ sections: `[${getSections(tree).join()}]` }),
  ],
]
