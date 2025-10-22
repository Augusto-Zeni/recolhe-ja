import { StyleSheet, View } from 'react-native'
import { icons } from '@/assets/icons'

type TabBarRouteName = keyof typeof icons

interface TabBarButtonProps {
  isFocused: boolean
  label: string
  routeName: TabBarRouteName
  color: string
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ routeName, color }) => {
  return (
    <View style={styles.container}>
      {
        icons[routeName]({
          color
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  }
})

export default TabBarButton