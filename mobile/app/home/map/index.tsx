import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { collectionPointsService, CollectionPoint } from '@/src/services/collection-points.service'
import { eventsService, Event } from '@/src/services/events.service'
import { PopupMenu } from '@/src/components/PopupMenu/PopupMenu'
import { AddCollectionPointModal } from '@/src/components/AddCollectionPointModal'
import { colors } from '@/src/styles/colors'
import { Ionicons } from '@expo/vector-icons'

// Estilo customizado para remover TODOS os POIs do Google Maps
const customMapStyle = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.government',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.medical',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.place_of_worship',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.sports_complex',
    stylers: [{ visibility: 'off' }],
  },
]

export default function Map() {
  const mapRef = useRef<MapView>(null)
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [initialRegion, setInitialRegion] = useState<Region | undefined>(undefined)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  // Buscar localização do usuário
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const region: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
      setInitialRegion(region)
      mapRef.current?.animateToRegion(region, 1000)
    })()
  }, [])

  // Buscar pontos de coleta
  const fetchCollectionPoints = async () => {
    try {
      setLoading(true)
      const response = await collectionPointsService.getAll(1, 100)
      setCollectionPoints(response.items)
    } catch (err) {
      console.error('Error loading collection points:', err)
    } finally {
      setLoading(false)
    }
  }

  // Buscar eventos
  const fetchEvents = async () => {
    try {
      const response = await eventsService.getAll(1, 100)
      setEvents(response.items)
    } catch (err) {
      console.error('Error loading events:', err)
    }
  }

  useEffect(() => {
    fetchCollectionPoints()
    fetchEvents()
  }, [])

  // Função para obter a cor do marcador baseado nas categorias do evento
  const getEventMarkerColor = (event: Event): string => {
    if (!event.eventCategories || event.eventCategories.length === 0) {
      return colors.event.purple // cor padrão para eventos sem categoria
    }

    // Mapear categorias para cores específicas
    const categoryName = event.eventCategories[0]?.category?.name?.toLowerCase() || ''

    // Definir esquema de cores baseado em categorias comuns
    if (categoryName.includes('papel') || categoryName.includes('papelão')) {
      return colors.event.blue
    } else if (categoryName.includes('plástico')) {
      return colors.event.yellow
    } else if (categoryName.includes('vidro')) {
      return colors.event.teal
    } else if (categoryName.includes('metal') || categoryName.includes('alumínio')) {
      return colors.event.orange
    } else if (categoryName.includes('orgânico') || categoryName.includes('compostagem')) {
      return colors.event.pink
    } else if (categoryName.includes('eletrônico') || categoryName.includes('pilha') || categoryName.includes('bateria')) {
      return colors.event.indigo
    } else {
      // Alternar entre cores para categorias diferentes
      const colorPalette = [
        colors.event.purple,
        colors.event.orange,
        colors.event.blue,
        colors.event.pink,
        colors.event.yellow,
        colors.event.teal,
        colors.event.indigo,
      ]
      const index = event.eventCategories[0]?.categoryId?.charCodeAt(0) || 0
      return colorPalette[index % colorPalette.length]
    }
  }

  const handleAddCollectionPointSuccess = () => {
    fetchCollectionPoints()
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        customMapStyle={customMapStyle}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: 80,
          left: 0,
        }}
      >
        {collectionPoints.map((point) => {
          const categories = point.collectionPointCategories
            ?.map((cpc) => cpc.category.name)
            .join(', ') || 'Sem categoria'

          return (
            <Marker
              key={`collection-${point.id}`}
              coordinate={{
                latitude: point.lat,
                longitude: point.lon,
              }}
              title={point.name}
              description={`${point.address}\nCategorias: ${categories}`}
              pinColor={colors.green300}
            />
          )
        })}

        {events.map((event) => {
          const categories = event.eventCategories
            ?.map((ec) => ec.category.name)
            .join(', ') || 'Sem categoria'

          const startDate = new Date(event.startAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          const endDate = new Date(event.endAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <Marker
              key={`event-${event.id}`}
              coordinate={{
                latitude: event.lat,
                longitude: event.lon,
              }}
              title={`🎯 ${event.title}`}
              description={`${event.description}\n\nCategorias: ${categories}\nInício: ${startDate}\nFim: ${endDate}`}
              pinColor={getEventMarkerColor(event)}
            />
          )
        })}
      </MapView>
      {loading && (
        <View style={[styles.loadingContainer, { top: insets.top }]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      <View style={[styles.popupMenuContainer, { top: insets.top }]}>
        <PopupMenu
          icon={<Ionicons name="menu" size={24} color={colors.black200} />}
          options={[
            {
              label: 'Adicionar Ponto de Coleta',
              value: 'add-collection-point',
              onPress: () => {
                setModalVisible(true)
              },
            },
          ]}
          menuStyles={{
            optionsContainer: { paddingVertical: 8, backgroundColor: colors.white, borderRadius: 12 },
            optionText: { color: colors.black200  , fontSize: 16 },
          }}
        />
      </View>

      <AddCollectionPointModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userLocation={userLocation}
        onSuccess={handleAddCollectionPointSuccess}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  loadingContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupMenuContainer: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
