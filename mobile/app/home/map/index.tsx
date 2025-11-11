import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { collectionPointsService, CollectionPoint } from '@/src/services/collection-points.service'

export default function Map() {
  const mapRef = useRef<MapView>(null)
  const [initialRegion, setInitialRegion] = useState<Region | undefined>(undefined)
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      setInitialRegion(region)
      mapRef.current?.animateToRegion(region, 1000)
    })()
  }, [])

  // Buscar pontos de coleta
  useEffect(() => {
    const fetchCollectionPoints = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await collectionPointsService.getAll(1, 100)
        setCollectionPoints(response.items)
      } catch (err) {
        console.error('Error loading collection points:', err)
        setError('Não foi possível carregar os pontos de coleta')
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionPoints()
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {collectionPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: point.lat,
              longitude: point.lon,
            }}
            title={point.name}
            description={point.address}
          />
        ))}
      </MapView>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
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
    top: 20,
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
})
