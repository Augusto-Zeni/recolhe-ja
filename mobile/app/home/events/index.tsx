import { Button } from '@/src/components/Button'
import { Text } from '@/src/components/Text'
import { useAuth } from '@/src/contexts/AuthContext'
import { View } from 'react-native'

export default function Events() {
  const { signOut } = useAuth()

  const handlePressSignOut = () => {
    signOut()
  }
  return (
    <View>
      <Text>Events</Text>
        <Button onPress={handlePressSignOut}>
          <Text>Logout</Text>
        </Button>
    </View>
  )
}
