import React from 'react'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu'

type MenuItem<T = any> = {
  label: string
  value: T
  onPress?: (value: T) => void
  disabled?: boolean
}

type PopupMenuProps<T = any> = {
  icon: React.ReactNode
  options: MenuItem<T>[]
  menuStyles?: {
    optionsContainer?: object
    optionText?: object
    [key: string]: any
  }
}

export function PopupMenu<T>({
  icon,
  options,
  menuStyles,
}: PopupMenuProps<T>) {
  return (
    <Menu>
      <MenuTrigger>{icon}</MenuTrigger>
      <MenuOptions
        optionsContainerStyle={{
          marginTop: 40,
        }}
        customStyles={{
          optionsContainer: {
            padding: 8,
            backgroundColor: '#000',
            borderRadius: 12,
            ...menuStyles?.optionsContainer,
          },
          optionText: {
            fontSize: 16,
            color: '#ccc',
            ...menuStyles?.optionText,
          },
        }}
      >
        {options.map((opt, i) => (
          <MenuOption
            key={i}
            onSelect={() => opt.onPress?.(opt.value)}
            disabled={opt.disabled}
            text={opt.label}
          />
        ))}
      </MenuOptions>
    </Menu>
  )
}
