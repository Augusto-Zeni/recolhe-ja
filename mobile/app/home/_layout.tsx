import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '@/src/components/TabBar/TabBar'

const _layout = () => {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'Map',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="items/index"
        options={{
          title: 'Items',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'Events',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          headerShown: false
        }}
      />
    </Tabs>
  )
}

export default _layout