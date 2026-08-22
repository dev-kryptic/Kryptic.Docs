import { mdxAnnotations } from 'mdx-annotations'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'

/** Copy `title="..."` from fenced-code meta onto the `<pre>` so CodeGroup tabs can label it. */
function remarkCodeTitles() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (!node.meta || typeof node.meta !== 'string') return
      const match = /\btitle\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(node.meta)
      const title = match?.[1] ?? match?.[2] ?? match?.[3]
      if (!title) return
      node.data ??= {}
      node.data.hProperties ??= {}
      node.data.hProperties.title = title
    })
  }
}

export const remarkPlugins = [mdxAnnotations.remark, remarkGfm, remarkCodeTitles]
