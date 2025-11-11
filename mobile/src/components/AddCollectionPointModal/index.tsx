import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { CustomModal } from '../CustomModal'
import { Input } from '../InputText'
import { Button } from '../Button'
import { Text } from '../Text'
import { colors } from '@/src/styles/colors'
import { collectionPointsService, CreateCollectionPointDto } from '@/src/services/collection-points.service'
import { categoriesService, Category } from '@/src/services/categories.service'
import { useAuth } from '@/src/contexts/AuthContext'
import * as SecureStore from 'expo-secure-store'

interface AddCollectionPointModalProps {
  visible: boolean
  onClose: () => void
  userLocation: {
    latitude: number
    longitude: number
  } | null
  onSuccess?: () => void
}

export const AddCollectionPointModal = ({
  visible,
  onClose,
  userLocation,
  onSuccess,
}: AddCollectionPointModalProps) => {
  const { isAuthenticated, token } = useAuth()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    address?: string
  }>({})

  useEffect(() => {
    if (visible) {
      loadCategories()
    }
  }, [visible])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await categoriesService.getAll(1, 100)
      setCategories(response.items || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!address.trim()) {
      newErrors.address = 'Endereço é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    if (!isAuthenticated) {
      Alert.alert(
        'Não autenticado',
        'Você precisa estar logado para criar um ponto de coleta. Por favor, faça login novamente.',
        [{ text: 'OK' }]
      )
      return
    }

    const storedToken = await SecureStore.getItemAsync('auth_token')
    if (!storedToken && token) {
      await SecureStore.setItemAsync('auth_token', token)
    }

    if (!userLocation) {
      Alert.alert('Erro', 'Não foi possível obter sua localização')
      return
    }

    try {
      setLoading(true)

      const data: CreateCollectionPointDto = {
        name: name.trim(),
        address: address.trim(),
        lat: userLocation.latitude,
        lon: userLocation.longitude,
        contact: contact.trim() || undefined,
        openingHours: openingHours.trim() || undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      }

      await collectionPointsService.create(data)

      Alert.alert('Sucesso', 'Ponto de coleta criado com sucesso!')

      // Reset form
      setName('')
      setAddress('')
      setContact('')
      setOpeningHours('')
      setSelectedCategoryIds([])
      setErrors({})

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Error creating collection point:', error)

      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Por favor, faça login novamente para continuar.',
          [{ text: 'OK' }]
        )
      } else {
        const errorMessage = error.response?.data?.message || 'Não foi possível criar o ponto de coleta'
        Alert.alert('Erro', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title="Adicionar Ponto de Coleta"
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            label="Nome do Local *"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Posto de Reciclagem Central"
            error={errors.name}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Endereço *"
            value={address}
            onChangeText={setAddress}
            placeholder="Ex: Rua Principal, 123"
            error={errors.address}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Contato (opcional)"
            value={contact}
            onChangeText={setContact}
            placeholder="Ex: (11) 98765-4321"
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Horário de Funcionamento (opcional)"
            value={openingHours}
            onChangeText={setOpeningHours}
            placeholder="Ex: Seg-Sex 8h-18h"
            containerStyle={styles.inputContainer}
          />

          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesLabel}>Categorias (opcional)</Text>

            {loadingCategories ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.green300} />
              </View>
            ) : categories.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhuma categoria cadastrada no momento
                </Text>
              </View>
            ) : (
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategoryIds.includes(category.id) && styles.categoryChipSelected,
                    ]}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategoryIds.includes(category.id) && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              * O ponto será adicionado na sua localização atual
            </Text>
          </View>

          <Button
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Criar Ponto de Coleta</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  categoriesSection: {
    marginBottom: 8,
  },
  categoriesLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    color: colors.black200,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray200,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  categoryChipSelected: {
    backgroundColor: colors.green300,
    borderColor: colors.green300,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.black200,
  },
  categoryChipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: colors.green100,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.black200,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 16,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
})
