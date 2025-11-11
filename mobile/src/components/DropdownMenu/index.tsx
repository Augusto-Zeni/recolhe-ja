import { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface DropdownMenuItem {
  label: string
  onPress: () => void
}

interface DropdownMenuProps {
  items: DropdownMenuItem[]
  top?: number
  right?: number
  buttonSize?: number
  iconName?: keyof typeof Ionicons.glyphMap
  iconSize?: number
  iconColor?: string
}

export function DropdownMenu({
  items,
  top = 60,
  right = 20,
  buttonSize = 48,
  iconName = 'menu',
  iconSize = 24,
  iconColor = '#333',
}: DropdownMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false)

  const handleItemPress = (onPress: () => void) => {
    setMenuVisible(false)
    onPress()
  }

  return (
    <>
      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.menuOverlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={[styles.menuContainer, { top, right }]}>
        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
          ]}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.menuDropdown}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleItemPress(item.onPress)}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  menuButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuDropdown: {
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
})
