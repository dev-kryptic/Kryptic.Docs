export function publicApiUrl() {
  return (process.env.NEXT_PUBLIC_PUBLIC_API_URL || 'http://localhost:5240').replace(
    /\/$/,
    '',
  )
}
