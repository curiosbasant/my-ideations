import type { ConfigContext, ExpoConfig } from 'expo/config'

export default function defineConfig({ config }: ConfigContext): ExpoConfig {
  // Fallback to production environment
  const appName = process.env.APP_NAME || 'Spend Buddy'
  const appPackageId = process.env.APP_PACKAGE_ID || 'com.curios.spendbuddy'
  const appIcon = process.env.APP_ICON || './assets/brand/icon.png'
  const appAdaptiveIcon = process.env.APP_ADAPTIVE_ICON || './assets/brand/adaptive-icon.png'

  const appSplashImage = process.env.APP_SLASH_IMAGE || './assets/brand/splash.png'

  const expoProjectId = '87aeac5d-701e-412a-a852-0b14f01382de'

  return {
    ...config,
    // App details
    name: appName,
    version: '0.1.1',
    slug: 'spend-buddy',
    scheme: 'spend-buddy',
    description: 'A platform track money spends with friends to split later.',
    orientation: 'portrait',
    icon: appIcon,
    splash: {
      image: appSplashImage,
      resizeMode: 'contain',
    },
    userInterfaceStyle: 'automatic',

    // Platform specific
    android: {
      package: appPackageId,
      adaptiveIcon: {
        foregroundImage: appAdaptiveIcon,
        backgroundColor: '#FFFFFF',
      },
    },
    ios: {
      supportsTablet: true,
    },

    // Settings
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: expoProjectId,
      },
    },
    githubUrl: 'https://github.com/curiosbasant/my-ideations.git',
    // Required to auto build by expo for this "extra.eas.projectId"
    owner: 'curiosbasant',
    plugins: ['expo-router', 'expo-font'],
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/' + expoProjectId,
    },
  }
}
