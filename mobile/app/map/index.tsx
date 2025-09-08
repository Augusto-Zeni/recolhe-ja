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
import { useNavigation } from '@/src/navigation/NavigationContext';

interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  distance: number;
  acceptedCategories: string[];
  openingHours: string;
  contact?: string;
}

export function Map() {
  const { goBack } = useNavigation();
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);

  const categories = [
    { id: 'plastic', name: 'Plástico', color: colors.green300, icon: '♻️' },
    { id: 'metal', name: 'Metal', color: '#FFB000', icon: '🔧' },
    { id: 'glass', name: 'Vidro', color: '#00BCD4', icon: '🍾' },
    { id: 'paper', name: 'Papel', color: '#2196F3', icon: '📄' },
    { id: 'organic', name: 'Orgânico', color: '#4CAF50', icon: '🍃' },
    { id: 'electronic', name: 'Eletrônico', color: '#9C27B0', icon: '🔌' },
  ];

  useEffect(() => {
    loadCollectionPoints();
  }, []);

  const loadCollectionPoints = async () => {
    try {
      // TODO: Implementar chamada para API
      // Mock data para demonstração
      const mockPoints: CollectionPoint[] = [
        {
          id: '1',
          name: 'Ecoponto Central',
          address: 'Rua das Flores, 123 - Centro',
          lat: -23.5505,
          lon: -46.6333,
          distance: 0.5,
          acceptedCategories: ['plastic', 'metal', 'glass', 'paper'],
          openingHours: 'Seg-Sex: 8h-18h, Sab: 8h-12h',
          contact: '(11) 1234-5678',
        },
        {
          id: '2',
          name: 'Supermercado Verde',
          address: 'Av. Principal, 456 - Jardim',
          lat: -23.5515,
          lon: -46.6343,
          distance: 1.2,
          acceptedCategories: ['plastic', 'paper'],
          openingHours: 'Seg-Dom: 7h-22h',
        },
        {
          id: '3',
          name: 'Centro de Reciclagem Tech',
          address: 'Rua da Tecnologia, 789 - Vila Nova',
          lat: -23.5495,
          lon: -46.6323,
          distance: 2.1,
          acceptedCategories: ['electronic', 'metal'],
          openingHours: 'Seg-Sex: 9h-17h',
          contact: '(11) 9876-5432',
        },
      ];
      
      setCollectionPoints(mockPoints);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar pontos de coleta');
    }
  };

  const filteredPoints = selectedCategory 
    ? collectionPoints.filter(point => 
        point.acceptedCategories.includes(selectedCategory)
      )
    : collectionPoints;

  const handleDirections = (point: CollectionPoint) => {
    // TODO: Implementar abertura do app de mapas
    Alert.alert(
      'Navegação', 
      `Abrindo direções para ${point.name}`
    );
  };

  const handleCall = (contact: string) => {
    // TODO: Implementar chamada telefônica
    Alert.alert('Contato', `Ligando para ${contact}`);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Pontos de Coleta</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              🗺️ Mapa será implementado aqui
            </Text>
            <Text style={styles.mapSubtext}>
              Integração com React Native Maps
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filtrar por categoria:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryFilter}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextSelected
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipSelected
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.categoryChipTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Points List */}
        <ScrollView style={styles.pointsList} showsVerticalScrollIndicator={false}>
          <Text style={styles.listTitle}>
            {filteredPoints.length} pontos encontrados
          </Text>
          
          {filteredPoints.map(point => (
            <TouchableOpacity
              key={point.id}
              style={[
                styles.pointCard,
                selectedPoint?.id === point.id && styles.pointCardSelected
              ]}
              onPress={() => setSelectedPoint(point)}
            >
              <View style={styles.pointHeader}>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointDistance}>{point.distance} km</Text>
              </View>
              
              <Text style={styles.pointAddress}>{point.address}</Text>
              
              <View style={styles.pointCategories}>
                {point.acceptedCategories.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return category ? (
                    <View 
                      key={catId} 
                      style={[styles.categoryBadge, { backgroundColor: category.color }]}
                    >
                      <Text style={styles.categoryBadgeText}>{category.name}</Text>
                    </View>
                  ) : null;
                })}
              </View>
              
              <Text style={styles.pointHours}>{point.openingHours}</Text>
              
              <View style={styles.pointActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDirections(point)}
                >
                  <Text style={styles.actionButtonText}>📍 Direções</Text>
                </TouchableOpacity>
                
                {point.contact && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall(point.contact!)}
                  >
                    <Text style={styles.actionButtonText}>📞 Contato</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
  mapContainer: {
    height: 200,
    backgroundColor: colors.gray100,
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mapPlaceholderText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.gray200,
  },
  mapSubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: colors.black200,
    marginBottom: 8,
  },
  categoryFilter: {
    maxHeight: 50,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray100,
    marginRight: 8,
    gap: 4,
  },
  categoryChipSelected: {
    backgroundColor: colors.green300,
    borderColor: colors.green300,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryChipText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.black200,
  },
  categoryChipTextSelected: {
    color: colors.white,
  },
  pointsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.black200,
    marginBottom: 16,
  },
  pointCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  pointCardSelected: {
    borderColor: colors.green300,
    borderWidth: 2,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.black200,
    flex: 1,
  },
  pointDistance: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.green300,
  },
  pointAddress: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
    marginBottom: 12,
  },
  pointCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: colors.white,
  },
  pointHours: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gray200,
    marginBottom: 12,
  },
  pointActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.green100,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.green300,
  },
});
