import { Text } from '@/src/components/Text'
import { colors } from '@/src/styles/colors'
import React, { forwardRef } from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'

export interface InputProps extends TextInputProps {
  label?: string
  error?: string
  variant?: 'primary' | 'secondary'
  borderColor?: string
  containerStyle?: object
  inputStyle?: object
  labelStyle?: object
  errorStyle?: object
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      variant = 'primary',
      borderColor,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      ...props
    },
    ref
  ) => {
    const getBorderColor = () => {
      if (error) return colors.red
      if (borderColor) return borderColor
      return colors.transparent
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            { borderColor: getBorderColor() },
            inputStyle,
          ]}
          placeholderTextColor={colors.gray200}
          {...props}
        />
        {error && (
          <Text style={[styles.error, errorStyle]}>
            {error}
          </Text>
        )}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.black200,
    backgroundColor: colors.gray100,
  },
  error: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
  },
})

Input.displayName = 'Input'