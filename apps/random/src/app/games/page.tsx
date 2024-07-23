import Link from 'next/link'

export const metadata = {
  title: 'Games',
}

export default function GamesPage() {
  return (
    <ul className=''>
      {(
        [
          { label: 'Dots and Boxes', link: '/games/dots-and-boxes' },
          { label: 'Slide Puzzle', link: '/games/puzzle' },
        ] as const
      ).map((item, i) => (
        <li className='' key={i}>
          <Link href={item.link}>{item.label}</Link>
        </li>
      ))}
    </ul>
  )
}
