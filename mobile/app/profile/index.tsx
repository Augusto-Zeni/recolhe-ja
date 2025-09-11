import React, { useState } from 'react';
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
import { Input } from '@/src/components/InputText';
import { colors } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';
import { Image } from 'expo-image';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNavigation } from '@/src/navigation/NavigationContext';

export function Profile() {
  const { user, logout } = useAuth();
  const { goBack } = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
  });

  const handleSaveProfile = () => {
    // TODO: Implementar atualização do perfil
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const updateProfileData = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getUserStats = () => {
    // TODO: Implementar busca de estatísticas reais
    return {
      totalClassifications: 15,
      eventsParticipated: 3,
      pointsFound: 8,
      carbonFootprint: '2.5kg CO₂ evitados',
    };
  };

  const stats = getUserStats();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Meu Perfil</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>{isEditing ? 'Cancelar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileInitials}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Alterar Foto</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <Input
                value={profileData.name}
                onChangeText={(text) => updateProfileData('name', text)}
                editable={isEditing}
                inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <Input
                value={profileData.email}
                onChangeText={(text) => updateProfileData('email', text)}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <Input
                value={profileData.phone}
                onChangeText={(text) => updateProfileData('phone', text)}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholder="(11) 99999-9999"
                inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Localização</Text>
              <Input
                value={profileData.location}
                onChangeText={(text) => updateProfileData('location', text)}
                editable={isEditing}
                placeholder="Cidade, Estado"
                inputStyle={[styles.input, !isEditing && styles.inputDisabled]}
              />
            </View>

            {isEditing && (
              <Button variant="primary" onPress={handleSaveProfile}>
                <Text style={globalStyles.buttonText}>Salvar Alterações</Text>
              </Button>
            )}
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Minhas Estatísticas</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalClassifications}</Text>
                <Text style={styles.statLabel}>Itens Classificados</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.eventsParticipated}</Text>
                <Text style={styles.statLabel}>Eventos Participados</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.pointsFound}</Text>
                <Text style={styles.statLabel}>Pontos Encontrados</Text>
              </View>
              
              <View style={styles.statItemWide}>
                <Text style={styles.statNumber}>{stats.carbonFootprint}</Text>
                <Text style={styles.statLabel}>Impacto Ambiental</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button variant="secondary" onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento')}>
              <Text style={styles.buttonSecondaryText}>Configurações</Text>
            </Button>
            
            <Button variant="secondary" onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento')}>
              <Text style={styles.buttonSecondaryText}>Sobre o App</Text>
            </Button>
            
            <Button variant="secondary" onPress={handleLogout}>
              <Text style={[styles.buttonSecondaryText, { color: colors.red }]}>Sair da Conta</Text>
            </Button>
          </View>
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
  editButton: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.green300,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.green300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: colors.white,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.green300,
  },
  formContainer: {
    marginBottom: 32,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: colors.black200,
  },
  input: {
    height: 48,
  },
  inputDisabled: {
    backgroundColor: colors.gray100,
    color: colors.gray200,
  },
  statsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  statsTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: colors.black200,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    width: '45%',
  },
  statItemWide: {
    alignItems: 'center',
    width: '100%',
  },
  statNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: colors.green300,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gray200,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  buttonSecondaryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.green300,
  },
});

// Export default para compatibilidade com Expo Router
export default Profile;
