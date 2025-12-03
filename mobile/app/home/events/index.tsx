import { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/src/components/Text'
import { EventCard } from '@/src/components/EventCard'
import { AddEventModal } from '@/src/components/AddEventModal'
import { eventsService, Event } from '@/src/services/events.service'
import { colors } from '@/src/styles/colors'
import { useRouter } from "expo-router";

export default function Events() {
  const router = useRouter();
  const insets = useSafeAreaInsets()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [subscribedEvents, setSubscribedEvents] = useState<Set<string>>(new Set())

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsService.getAll(1, 100)
      setEvents(response.items)
      await checkSubscriptions(response.items)
    } catch (err) {
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      const response = await eventsService.getAll(1, 100)
      setEvents(response.items)
      await checkSubscriptions(response.items)
    } catch (err) {
      console.error('Error refreshing events:', err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    getUserLocation()
  }, [])

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }

  const handleAddEventSuccess = () => {
    fetchEvents()
  }

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: "/home/map",
      params: { latitudeFromEventList: event.lat, longitudeFromEventList: event.lon },
    });
  }

  const isEventEnded = (event: Event) => {
    const now = new Date()
    const endDate = new Date(event.endAt)
    return endDate <= now
  }

  const handleSubscribeToggle = async (eventId: string) => {
    try {
      const isSubscribed = subscribedEvents.has(eventId)

      if (isSubscribed) {
        await eventsService.unsubscribe(eventId)
        setSubscribedEvents(prev => {
          const newSet = new Set(prev)
          newSet.delete(eventId)
          return newSet
        })
        Alert.alert('Sucesso', 'Você foi desinscrito do evento!')
      } else {
        await eventsService.subscribe(eventId)
        setSubscribedEvents(prev => new Set(prev).add(eventId))
        Alert.alert('Sucesso', 'Você foi inscrito no evento!')
      }

      // Refresh events to update participant count
      await fetchEvents()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Erro ao processar inscrição'
      Alert.alert('Erro', errorMessage)
    }
  }

  const checkSubscriptions = async (eventsList: Event[]) => {
    try {
      const subscriptionChecks = await Promise.all(
        eventsList.map(event => eventsService.isSubscribed(event.id))
      )

      const newSubscribedEvents = new Set<string>()
      eventsList.forEach((event, index) => {
        if (subscriptionChecks[index]) {
          newSubscribedEvents.add(event.id)
        }
      })

      setSubscribedEvents(newSubscribedEvents)
    } catch (error) {
      console.error('Error checking subscriptions:', error)
    }
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
      <Text style={styles.emptySubtext}>
        Quando novos eventos forem criados, eles aparecerão aqui.
      </Text>
    </View>
  )

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.green300} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={32} color={colors.green300} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const eventEnded = isEventEnded(item)
          const isSubscribed = subscribedEvents.has(item.id)

          return (
            <View style={styles.eventContainer}>
              <EventCard event={item} onPress={() => handleEventPress(item)} />
              {eventEnded ? (
                <View style={styles.endedButton}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colors.gray200}
                  />
                  <Text style={styles.endedButtonText}>Evento Encerrado</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    isSubscribed && styles.unsubscribeButton
                  ]}
                  onPress={() => handleSubscribeToggle(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isSubscribed ? "checkmark-circle" : "add-circle-outline"}
                    size={20}
                    color={colors.white}
                  />
                  <Text style={styles.subscribeButtonText}>
                    {isSubscribed ? 'Inscrito' : 'Inscrever-se'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.green300]}
            tintColor={colors.green300}
          />
        }
      />

      <AddEventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userLocation={userLocation}
        onSuccess={handleAddEventSuccess}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green100,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Poppins_700Bold',
    color: colors.black200,
  },
  addButton: {
    padding: 4,
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.black200,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray200,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  eventContainer: {
    marginBottom: 16,
  },
  subscribeButton: {
    backgroundColor: colors.green300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: -8,
    marginHorizontal: 4,
    gap: 8,
  },
  unsubscribeButton: {
    backgroundColor: colors.gray200,
  },
  subscribeButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.white,
  },
  endedButton: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: -8,
    marginHorizontal: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.gray200 + '40',
  },
  endedButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.gray200,
  },
})
