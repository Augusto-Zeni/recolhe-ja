import { colors } from '@/src/styles/colors'
import { ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native'

export function Button({
  children,
  onPress,
  style = {},
  disabled = false,
  variant = 'primary'
}: {
  children: ReactNode
  onPress: () => void
  variant?: 'primary' | 'secondary'
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  primary: {
    backgroundColor: colors.green300,
  },
  secondary: {
    backgroundColor: colors.green100,
  },
  disabled: {
    opacity: 0.5,
  },
})