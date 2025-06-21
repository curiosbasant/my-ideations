export default function Expenv() {
  return (
    <div>
      <p>NEXT_PUBLIC_VERCEL_URL: {process.env['NEXT_PUBLIC_VERCEL_URL'] ?? 'none'}</p>
      <p>
        NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:{' '}
        {process.env['NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL'] ?? 'none'}
      </p>
    </div>
  )
}
