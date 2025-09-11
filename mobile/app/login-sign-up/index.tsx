import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/InputText'
import { Text } from '@/src/components/Text'
import { colors } from '@/src/styles/colors'
import { globalStyles } from '@/src/styles/globalStyles'
import { useAuth } from '@/src/contexts/AuthContext'
import { Image } from 'expo-image'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'

export default function LoginSignUp() {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  
  const { login, register, isLoading } = useAuth()

  const handleSwitchText = (isLogin: boolean) => {
    setIsLogin(isLogin)
    setFormData({ name: '', email: '', password: '' })
  }

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios')
      return
    }

    if (!isLogin && !formData.name) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios')
      return
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register(formData.name, formData.email, formData.password)
      }
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Falha na autenticação')
    }
  }

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContent}>
            <Image source={require('@/assets/Logo.svg')} contentFit='contain' style={styles.logo} />
            <Text style={styles.logoText}>RecicleJá</Text>
          </View>

          <View style={styles.containerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Olá,</Text>
              <Text style={styles.title}>Seja Bem-Vindo</Text>
            </View>

            <View style={styles.switchContainer}>
              <TouchableOpacity onPress={() => handleSwitchText(true)}>
                <Text style={[styles.switchText, isLogin && styles.selectedSwitch]}>Já tenho uma conta</Text>
              </TouchableOpacity>
              <Text style={styles.switchText}>/</Text>
              <TouchableOpacity onPress={() => handleSwitchText(false)}>
                <Text style={[styles.switchText, !isLogin && styles.selectedSwitch]}>Não tenho uma conta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {isLogin ? (
                <>
                  <Input 
                    placeholder='Email' 
                    inputStyle={{ height: 56 }} 
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Input 
                    placeholder='Senha' 
                    inputStyle={{ height: 56 }} 
                    secureTextEntry 
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                  />
                </>
              ) : (
                <>
                  <Input 
                    placeholder='Nome Completo' 
                    inputStyle={{ height: 56 }} 
                    value={formData.name}
                    onChangeText={(text) => updateFormData('name', text)}
                  />
                  <Input 
                    placeholder='Email' 
                    inputStyle={{ height: 56 }} 
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Input 
                    placeholder='Senha' 
                    inputStyle={{ height: 56 }} 
                    secureTextEntry 
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                  />
                </>
              )}
            </View>

            <Button 
              variant='primary' 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={globalStyles.buttonText}>
                {isLoading ? 'Carregando...' : (isLogin ? 'LOGIN' : 'CADASTRAR')}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContent: {
    display: 'flex',
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 42,
    height: 42,
  },
  logoText: {
    fontFamily: 'Poppins_300Light',
    lineHeight: 32,
    fontSize: 16,
  },
  containerContent: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    gap: 12
  },
  titleContainer: {
    display: 'flex',
  },
  title: {
    fontSize: 42,
    lineHeight: 45,
    fontFamily: 'Poppins_200ExtraLight',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  switchText: {
    fontSize: 15,
  },
  selectedSwitch: {
    color: colors.green300,
  },
  form: {
    gap: 12,
  },
})