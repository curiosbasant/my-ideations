import { channel } from 'expo-updates'

export const SITE_URL = (() => {
  // Being used for eas-builds
  if (process.env.EXPO_PUBLIC_SITE_URL) {
    console.info(
      `Using channel ${channel} >> EXPO_PUBLIC_SITE_URL: `,
      process.env.EXPO_PUBLIC_SITE_URL,
    )
    return process.env.EXPO_PUBLIC_SITE_URL
  }

  // Being used for eas-updates
  switch (channel) {
    case 'production':
      return 'https://inkcourse.vercel.app'
    case 'preview':
      return 'https://inkpreview.vercel.app'

    default: {
      return 'http://localhost:3000'
    }
  }
})()
