import { globalStyles } from '@/src/styles/globalStyles'
import { Text as RNText, type TextProps } from 'react-native'

export function Text({ style, children, ...props }: TextProps) {
  return (
    <RNText style={[globalStyles.text, style]} {...props}>
      {children}
    </RNText>
  )
}