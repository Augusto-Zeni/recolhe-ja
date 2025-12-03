import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { useState, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/src/styles/colors'
import { itemsService } from '@/src/services/items.service'
import { BlurView } from 'expo-blur'

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [isCapturing, setIsCapturing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const cameraRef = useRef<CameraView>(null)
  const router = useRouter()
  const loadingOpacity = useRef(new Animated.Value(0)).current

  if (!permission) {
    return <View style={styles.container} />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Feather name="camera-off" size={64} color={colors.gray400} />
          <Text style={styles.permissionText}>Precisamos da sua permissão para usar a câmera</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Conceder permissão</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  function showLoading(message: string) {
    setLoadingMessage(message)
    setIsCapturing(true)
    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  function hideLoading() {
    Animated.timing(loadingOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsCapturing(false)
      setLoadingMessage('')
    })
  }

  async function takePicture() {
    if (!cameraRef.current || isCapturing) return

    try {
      // Primeira etapa: Capturando foto
      showLoading('Capturando foto...')

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      })

      if (!photo?.uri) {
        throw new Error('Não foi possível capturar a foto')
      }

      // Segunda etapa: Analisando com IA
      setLoadingMessage('Analisando imagem com IA...')

      // Analyze the photo with AI and upload to the backend
      const result = await itemsService.analyzeImage(photo.uri)

      // Esconde o loading
      hideLoading()

      // Pequeno delay para dar tempo da animação de saída e navegar para Minhas Imagens
      setTimeout(() => {
        // Navegar diretamente para a tela de Minhas Imagens com o ID da imagem criada
        router.push({
          pathname: '/home/items',
          params: {
            refresh: Date.now().toString(),
            openItemId: result.id, // Passar o ID da imagem para abrir o modal
          },
        })
      }, 250)
    } catch (error) {
      console.error('Error taking picture:', error)
      hideLoading()
      setTimeout(() => {
        Alert.alert(
          'Erro',
          'Não foi possível analisar a foto. Tente novamente.',
          [{ text: 'OK' }]
        )
      }, 250)
    }
  }

  function handleClose() {
    router.back()
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Feather name="x" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tirar Foto</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
              disabled={isCapturing}
            >
              <Feather name="rotate-cw" size={32} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>

      {/* Loading Overlay */}
      {isCapturing && (
        <Animated.View
          style={[
            styles.loadingOverlay,
            { opacity: loadingOpacity }
          ]}
        >
          <BlurView intensity={80} style={styles.blurView}>
            <View style={styles.loadingContent}>
              <View style={styles.loadingIconContainer}>
                <ActivityIndicator size="large" color={colors.green200} />
              </View>
              <Text style={styles.loadingText}>{loadingMessage}</Text>
              <Text style={styles.loadingSubtext}>
                Por favor, aguarde...
              </Text>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.gray600,
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: colors.green200,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  headerPlaceholder: {
    width: 44,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  flipButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.green200,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
  },
  placeholder: {
    width: 60,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loadingIconContainer: {
    marginBottom: 20,
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: colors.gray400,
    fontSize: 14,
    textAlign: 'center',
  },
})
