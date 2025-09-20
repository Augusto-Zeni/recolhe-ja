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
          title: 'Map'
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'Events'
        }}
      />
    </Tabs>
  )
}

export default _layout