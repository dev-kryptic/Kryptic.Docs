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

const DOCS_ORIGIN = 'https://docs.kryptic.dev'
const SHARE_IMAGE = `${DOCS_ORIGIN}/logo.png`
const DEFAULT_DESCRIPTION =
  'Documentation for Kryptic - secrets management for developers.'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

function canonicalPath(asPath) {
  const path = (asPath ?? '/').split('#')[0].split('?')[0]
  return path === '' ? '/' : path
}

export default function App({ Component, pageProps }) {
  let router = useRouter()
  let tableOfContents = collectHeadings(pageProps.sections)
  const title = `${pageProps.title} - Kryptic Docs`
  const description = pageProps.description || DEFAULT_DESCRIPTION
  const canonical = `${DOCS_ORIGIN}${canonicalPath(router.asPath)}`

  return (
    <>
      <Head>
        <style>{dom.css()}</style>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kryptic Docs" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={SHARE_IMAGE} />
        <meta property="og:image:secure_url" content={SHARE_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1000" />
        <meta property="og:image:height" content="1000" />
        <meta property="og:image:alt" content="Kryptic" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={SHARE_IMAGE} />
        <meta name="twitter:image:alt" content="Kryptic" />
        <link rel="image_src" href={SHARE_IMAGE} />
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
