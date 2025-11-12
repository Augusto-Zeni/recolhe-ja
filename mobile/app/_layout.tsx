import { Poppins_200ExtraLight } from '@expo-google-fonts/poppins/200ExtraLight'
import { Poppins_300Light } from '@expo-google-fonts/poppins/300Light'
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular'
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium'
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold'
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold'
import { useFonts } from 'expo-font'
import { View } from 'react-native'
import 'react-native-reanimated'
import { Stack } from 'expo-router'
import { AuthGuard } from '@/src/components/AuthGuard/AuthGuard'
import { AuthProvider } from '@/src/contexts/AuthContext'
import { MenuProvider } from 'react-native-popup-menu'

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return <View />
  }

  return (
    <MenuProvider>
      <AuthProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGuard>
      </AuthProvider>
    </MenuProvider>
  )
}
