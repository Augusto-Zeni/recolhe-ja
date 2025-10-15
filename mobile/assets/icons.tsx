import { Feather } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

type FeatherIconProps = Omit<ComponentProps<typeof Feather>, 'name' | 'size'>

export const icons = {
  'map/index': (props: FeatherIconProps) => <Feather {...props} name='map' size={26} />,
  'events/index': (props: FeatherIconProps) => <Feather {...props} name='calendar' size={26} />,
}