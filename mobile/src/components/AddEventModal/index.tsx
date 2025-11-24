import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { CustomModal } from '../CustomModal'
import { Input } from '../InputText'
import { Button } from '../Button'
import { Text } from '../Text'
import { colors } from '@/src/styles/colors'
import { eventsService, CreateEventDto } from '@/src/services/events.service'
import { categoriesService, Category } from '@/src/services/categories.service'
import { useAuth } from '@/src/contexts/AuthContext'
import * as SecureStore from 'expo-secure-store'

interface AddEventModalProps {
  visible: boolean
  onClose: () => void
  userLocation: {
    latitude: number
    longitude: number
  } | null
  onSuccess?: () => void
}

export const AddEventModal = ({
  visible,
  onClose,
  userLocation,
  onSuccess,
}: AddEventModalProps) => {
  const { isAuthenticated, token } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)) 
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [errors, setErrors] = useState<{
    title?: string
    description?: string
    startDate?: string
    endDate?: string
  }>({})
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)

  useEffect(() => {
    if (visible) {
      loadCategories()
    }
  }, [visible])

    const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      const newStartDate = new Date(startDate)
      newStartDate.setFullYear(selectedDate.getFullYear())
      newStartDate.setMonth(selectedDate.getMonth())
      newStartDate.setDate(selectedDate.getDate())
      setStartDate(newStartDate)

      if (newStartDate >= endDate) {
        const newEndDate = new Date(newStartDate.getTime() + 3600000)
        setEndDate(newEndDate)
      }
    }
  }

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios')
    if (selectedTime) {
      const newStartDate = new Date(startDate)
      newStartDate.setHours(selectedTime.getHours())
      newStartDate.setMinutes(selectedTime.getMinutes())
      setStartDate(newStartDate)

      if (newStartDate >= endDate) {
        const newEndDate = new Date(newStartDate.getTime() + 3600000)
        setEndDate(newEndDate)
      }
    }
  }

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      const newEndDate = new Date(endDate)
      newEndDate.setFullYear(selectedDate.getFullYear())
      newEndDate.setMonth(selectedDate.getMonth())
      newEndDate.setDate(selectedDate.getDate())
      setEndDate(newEndDate)
    }
  }

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios')
    if (selectedTime) {
      const newEndDate = new Date(endDate)
      newEndDate.setHours(selectedTime.getHours())
      newEndDate.setMinutes(selectedTime.getMinutes())
      setEndDate(newEndDate)
    }
  }

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

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres'
    }

    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (description.trim().length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'
    }

    if (startDate >= endDate) {
      newErrors.endDate = 'Data de término deve ser após a data de início'
    }

    const now = new Date()
    if (startDate < now) {
      newErrors.startDate = 'Data de início não pode ser no passado'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setStartDate(new Date())
    setEndDate(new Date(Date.now() + 3600000))
    setSelectedCategoryIds([])
    setErrors({})
    setLoading(false)
    setLoadingCategories(false)    
    setShowStartDatePicker(false)
    setShowStartTimePicker(false)
    setShowEndDatePicker(false)
    setShowEndTimePicker(false)
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

     if (!isAuthenticated) {
      Alert.alert(
        'Não autenticado',
        'Você precisa estar logado para criar um evento. Por favor, faça login novamente.',
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

      const data: CreateEventDto = {
        title: title.trim(),
        description: description.trim(),
        lat: userLocation.latitude,
        lon: userLocation.longitude,
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      }

      await eventsService.create(data)

      Alert.alert('Sucesso', 'Evento criado com sucesso!')

      onSuccess?.()
      handleClose()
    } catch (error: any) {
      console.error('Error creating event:', error)

      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Por favor, faça login novamente para continuar.',
          [{ text: 'OK' }]
        )
      } else {
        const errorMessage = error.response?.data?.message || 'Não foi possível criar o evento'
        Alert.alert('Erro', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

   return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Adicionar Evento"
    >
      <ScrollView 
        style={styles.scrollView}      
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Título *"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Mutirão de Limpeza do Parque"
            error={errors.title}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
          />

          <Input
            label="Descrição *"
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o evento..."
            error={errors.description}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

         
          <View style={styles.dateTimeSection}>
            <Text style={styles.label}>Data e Hora de Início *</Text>
            <View style={styles.dateTimeRow}>
             
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
             
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {formatTime(startDate)}
                </Text>
              </TouchableOpacity>
            </View>
          
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
                minimumDate={new Date()}
              />
            )}

            {showStartTimePicker && (
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={onStartTimeChange}
              />
            )}

            {errors.startDate && (
              <Text style={styles.errorText}>{errors.startDate}</Text>
            )}
          </View>
        
          <View style={styles.dateTimeSection}>
            <Text style={styles.label}>Data e Hora de Término *</Text>
            <View style={styles.dateTimeRow}>
              
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                 {formatDate(endDate)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {formatTime(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
                minimumDate={startDate}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={endDate}
                mode="time"
                display="default"
                onChange={onEndTimeChange}
              />
            )}

            {errors.endDate && (
              <Text style={styles.errorText}>{errors.endDate}</Text>
            )}
          </View>
         
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
              * O evento será criado na sua localização atual
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
              <Text style={styles.submitButtonText}>Criar Evento</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30, 
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputStyle: {
    backgroundColor: colors.white,
    borderColor: colors.gray200,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    color: colors.black200,
  },
  dateTimeSection: {
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: colors.black200,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
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