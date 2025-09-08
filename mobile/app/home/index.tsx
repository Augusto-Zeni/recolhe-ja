import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text } from '@/src/components/Text';
import { Button } from '@/src/components/Button';
import { colors } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';
import { Image } from 'expo-image';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNavigation } from '@/src/navigation/NavigationContext';

export function Home() {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();

  const handleTakePhoto = () => {
    navigate('classification');
  };

  const handleOpenMap = () => {
    navigate('map');
  };

  const handleViewEvents = () => {
    navigate('events');
  };

  const handleViewHistory = () => {
    navigate('history');
  };

  const handleCreateEvent = () => {
    // TODO: Implementar navegação para criação de evento
    Alert.alert('Funcionalidade', 'Criação de evento será implementada');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/Logo.svg')} 
              contentFit='contain' 
              style={styles.logo} 
            />
            <Text style={styles.logoText}>RecicleJá</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigate('profile')} style={styles.profileButton}>
            <Text style={styles.profileInitial}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Olá, {user?.name || 'Usuário'}!</Text>
          <Text style={styles.subtitleText}>
            O que você gostaria de fazer hoje?
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          {/* Classificar Resíduo */}
          <TouchableOpacity style={styles.mainAction} onPress={handleTakePhoto}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📷</Text>
            </View>
            <Text style={styles.actionTitle}>Classificar Resíduo</Text>
            <Text style={styles.actionSubtitle}>
              Tire uma foto e descubra como descartar corretamente
            </Text>
          </TouchableOpacity>

          {/* Pontos de Coleta */}
          <TouchableOpacity style={styles.secondaryAction} onPress={handleOpenMap}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📍</Text>
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Pontos de Coleta</Text>
              <Text style={styles.actionSubtitle}>
                Encontre o local mais próximo
              </Text>
            </View>
          </TouchableOpacity>

          {/* Eventos */}
          <TouchableOpacity style={styles.secondaryAction} onPress={handleViewEvents}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🗓️</Text>
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Eventos de Coleta</Text>
              <Text style={styles.actionSubtitle}>
                Participe de ações comunitárias
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Secondary Actions */}
        <View style={styles.secondaryActionsContainer}>
          <Button variant="secondary" onPress={handleViewHistory}>
            <Text style={styles.buttonSecondaryText}>Meu Histórico</Text>
          </Button>

          <Button variant="primary" onPress={handleCreateEvent}>
            <Text style={globalStyles.buttonText}>Criar Evento</Text>
          </Button>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Dica do Dia</Text>
          <Text style={styles.tipsText}>
            Separe os materiais recicláveis dos orgânicos. Isso facilita o processo 
            de reciclagem e ajuda o meio ambiente!
          </Text>
        </View>
      </ScrollView>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.green300,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  welcomeContainer: {
    marginVertical: 24,
  },
  welcomeText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: colors.black200,
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.gray200,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  mainAction: {
    backgroundColor: colors.green100,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  secondaryAction: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.black200,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
  },
  secondaryActionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  buttonSecondaryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.green300,
  },
  tipsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gray100,
    marginBottom: 24,
  },
  tipsTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.black200,
    marginBottom: 8,
  },
  tipsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.gray200,
    lineHeight: 20,
  },
});
