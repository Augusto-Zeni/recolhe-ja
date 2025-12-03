import { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/src/components/Text'
import { itemsService, Item } from '@/src/services/items.service'
import { colors } from '@/src/styles/colors'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ImageDetailsModal } from '@/src/components/ImageDetailsModal'

export default function Items() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await itemsService.getMyItems(1, 50)
      setItems(response.items)
    } catch (err) {
      console.error('Error loading items:', err)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      const response = await itemsService.getMyItems(1, 50)
      setItems(response.items)
    } catch (err) {
      console.error('Error refreshing items:', err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Atualizar a lista quando vier de outra tela com parâmetro de refresh
  useEffect(() => {
    if (params.refresh) {
      fetchItems()
    }
  }, [params.refresh])

  // Abrir o modal automaticamente quando vier com openItemId
  useEffect(() => {
    if (params.openItemId && items.length > 0) {
      const itemToOpen = items.find(item => item.id === params.openItemId)
      if (itemToOpen) {
        setSelectedItem(itemToOpen)
        setModalVisible(true)
      }
    }
  }, [params.openItemId, items])

  const handleItemPress = (item: Item) => {
    setSelectedItem(item)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedItem(null)
  }

  const handleCameraPress = () => {
    router.push('/camera')
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={80} color={colors.gray200} />
      <Text style={styles.emptyText}>Nenhuma imagem ainda</Text>
      <Text style={styles.emptySubtext}>
        Tire fotos dos seus itens recicláveis para começar!
      </Text>
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={handleCameraPress}
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={24} color={colors.white} />
        <Text style={styles.cameraButtonText}>Tirar Foto</Text>
      </TouchableOpacity>
    </View>
  )

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemOverlay}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemDate}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
          {item.confidence && (
            <View style={styles.confidenceBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.green300} />
              <Text style={styles.confidenceText}>
                {Math.round(item.confidence * 100)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.title}>Minhas Imagens</Text>
        <View style={styles.headerRight}>
          <Text style={styles.itemCount}>{items.length} {items.length === 1 ? 'item' : 'itens'}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
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
        columnWrapperStyle={styles.columnWrapper}
      />

      <ImageDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        item={selectedItem}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: colors.gray400,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: colors.white,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  confidenceText: {
    fontSize: 10,
    fontFamily: 'Poppins_500Medium',
    color: colors.green300,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.black200,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.gray400,
    textAlign: 'center',
    marginBottom: 32,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green300,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  cameraButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.white,
  },
})
