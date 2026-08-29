import nextMDX from '@next/mdx'
import { remarkPlugins } from './mdx/remark.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { recmaPlugins } from './mdx/recma.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: undefined,
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  redirects: async () => [
    {
      source: '/api',
      destination: '/rest-api',
      permanent: true,
    },
  ],
  rewrites: async () => [
    {
      source: '/',
      destination: '/introduction',
    },
    {
      source: '/health',
      destination: '/api/health',
    },
  ],
}

export default withMDX(nextConfig)
