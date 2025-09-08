import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Text } from '@/src/components/Text';
import { Button } from '@/src/components/Button';
import { colors } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';
import { Image } from 'expo-image';
import { useNavigation } from '@/src/navigation/NavigationContext';

interface HistoryItem {
  id: string;
  imageUrl: string;
  predictedCategory: string;
  confidence: number;
  createdAt: string;
}

export function History() {
  const { goBack, navigate } = useNavigation();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories: { [key: string]: { name: string; color: string; icon: string } } = {
    plastic: { name: 'Plástico', color: colors.green300, icon: '♻️' },
    metal: { name: 'Metal', color: '#FFB000', icon: '🔧' },
    glass: { name: 'Vidro', color: '#00BCD4', icon: '🍾' },
    paper: { name: 'Papel', color: '#2196F3', icon: '📄' },
    organic: { name: 'Orgânico', color: '#4CAF50', icon: '🍃' },
    electronic: { name: 'Eletrônico', color: '#9C27B0', icon: '🔌' },
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Implementar chamada para API
      // Mock data para demonstração
      const mockHistory: HistoryItem[] = [
        {
          id: '1',
          imageUrl: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=PET',
          predictedCategory: 'plastic',
          confidence: 0.92,
          createdAt: '2025-09-08T14:30:00Z',
        },
        {
          id: '2',
          imageUrl: 'https://via.placeholder.com/100x100/2196F3/FFFFFF?text=PAPER',
          predictedCategory: 'paper',
          confidence: 0.87,
          createdAt: '2025-09-07T10:15:00Z',
        },
        {
          id: '3',
          imageUrl: 'https://via.placeholder.com/100x100/FFB000/FFFFFF?text=METAL',
          predictedCategory: 'metal',
          confidence: 0.95,
          createdAt: '2025-09-06T16:45:00Z',
        },
        {
          id: '4',
          imageUrl: 'https://via.placeholder.com/100x100/00BCD4/FFFFFF?text=GLASS',
          predictedCategory: 'glass',
          confidence: 0.78,
          createdAt: '2025-09-05T09:20:00Z',
        },
        {
          id: '5',
          imageUrl: 'https://via.placeholder.com/100x100/9C27B0/FFFFFF?text=TECH',
          predictedCategory: 'electronic',
          confidence: 0.83,
          createdAt: '2025-09-04T13:10:00Z',
        },
      ];
      
      setHistoryItems(mockHistory);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar histórico');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja remover este item do histórico?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setHistoryItems(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const handleFindPointsForCategory = (category: string) => {
    // TODO: Implementar navegação para mapa com filtro da categoria
    navigate('map');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  const getStatistics = () => {
    const total = historyItems.length;
    const categoryCounts = historyItems.reduce((acc, item) => {
      acc[item.predictedCategory] = (acc[item.predictedCategory] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return { total, categoryCounts };
  };

  const { total, categoryCounts } = getStatistics();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Meu Histórico</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Statistics */}
        {total > 0 && (
          <View style={styles.statisticsContainer}>
            <Text style={styles.statisticsTitle}>Estatísticas</Text>
            <View style={styles.statisticsGrid}>
              <View style={styles.statisticsItem}>
                <Text style={styles.statisticsNumber}>{total}</Text>
                <Text style={styles.statisticsLabel}>Total de itens</Text>
              </View>
              
              {Object.entries(categoryCounts).map(([category, count]) => {
                const categoryInfo = categories[category];
                return categoryInfo ? (
                  <View key={category} style={styles.statisticsItem}>
                    <Text style={styles.statisticsNumber}>{count}</Text>
                    <Text style={styles.statisticsLabel}>{categoryInfo.icon} {categoryInfo.name}</Text>
                  </View>
                ) : null;
              })}
            </View>
          </View>
        )}

        {/* History List */}
        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando histórico...</Text>
            </View>
          ) : historyItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📊</Text>
              <Text style={styles.emptyStateTitle}>Histórico vazio</Text>
              <Text style={styles.emptyStateSubtitle}>
                Comece a classificar itens para ver seu histórico aqui!
              </Text>
              <Button variant="primary" onPress={() => navigate('classification')}>
                <Text style={globalStyles.buttonText}>Classificar primeiro item</Text>
              </Button>
            </View>
          ) : (
            historyItems.map((item) => {
              const categoryInfo = categories[item.predictedCategory];
              return (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.itemImageContainer}>
                    <Image 
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                      contentFit="cover"
                    />
                  </View>
                  
                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <View style={styles.categoryInfo}>
                        {categoryInfo && (
                          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
                            <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                            <Text style={styles.categoryText}>{categoryInfo.name}</Text>
                          </View>
                        )}
                        <Text style={styles.confidenceText}>
                          {Math.round(item.confidence * 100)}% de confiança
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteItem(item.id)}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
                    
                    <TouchableOpacity
                      style={styles.findPointsButton}
                      onPress={() => handleFindPointsForCategory(item.predictedCategory)}
                    >
                      <Text style={styles.findPointsText}>
                        📍 Encontrar pontos para {categoryInfo?.name || item.predictedCategory}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  statisticsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  statisticsTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.black200,
    marginBottom: 16,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statisticsItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statisticsNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: colors.green300,
  },
  statisticsLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gray200,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.gray200,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateIcon: {
    fontSize: 48,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.black200,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  itemImageContainer: {
    marginRight: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.white,
  },
  confidenceText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gray200,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  itemDate: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gray200,
    marginBottom: 12,
  },
  findPointsButton: {
    backgroundColor: colors.green100,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  findPointsText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.green300,
  },
});
