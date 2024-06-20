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
      return 'https://curios.vercel.app'
    case 'preview':
      return 'https://curios.vercel.app'

    default: {
      return 'http://10.0.2.2:3000'
    }
  }
})()
