import Constants from 'expo-constants'

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'http://localhost:3000',
  },
  prod: {
    apiUrl: 'https://api.recolheja.com',
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
