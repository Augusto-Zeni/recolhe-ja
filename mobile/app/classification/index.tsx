import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Text } from '@/src/components/Text';
import { Button } from '@/src/components/Button';
import { colors } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';
import { Image } from 'expo-image';
import { useNavigation } from '@/src/navigation/NavigationContext';

interface ClassificationResult {
  category: string;
  confidence: number;
  instruction: string;
  color: string;
}

export function Classification() {
  const { goBack, navigate } = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleTakePhoto = () => {
    // TODO: Implementar captura de foto com expo-camera
    Alert.alert('Câmera', 'Funcionalidade de câmera será implementada');
    // Simulando uma foto para demonstração
    setSelectedImage('https://via.placeholder.com/300x200');
  };

  const handleSelectFromGallery = () => {
    // TODO: Implementar seleção da galeria com expo-image-picker
    Alert.alert('Galeria', 'Seleção da galeria será implementada');
    // Simulando uma foto para demonstração
    setSelectedImage('https://via.placeholder.com/300x200');
  };

  const handleClassifyImage = async () => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Selecione uma imagem primeiro');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implementar chamada para API de classificação
      // Simulando resultado para demonstração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: ClassificationResult = {
        category: 'Plástico PET',
        confidence: 0.89,
        instruction: 'Este material é RECICLÁVEL. Descarte em lixeiras azuis ou pontos de coleta seletiva.',
        color: colors.green300,
      };
      
      setResult(mockResult);
      setShowResult(true);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao classificar a imagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindNearestPoint = () => {
    setShowResult(false);
    navigate('map');
  };

  const handleSaveToHistory = () => {
    // TODO: Implementar salvamento no histórico
    Alert.alert('Sucesso', 'Item salvo no seu histórico!');
  };

  const resetClassification = () => {
    setSelectedImage(null);
    setResult(null);
    setShowResult(false);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Classificar Resíduo</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {!selectedImage ? (
            // Selection State
            <View style={styles.selectionContainer}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📷</Text>
              </View>
              
              <Text style={styles.instructionTitle}>
                Como você quer enviar a foto?
              </Text>
              
              <Text style={styles.instructionText}>
                Tire uma foto do objeto ou selecione uma imagem da galeria para 
                identificar o tipo de resíduo e saber como descartá-lo corretamente.
              </Text>

              <View style={styles.actionButtons}>
                <Button variant="primary" onPress={handleTakePhoto}>
                  <Text style={globalStyles.buttonText}>📸 Tirar Foto</Text>
                </Button>
                
                <Button variant="secondary" onPress={handleSelectFromGallery}>
                  <Text style={styles.buttonSecondaryText}>🖼️ Selecionar da Galeria</Text>
                </Button>
              </View>
            </View>
          ) : (
            // Image Selected State
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.selectedImage}
                  contentFit="cover"
                />
              </View>
              
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={styles.changeImageButton} 
                  onPress={resetClassification}
                >
                  <Text style={styles.changeImageText}>Trocar Imagem</Text>
                </TouchableOpacity>
                
                <Button 
                  variant="primary" 
                  onPress={handleClassifyImage}
                  disabled={isLoading}
                >
                  <Text style={globalStyles.buttonText}>
                    {isLoading ? 'Analisando...' : '🔍 Classificar'}
                  </Text>
                </Button>
              </View>
            </View>
          )}
        </View>

        {/* Result Modal */}
        <Modal
          visible={showResult}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Resultado da Análise</Text>
                <TouchableOpacity onPress={() => setShowResult(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              {result && (
                <>
                  <View style={styles.resultContainer}>
                    <View style={[styles.categoryBadge, { backgroundColor: result.color }]}>
                      <Text style={styles.categoryText}>{result.category}</Text>
                    </View>
                    
                    <Text style={styles.confidenceText}>
                      Confiança: {Math.round(result.confidence * 100)}%
                    </Text>
                    
                    <Text style={styles.instructionText}>
                      {result.instruction}
                    </Text>
                  </View>

                  <View style={styles.modalActions}>
                    <Button variant="secondary" onPress={handleSaveToHistory}>
                      <Text style={styles.buttonSecondaryText}>💾 Salvar no Histórico</Text>
                    </Button>
                    
                    <Button variant="primary" onPress={handleFindNearestPoint}>
                      <Text style={globalStyles.buttonText}>📍 Encontrar Ponto Próximo</Text>
                    </Button>
                  </View>
                </>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.green300,
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.black200,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  selectionContainer: {
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.green100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  instructionTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
    color: colors.black200,
    textAlign: 'center',
  },
  instructionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.gray200,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  buttonSecondaryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.green300,
  },
  imageContainer: {
    gap: 24,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
  },
  selectedImage: {
    width: '100%',
    height: 300,
  },
  imageActions: {
    gap: 12,
  },
  changeImageButton: {
    padding: 12,
    alignItems: 'center',
  },
  changeImageText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.gray200,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    color: colors.black200,
  },
  closeButton: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
    color: colors.gray200,
    padding: 8,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  categoryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.white,
  },
  confidenceText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.gray200,
  },
  modalActions: {
    gap: 12,
  },
});

// Export default para compatibilidade com Expo Router
export default Classification;
