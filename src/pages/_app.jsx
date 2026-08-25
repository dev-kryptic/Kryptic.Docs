import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import { Layout } from '@/components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { dom } from '@fortawesome/fontawesome-svg-core'
import { ImageZoom } from '@/components/ImageZoom'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()
  let tableOfContents = collectHeadings(pageProps.sections)

  return (
    <>
      <Head>
        <style>{dom.css()}</style>
        <title>{`${pageProps.title} - Kryptic Docs`}</title>
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout
          title={pageProps.title?.toString()}
          tableOfContents={tableOfContents}
          {...pageProps}
        >
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
      <ToastContainer />
      <ImageZoom />
    </>
  )
}

/* Build the "On this page" tree from the flat `sections` array that
   mdx/rehype.mjs exports for each page. h2s become top-level entries and any
   h3s that follow are nested under the most recent one; deeper levels are
   present in `sections` but are not surfaced in the nav. */
function collectHeadings(sections) {
  let output = []

  for (let section of sections ?? []) {
    let { id, title, tag, tagName } = section

    if (tagName === 'h2') {
      output.push({ id, title, tag, children: [] })
    } else if (tagName === 'h3') {
      // An h3 with no preceding h2 has nowhere to attach. The MDX heading
      // linter (npm run lint:mdx) catches this before it reaches a build.
      output[output.length - 1]?.children.push({ id, title, tag })
    }
  }

  return output
}
