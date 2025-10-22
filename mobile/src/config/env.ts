import Constants from 'expo-constants'

const ENV = {
  dev: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
  staging: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL_STAGING,
  },
  prod: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL_PROD,
  },
}

const getEnvVars = () => {
  const releaseChannel = (Constants.expoConfig?.extra as { releaseChannel?: string })?.releaseChannel

  if (__DEV__) {
    return ENV.dev
  } else if (releaseChannel === 'staging') {
    return ENV.staging
  } else {
    return ENV.prod
  }
}

export default getEnvVars()