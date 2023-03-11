import '~/globals.css'
import { useState } from 'react'
import type { AppType } from 'next/app'
import dynamic from 'next/dynamic'
import { useIsoMorphicEffect } from '@curiosbasant/react-compooks'

import { __DEV__ } from '~/constants'
import { User } from '~/providers'
import { api } from '~/utils/api'
import { latoFont, materialIcon } from '~/utils/fonts'

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(
      (m) => m.ReactQueryDevtools
    ),
  { ssr: false, loading: () => <p>Loading devtools... </p> }
)

const MyIdeations: AppType = ({ Component, pageProps }) => {
  const [showDevtools, setShowDevtools] = useState(false)

  useIsoMorphicEffect(() => {
    setShowDevtools(__DEV__)
    // @ts-ignore - This is so we can toggle the react-query-devtools from console.
    window.toggleDevtools = () => setShowDevtools((prev) => !prev)
  }, [])

  return (
    <User.Provider>
      <div className={`${latoFont.variable} ${materialIcon.variable}`}>
        <Component {...pageProps} />
      </div>
      {showDevtools && (
        <ReactQueryDevtools
          position='bottom-right'
          closeButtonProps={{ style: { left: 'initial', right: 0 } }}
        />
      )}
    </User.Provider>
  )
}

export default api.withTRPC(MyIdeations)
