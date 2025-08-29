import { globalStyles } from '@/src/styles/globalStyles'
import { Poppins_200ExtraLight } from '@expo-google-fonts/poppins/200ExtraLight'
import { Poppins_300Light } from '@expo-google-fonts/poppins/300Light'
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular'
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium'
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold'
import { useFonts } from 'expo-font'
import { Text, View } from 'react-native'
import 'react-native-reanimated'

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
    <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={globalStyles.text}>Hello World!</Text>
    </View>
  )
}
