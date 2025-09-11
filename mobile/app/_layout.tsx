import { Poppins_200ExtraLight } from '@expo-google-fonts/poppins/200ExtraLight'
import { Poppins_300Light } from '@expo-google-fonts/poppins/300Light'
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular'
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium'
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold'
import { useFonts } from 'expo-font'
import { View } from 'react-native'
import 'react-native-reanimated'
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext'
import { NavigationProvider, AppNavigator } from '@/src/navigation/NavigationContext'
import LoginSignUp from './login-sign-up'

function AppContent() {
  const { user } = useAuth();
  
  if (user) {
    return (
      <NavigationProvider>
        <AppNavigator />
      </NavigationProvider>
    );
  }
  
  return <LoginSignUp />;
}

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return <View />
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
