import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React, { useCallback, useEffect, useMemo } from 'react'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import TabBarButton from '../TabBarButton/TabBarButton'
import { icons } from '@/assets/icons'
import { colors } from '@/src/styles/colors'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const primaryColor = colors.green100
  const grayColor = colors.gray200
  const { width } = useWindowDimensions()
  const router = useRouter()

  const validRoutes = useMemo(() =>
    state.routes.filter(route => !['_sitemap', '+not-found'].includes(route.name) && route.name in icons),
    [state.routes]
  )

  const tabBarMargin = 20 * 2
  const tabBarWidth = width - tabBarMargin
  const numTabs = validRoutes.length
  // Dividir por numTabs + 1 para ter espaço para o botão da câmera
  const tabWidth = tabBarWidth / (numTabs + 1)
  const indicatorMargin = 8

  const activeTabIndex = useMemo(() => {
    const focusedRoute = state.routes[state.index]
    return validRoutes.findIndex(route => route.key === focusedRoute.key)
  }, [state.index, state.routes, validRoutes])

  const getIndicatorPosition = useCallback((tabIndex: number) => {
    // Ajustar índice para considerar o espaço da câmera no meio
    // Se a tab estiver depois da posição 1 (índice 2 ou mais), adicionar 1 ao índice para pular o espaço da câmera
    const adjustedIndex = tabIndex >= 2 ? tabIndex + 1 : tabIndex
    return tabWidth * adjustedIndex + (tabWidth / 2) - ((tabWidth - indicatorMargin * 2) / 2)
  }, [tabWidth])

  const indicatorWidth = tabWidth - indicatorMargin * 2
  const translateX = useSharedValue(getIndicatorPosition(activeTabIndex))

  useEffect(() => {
    translateX.value = withSpring(getIndicatorPosition(activeTabIndex), {
      stiffness: 850,
    })
  }, [activeTabIndex, tabWidth, translateX, indicatorMargin, getIndicatorPosition])

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  const handleCameraPress = () => {
    router.push('/camera')
  }

  const renderTabItems = () => {
    const items: React.ReactElement[] = []
    let validRouteIndex = 0

    state.routes.forEach((route, index) => {
      const { options } = descriptors[route.key]

      const label: string =
        typeof options.tabBarLabel === 'string'
          ? options.tabBarLabel
          : typeof options.title === 'string'
            ? options.title
            : route.name

      if (['_sitemap', '+not-found'].includes(route.name)) return
      if (!(route.name in icons)) return

      const routeName = route.name as keyof typeof icons
      const isFocused = state.index === index

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        })

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params)
        }
      }

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        })
      }

      // Inserir espaço para o botão da câmera após a segunda tab
      if (validRouteIndex === 2) {
        items.push(
          <View key="camera-space" style={[styles.tabbarItemContainer, { width: tabWidth }]} />
        )
      }

      items.push(
        <View key={route.name} style={[styles.tabbarItemContainer, { width: tabWidth }]}>
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItemPressable}
          >
            <TabBarButton
              isFocused={isFocused}
              routeName={routeName}
              color={isFocused ? primaryColor : grayColor}
              label={label}
            />
          </Pressable>
        </View>
      )

      validRouteIndex++
    })

    return items
  }

  return (
    <View style={styles.tabbar}>
      <Animated.View
        style={[
          styles.indicator,
          { width: indicatorWidth },
          animatedIndicatorStyle
        ]}
      />
      {renderTabItems()}
      <Pressable
        style={styles.cameraButtonContainerAbsolute}
        onPress={handleCameraPress}
      >
        <View style={styles.cameraButton}>
          <Feather name="camera" size={30} color={colors.white} />
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.green100,
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1
  },
  indicator: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    backgroundColor: colors.green200,
    borderRadius: 25,
    borderCurve: 'continuous',
  },
  tabbarItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbarItemPressable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonContainerAbsolute: {
    position: 'absolute',
    left: '50%',
    marginLeft: -42.5, // Metade da largura do botão (85/2)
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    width: 85,
    height: 85,
    borderRadius: 40,
    backgroundColor: colors.green200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    marginBottom: -25,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 5,
  }
})

export default TabBar