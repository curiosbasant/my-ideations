import VideoDisplay from './VideoDisplay.client'

export const metadata = {
  title: 'YouTube Clone',
}

export default function YoutubePage() {
  return (
    <div className='h-screen overflow-hidden bg-gray-700'>
      <div className='sticky top-0'>
        <header className='h-16 bg-gray-900/75'></header>
      </div>
      <div
        className={'grid h-full gap-6 overflow-y-auto p-6'}
        style={{ gridTemplateColumns: '1fr 26rem', gridTemplateRows: 'auto 1fr' }}>
        <VideoDisplay />
        <div className='row-start-2 divide-y divide-gray-500'>
          <section id='video-metada' className='pb-4'>
            <div className='text-xs text-blue-500'>#citiesSkylins #ilebay</div>
            <h1 className='text-lg text-white'></h1>
            <div className=''>
              <span className='text-gray-400 '>42,923 views &bull; 16-Oct-2021</span>
            </div>
          </section>
          <section id='channel-metada' className='py-4 '>
            <div className='flex items-center space-x-4'>
              <div className='h-12 w-12 rounded-full bg-gray-500 shadow-inner'></div>
              <div className='flex-1'>
                <p className='text-white'>two dollars twenty</p>
                <span className='text-sm text-gray-400'>1.24 lakh subscribers</span>
              </div>
              <div className=''>
                <button className='rounded bg-red-600 px-4 py-2 uppercase text-white '>
                  Subscribe
                </button>
              </div>
            </div>
            <div className='mt-4 ml-16 space-y-4'>
              <p className='text-white'>
                My Website | www.twodollarstwenty.com Support the Channel by Becoming a Patron
              </p>
              <div className='grid grid-cols-2 gap-4'>
                <div className='h-24 bg-gray-900'></div>
                <div className='h-24 bg-gray-900'></div>
              </div>
              <button className='text-xs uppercase text-gray-400'>Show More</button>
            </div>
          </section>
          <section id='video-comments' className='h-96 py-4'></section>
        </div>

        <aside id='related-videos' className='row-span-2'>
          <div className=''>
            <ul className='flex space-x-2 overflow-x-auto'>
              <li className=''>
                <div className='truncate rounded-full bg-gray-50 px-4 py-1 text-gray-900'>All</div>
              </li>
              {[...Array(10)].map((_, i) => (
                <li className='' key={i}>
                  <div className='truncate rounded-full bg-gray-500/75 px-4 py-1 text-white'>
                    kuch hibi
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ul className='mt-4 space-y-2'>
            {[...Array(10)].map((_, i) => (
              <li className='group flex space-x-2' key={i}>
                <div className='aspect-video w-2/5 bg-gray-600 shadow-inner' />
                <div className='flex-1'>
                  <h3 className='text-white'>Support the Channel by Becoming a Patron</h3>
                  <span className='flex text-sm leading-none text-gray-400'>
                    Fireship <span className='ml-1 font-icon text-base'>check_circle</span>
                  </span>
                  <span className='text-sm leading-none text-gray-400'>
                    3.7 lakh views 3 months ago
                  </span>
                </div>
                <div className=''>
                  <button className='hidden font-icon group-hover:inline-block'>more_vert</button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
