import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green100,
    padding: 24,
  },
  text: {
    color: colors.black200,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
    fontSize: 16,
  },
})