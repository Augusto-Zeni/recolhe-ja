import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { CustomModal } from '../CustomModal'
import { Text } from '../Text'
import { Item, AnalyzedItem } from '@/src/services/items.service'
import { collectionPointsService, CollectionPoint } from '@/src/services/collection-points.service'
import { eventsService, Event } from '@/src/services/events.service'
import { calculateDistance, Coordinate } from '@/src/utils/geolocation'
import { colors } from '@/src/styles/colors'

const { height } = Dimensions.get('window')

interface ImageDetailsModalProps {
  visible: boolean
  onClose: () => void
  item: Item | AnalyzedItem | null
}

export const ImageDetailsModal = ({
  visible,
  onClose,
  item,
}: ImageDetailsModalProps) => {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [nearestLocation, setNearestLocation] = useState<{
    type: 'collection-point' | 'event'
    location: CollectionPoint | Event
    distance: number
  } | null>(null)

  useEffect(() => {
    if (visible && item) {
      getUserLocation()
    } else if (!visible) {
      // Reset state when modal closes
      setUserLocation(null)
      setLoadingLocation(false)
      setNearestLocation(null)
    }
  }, [visible, item])

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true)
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
    } finally {
      setLoadingLocation(false)
    }
  }

  const findNearestDisposalLocation = async () => {
    if (!userLocation || !item?.predictedCategoryId) {
      return
    }

    try {
      setLoadingLocation(true)

      // Buscar collection points e eventos
      const [collectionPointsResponse, eventsResponse] = await Promise.all([
        collectionPointsService.getAll(1, 100),
        eventsService.getAll(1, 100),
      ])

      // Filtrar collection points que têm a mesma categoria
      const matchingCollectionPoints = collectionPointsResponse.items.filter((point) =>
        point.collectionPointCategories?.some(
          (cpc) => cpc.categoryId === item.predictedCategoryId
        )
      )

      // Filtrar eventos que têm a mesma categoria
      const matchingEvents = eventsResponse.items.filter((event) =>
        event.eventCategories?.some((ec) => ec.categoryId === item.predictedCategoryId)
      )

      // Calcular distâncias para collection points
      const collectionPointsWithDistance = matchingCollectionPoints.map((point) => ({
        type: 'collection-point' as const,
        location: point,
        distance: calculateDistance(userLocation, {
          latitude: point.lat,
          longitude: point.lon,
        }),
      }))

      // Calcular distâncias para eventos
      const eventsWithDistance = matchingEvents.map((event) => ({
        type: 'event' as const,
        location: event,
        distance: calculateDistance(userLocation, {
          latitude: event.lat,
          longitude: event.lon,
        }),
      }))

      // Combinar e encontrar o mais próximo
      const allLocations = [...collectionPointsWithDistance, ...eventsWithDistance]

      if (allLocations.length === 0) {
        return
      }

      const nearest = allLocations.reduce((prev, current) =>
        prev.distance < current.distance ? prev : current
      )

      setNearestLocation(nearest)

      // Navegar para o mapa com as coordenadas do local mais próximo
      // Adicionar timestamp para forçar navegação mesmo se os params forem iguais
      router.push({
        pathname: '/home/map',
        params: {
          latitudeFromEventList: nearest.location.lat.toString(),
          longitudeFromEventList: nearest.location.lon.toString(),
          selectedLocationId: nearest.location.id,
          selectedLocationType: nearest.type,
          timestamp: Date.now().toString(),
        },
      })

      // Fechar o modal
      onClose()
    } catch (error) {
      console.error('Error finding nearest disposal location:', error)
    } finally {
      setLoadingLocation(false)
    }
  }

  if (!item) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <CustomModal visible={visible} onClose={onClose} title="Detalhes da Imagem">
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagem Principal */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Informações */}
        <View style={styles.infoContainer}>
          {/* Nome do Objeto */}
          {(item.objectName || (item as AnalyzedItem).analysisDetails?.objectName) && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="cube-outline" size={20} color={colors.green300} />
                <Text style={styles.labelText}>Objeto Identificado</Text>
              </View>
              <Text style={styles.objectNameText}>
                {item.objectName || (item as AnalyzedItem).analysisDetails?.objectName}
              </Text>
            </View>
          )}

          {/* Data de Criação */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="calendar-outline" size={20} color={colors.green300} />
              <Text style={styles.labelText}>Data de Criação</Text>
            </View>
            <Text style={styles.valueText}>{formatDate(item.createdAt)}</Text>
          </View>

          {/* Categoria Prevista */}
          {item.predictedCategory && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="pricetag-outline" size={20} color={colors.green300} />
                <Text style={styles.labelText}>Categoria</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.predictedCategory.name}</Text>
              </View>
            </View>
          )}

          {/* Confiança */}
          {item.confidence !== undefined && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.green300} />
                <Text style={styles.labelText}>Confiança</Text>
              </View>
              <View style={styles.confidenceContainer}>
                <View style={styles.confidenceBarBackground}>
                  <View
                    style={[
                      styles.confidenceBarFill,
                      { width: `${item.confidence * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.confidencePercentage}>
                  {Math.round(item.confidence * 100)}%
                </Text>
              </View>
            </View>
          )}

          {/* Botão para encontrar local de descarte mais próximo */}
          {item.predictedCategoryId && (
            <TouchableOpacity
              style={[
                styles.findLocationButton,
                loadingLocation && styles.findLocationButtonDisabled,
              ]}
              onPress={findNearestDisposalLocation}
              disabled={loadingLocation || !userLocation}
              activeOpacity={0.7}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Ionicons name="location" size={20} color={colors.white} />
                  <Text style={styles.findLocationButtonText}>
                    Encontrar Local de Descarte Mais Próximo
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.4,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
    gap: 20,
  },
  infoRow: {
    gap: 8,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.black200,
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.gray400,
    paddingLeft: 28,
  },
  objectNameText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.green300,
    paddingLeft: 28,
  },
  categoryBadge: {
    backgroundColor: colors.green100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 28,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: colors.green300,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 28,
  },
  confidenceBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: colors.green300,
    borderRadius: 4,
  },
  confidencePercentage: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.green300,
    minWidth: 45,
    textAlign: 'right',
  },
  urlText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: colors.gray400,
    paddingLeft: 28,
  },
  findLocationButton: {
    backgroundColor: colors.green300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  findLocationButtonDisabled: {
    backgroundColor: colors.gray200,
    opacity: 0.6,
  },
  findLocationButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.white,
    textAlign: 'center',
  },
})
