import { mdxAnnotations } from 'mdx-annotations'
import recmaNextjsStaticProps from 'recma-nextjs-static-props'

/* MDX compiles `export const x = ...` in a page into a named export, but
   recma-nextjs-static-props needs those values as plain top-level declarations
   so it can fold them into getStaticProps. Unwrap each export declaration and
   leave the declaration behind. */
function recmaUnwrapNamedExports() {
  return (tree) => {
    tree.body = tree.body.map((node) =>
      node.type === 'ExportNamedDeclaration' ? node.declaration : node
    )
  }
}

export const recmaPlugins = [
  mdxAnnotations.recma,
  recmaUnwrapNamedExports,
  recmaNextjsStaticProps,
]
