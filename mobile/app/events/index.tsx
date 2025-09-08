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

interface Event {
  id: string;
  title: string;
  description: string;
  lat: number;
  lon: number;
  startAt: string;
  endAt: string;
  acceptedCategories: string[];
  createdBy: string;
  participantsCount: number;
  isParticipating: boolean;
  distance: number;
}

export function Events() {
  const { goBack } = useNavigation();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'participating'>('upcoming');

  const categories = [
    { id: 'plastic', name: 'Plástico', color: colors.green300, icon: '♻️' },
    { id: 'metal', name: 'Metal', color: '#FFB000', icon: '🔧' },
    { id: 'glass', name: 'Vidro', color: '#00BCD4', icon: '🍾' },
    { id: 'paper', name: 'Papel', color: '#2196F3', icon: '📄' },
    { id: 'organic', name: 'Orgânico', color: '#4CAF50', icon: '🍃' },
    { id: 'electronic', name: 'Eletrônico', color: '#9C27B0', icon: '🔌' },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // TODO: Implementar chamada para API
      // Mock data para demonstração
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Mutirão de Limpeza - Parque Central',
          description: 'Vamos limpar nosso parque! Traga luvas e garrafas de água. Materiais de limpeza serão fornecidos.',
          lat: -23.5505,
          lon: -46.6333,
          startAt: '2025-09-15T08:00:00Z',
          endAt: '2025-09-15T12:00:00Z',
          acceptedCategories: ['plastic', 'metal', 'glass', 'paper'],
          createdBy: 'ONG Verde Cidade',
          participantsCount: 23,
          isParticipating: false,
          distance: 1.2,
        },
        {
          id: '2',
          title: 'Coleta de Eletrônicos',
          description: 'Descarte correto de equipamentos eletrônicos antigos. Computadores, celulares, TVs e mais.',
          lat: -23.5515,
          lon: -46.6343,
          startAt: '2025-09-20T09:00:00Z',
          endAt: '2025-09-20T17:00:00Z',
          acceptedCategories: ['electronic'],
          createdBy: 'Tech Recycling',
          participantsCount: 8,
          isParticipating: true,
          distance: 2.5,
        },
        {
          id: '3',
          title: 'Oficina de Compostagem',
          description: 'Aprenda a fazer compostagem doméstica e transformar restos orgânicos em adubo.',
          lat: -23.5495,
          lon: -46.6323,
          startAt: '2025-09-25T14:00:00Z',
          endAt: '2025-09-25T17:00:00Z',
          acceptedCategories: ['organic'],
          createdBy: 'Horta Comunitária',
          participantsCount: 15,
          isParticipating: false,
          distance: 0.8,
        },
      ];
      
      setEvents(mockEvents);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar eventos');
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      // TODO: Implementar chamada para API
      Alert.alert('Sucesso', 'Você se inscreveu no evento!');
      
      // Atualizar estado local
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isParticipating: true, participantsCount: event.participantsCount + 1 }
          : event
      ));
    } catch (error) {
      Alert.alert('Erro', 'Falha ao se inscrever no evento');
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      // TODO: Implementar chamada para API
      Alert.alert('Sucesso', 'Você saiu do evento!');
      
      // Atualizar estado local
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isParticipating: false, participantsCount: event.participantsCount - 1 }
          : event
      ));
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair do evento');
    }
  };

  const handleCreateEvent = () => {
    // TODO: Implementar navegação para tela de criação
    Alert.alert('Criar Evento', 'Funcionalidade será implementada');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEvents = selectedTab === 'participating' 
    ? events.filter(event => event.isParticipating)
    : events;

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Eventos</Text>
          <TouchableOpacity onPress={handleCreateEvent}>
            <Text style={styles.createButton}>+ Criar</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'upcoming' && styles.tabActive]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.tabTextActive]}>
              Próximos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'participating' && styles.tabActive]}
            onPress={() => setSelectedTab('participating')}
          >
            <Text style={[styles.tabText, selectedTab === 'participating' && styles.tabTextActive]}>
              Participando
            </Text>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📅</Text>
              <Text style={styles.emptyStateTitle}>
                {selectedTab === 'participating' 
                  ? 'Você não está participando de nenhum evento'
                  : 'Nenhum evento encontrado'
                }
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedTab === 'participating'
                  ? 'Explore eventos próximos e participe da comunidade!'
                  : 'Crie um novo evento ou aguarde novos eventos serem criados.'
                }
              </Text>
            </View>
          ) : (
            filteredEvents.map(event => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDistance}>{event.distance} km</Text>
                </View>
                
                <Text style={styles.eventOrganizer}>Por: {event.createdBy}</Text>
                
                <Text style={styles.eventDescription}>{event.description}</Text>
                
                <View style={styles.eventDetails}>
                  <View style={styles.eventDateTime}>
                    <Text style={styles.eventDate}>
                      📅 {formatDate(event.startAt)}
                    </Text>
                    <Text style={styles.eventTime}>
                      🕐 {formatTime(event.startAt)} - {formatTime(event.endAt)}
                    </Text>
                  </View>
                  
                  <Text style={styles.eventParticipants}>
                    👥 {event.participantsCount} participantes
                  </Text>
                </View>
                
                <View style={styles.eventCategories}>
                  <Text style={styles.categoriesLabel}>Aceita:</Text>
                  <View style={styles.categoriesContainer}>
                    {event.acceptedCategories.map(catId => {
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
                </View>
                
                <View style={styles.eventActions}>
                  {event.isParticipating ? (
                    <Button 
                      variant="secondary" 
                      onPress={() => handleLeaveEvent(event.id)}
                    >
                      <Text style={styles.buttonSecondaryText}>Sair do Evento</Text>
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      onPress={() => handleJoinEvent(event.id)}
                    >
                      <Text style={globalStyles.buttonText}>Participar</Text>
                    </Button>
                  )}
                </View>
              </View>
            ))
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
  createButton: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.green300,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
  },
  tabTextActive: {
    color: colors.green300,
    fontFamily: 'Poppins_500Medium',
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 24,
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
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.black200,
    flex: 1,
    marginRight: 8,
  },
  eventDistance: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.green300,
  },
  eventOrganizer: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gray200,
    marginBottom: 12,
  },
  eventDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDateTime: {
    marginBottom: 8,
  },
  eventDate: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.black200,
    marginBottom: 4,
  },
  eventTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.black200,
  },
  eventParticipants: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.green300,
  },
  eventCategories: {
    marginBottom: 16,
  },
  categoriesLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.black200,
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
  eventActions: {
    flexDirection: 'row',
  },
  buttonSecondaryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.green300,
  },
});
