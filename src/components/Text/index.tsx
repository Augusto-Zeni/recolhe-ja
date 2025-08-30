import { globalStyles } from '@/src/styles/globalStyles'
import { Text as RNText, type StyleProp, type TextStyle } from 'react-native'

export function Text({ style, children, ...props }: { style?: StyleProp<TextStyle>, children: React.ReactNode }) {
  return (
    <RNText style={[globalStyles.text, style]} {...props}>
      {children}
    </RNText>
  )
}